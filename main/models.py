from datetime import datetime
from typing import Type

from django.conf import settings
from django.db import models
from django.db.models import Count, Sum
from django.db.models.functions import Extract, ExtractHour, ExtractMonth, ExtractWeekDay, ExtractYear

EXTERNAL_USER = "Ekstern"


def _format_counts(per_user):
    per_user = list(per_user)
    for row in per_user:
        if row.get("order__customer__first_name") is None:
            who = EXTERNAL_USER
        else:
            first_name = row.pop("order__customer__first_name")
            last_name = row.pop("order__customer__last_name")
            last_name_initial = f" {last_name[0]}" if last_name else ""
            who = f"{first_name}{last_name_initial}"
        row["name"] = who

    return per_user


class Product(models.Model):
    name = models.CharField(max_length=64)
    sale_price_int = models.FloatField()
    sale_price_ext = models.FloatField()
    description = models.CharField(max_length=256, blank=True)
    volume_liter = models.FloatField(null=True)
    alcohol_percent = models.FloatField(null=True)
    image = models.ImageField(upload_to="products", blank=True)
    customer_support = models.CharField(max_length=32, blank=True)
    inventory_amount = models.FloatField(default=0)
    active = models.BooleanField(default=True)
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)

    @property
    def wholesale_unit_price(self):
        """
        This is not accurate.
        """
        if self.inventory_amount <= 0:
            return 0

        unit_prices = self.transactions.order_by("created").values("amount", "unit_price")
        sum_units = 0
        for up in unit_prices:
            sum_units += up["amount"]
            if self.inventory_amount <= sum_units:
                return up["unit_price"]

        if len(unit_prices) > 0:
            return unit_prices[0]["unit_price"]

        return 0

    @property
    def wholesale_value(self):
        return self.wholesale_unit_price * self.inventory_amount

    @property
    def image_url(self):
        return self.image.url if self.image else ""

    def user_counts(self):
        name_fields = ["order__customer__first_name", "order__customer__last_name"]
        per_user = OrderLine.objects.filter(product=self)
        per_user = per_user.values(*name_fields).annotate(count=Sum("amount")).order_by("-count")

        return _format_counts(per_user)

    def __str__(self):
        return self.name

    class Meta:
        ordering = ["name"]


class OrderManager(models.Manager):
    def count_by_created(self, extract_class: Type[Extract]):
        period = extract_class("created")
        return self.get_queryset().annotate(period=period).values("period").annotate(count=Count("id"))

    def count_by_created_period(self, period: str):
        periods = {"yearly": ExtractYear, "monthly": ExtractMonth, "daily": ExtractWeekDay, "hourly": ExtractHour}
        assert period in periods
        return self.count_by_created(periods[period])


class Order(models.Model):
    customer = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="orders",
    )
    order_sum = models.FloatField(db_column="sum")
    created = models.DateTimeField(auto_now_add=True)

    objects = OrderManager()

    def is_external(self):
        return self.customer is None

    def reciept(self):
        return "{}".format(", ".join([str(ol) for ol in self.orderlines.all()]))

    def __str__(self):
        return "{}: {} kr".format(self.customer or EXTERNAL_USER, self.order_sum)


class OrderLine(models.Model):
    order = models.ForeignKey("main.Order", on_delete=models.CASCADE, related_name="orderlines")
    product = models.ForeignKey("main.Product", on_delete=models.CASCADE, related_name="orderlines")
    amount = models.IntegerField()
    unit_price = models.FloatField(verbose_name="Enhetspris")

    @property
    def price(self):
        return self.amount * self.unit_price

    def __str__(self):
        return "{} {} ({} kr per)".format(self.amount, self.product, self.unit_price)

    class Meta:
        unique_together = ("order", "product")


class Transaction(models.Model):
    """Money"""

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="transactions")
    amount = models.FloatField()
    created = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return "{}: {}: {}".format(self.id, self.user, self.amount)


class InventoryTransaction(models.Model):
    """Goods"""

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="inventory_transactions",
    )
    product = models.ForeignKey(
        "main.Product",
        on_delete=models.CASCADE,
        related_name="transactions",
        verbose_name="Produkt",
    )
    amount = models.FloatField(verbose_name="Antall")
    unit_price = models.FloatField(verbose_name="Enhetspris")
    comment = models.TextField(verbose_name="Kommentar", blank=True)
    created = models.DateTimeField(auto_now_add=True)

    @property
    def price(self):
        return self.amount * self.unit_price

    def __str__(self):
        return "{}: {}: {}. {:.0f} stykker ({} kr per)".format(
            self.id, self.user, self.product, self.amount, self.unit_price
        )


class UserProfile(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="profile")
    balance = models.FloatField(default=0.0)
    image = models.URLField(blank=True)

    def last_purchase(self):
        if len(self.user.orders.all()) == 0:
            return None

        return self.user.orders.order_by("-created")[0]

    def last_purchase_date(self):
        last = self.last_purchase()
        last_p = last.created if last else datetime.min
        return last_p

    def profile_image_url(self):
        from django.templatetags.static import static

        if not self.image:
            return static("dist/images/unknown_person.png")

        return self.image

    def __str__(self):
        return "{}".format(self.user)
