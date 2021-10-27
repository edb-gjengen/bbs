from __future__ import unicode_literals
from datetime import datetime

from django.conf import settings
from django.db import models
from django.utils.translation import ugettext_lazy as _



class Product(models.Model):
    name = models.CharField(max_length=64)
    sale_price_int = models.FloatField()
    sale_price_ext = models.FloatField()
    description = models.CharField(max_length=256, blank=True)
    volume_liter = models.FloatField(null=True)
    alcohol_percent = models.FloatField(null=True)
    image = models.ImageField(upload_to='products', blank=True)
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

        unit_prices = self.transactions.order_by('created').values('amount', 'unit_price')
        sum_units = 0
        for up in unit_prices:
            sum_units += up['amount']
            if self.inventory_amount <= sum_units:
                return up['unit_price']

        if len(unit_prices) > 0:
            return unit_prices[0]['unit_price']

        return 0

    @property
    def wholesale_value(self):
        return self.wholesale_unit_price * self.inventory_amount

    def __str__(self):
        return self.name

    class Meta:
        ordering = ['name']



class Order(models.Model):
    customer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, null=True, blank=True, related_name='orders')
    order_sum = models.FloatField(db_column='sum')
    created = models.DateTimeField(auto_now_add=True)

    def is_external(self):
        return self.customer is None

    def reciept(self):
        return "{}".format(", ".join([str(ol) for ol in self.orderlines.all()]))

    def __str__(self):
        return "{}: {} kr".format(self.customer or "Ekstern", self.order_sum)



class OrderLine(models.Model):
    order = models.ForeignKey('main.Order', on_delete=models.CASCADE, related_name='orderlines')
    product = models.ForeignKey('main.Product', on_delete=models.CASCADE, related_name='orderlines')
    amount = models.IntegerField()
    unit_price = models.FloatField(verbose_name=_('Enhetspris'))

    @property
    def price(self):
        return self.amount * self.unit_price

    def __str__(self):
        return "{} {} ({} kr per)".format(self.amount, self.product, self.unit_price)

    class Meta:
        unique_together = ('order', 'product')



class Transaction(models.Model):
    """ Money """
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='transactions')
    amount = models.FloatField()
    created = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return "{}: {}: {}".format(self.id, self.user, self.amount)



class InventoryTransaction(models.Model):
    """ Goods """
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='inventory_transactions')
    product = models.ForeignKey('main.Product', on_delete=models.CASCADE, related_name='transactions', verbose_name=_('Produkt'))
    amount = models.FloatField(verbose_name=_('Antall'))
    unit_price = models.FloatField(verbose_name=_('Enhetspris'))
    comment = models.TextField(verbose_name=_('Kommentar'), blank=True)
    created = models.DateTimeField(auto_now_add=True)

    @property
    def price(self):
        return self.amount * self.unit_price

    def __str__(self):
        return "{}: {}: {}. {:.0f} stykker ({} kr per)".format(
            self.id,
            self.user,
            self.product,
            self.amount,
            self.unit_price)



class UserProfile(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='profile')
    balance = models.FloatField(default=0.0)
    image = models.URLField(blank=True)

    def last_purchase(self):
        if len(self.user.orders.all()) == 0:
            return None

        return self.user.orders.order_by('-created')[0]

    def last_purchase_date(self):
        last = self.last_purchase()
        last_p = last.created if last else datetime.min
        return last_p

    def profile_image_url(self):
        from django.templatetags.static import static

        if not self.image:
            return static('dist/images/unknown_person.png')

        return self.image

    def __str__(self):
        return "{}".format(self.user)
