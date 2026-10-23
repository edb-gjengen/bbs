import os
from datetime import datetime, time, timedelta
from decimal import Decimal

from django.contrib.auth import get_user_model
from django.core.management import BaseCommand
from django.db.models import Sum
from django.utils import timezone

from bbs.models import InventoryTransaction, Order, OrderLine, Product, Transaction, UserProfile

DEMO_USERS = (
    ("demo-ada", "Ada", "Nord", "ada@example.test", Decimal("300.0")),
    ("demo-bjørn", "Bjørn", "Berg", "bjorn@example.test", Decimal("250.0")),
    ("demo-casey", "Casey", "Sol", "casey@example.test", Decimal("200.0")),
)

DEMO_PRODUCTS = (
    ("Demo Cola", Decimal("25.0"), Decimal("30.0"), 30),
    ("Demo Kaffe", Decimal("15.0"), Decimal("20.0"), 30),
    ("Demo Sjokolade", Decimal("20.0"), Decimal("25.0"), 30),
    ("Demo Energidrikk", Decimal("35.0"), Decimal("40.0"), 30),
)


class Command(BaseCommand):
    help = "Create repeatable demo users, products, deposits, and orders for local testing."

    def handle(self, *args, **options):  # noqa: ARG002
        users = self.seed_users()
        products = self.seed_products(users[0][0])
        self.seed_deposits(users)
        self.seed_orders(users, products)
        self.update_balances(users)
        self.create_admin()

        self.stdout.write(self.style.SUCCESS("Demo data is ready."))
        if not os.environ.get("BBS_SEED_ADMIN_PASSWORD"):
            self.stdout.write("Create an admin login with: uv run manage.py createsuperuser")

    @staticmethod
    def seed_users():
        user_model = get_user_model()
        users = []
        for username, first_name, last_name, email, deposit_amount in DEMO_USERS:
            user, _ = user_model.objects.get_or_create(
                username=username,
                defaults={"first_name": first_name, "last_name": last_name, "email": email},
            )
            UserProfile.objects.get_or_create(user=user)
            users.append((user, deposit_amount))
        return users

    @staticmethod
    def seed_products(stock_user):
        products = {}
        for name, sale_price_int, sale_price_ext, stock in DEMO_PRODUCTS:
            product, created = Product.objects.get_or_create(
                name=name,
                defaults={
                    "sale_price_int": sale_price_int,
                    "sale_price_ext": sale_price_ext,
                    "inventory_amount": stock,
                    "description": "Demo product for local development.",
                },
            )
            products[name] = product
            if created:
                InventoryTransaction.objects.get_or_create(
                    user=stock_user,
                    product=product,
                    comment="Demo opening stock",
                    defaults={"amount": stock, "unit_price": Decimal("10.0")},
                )
        return products

    def seed_deposits(self, users):
        for index, (user, deposit_amount) in enumerate(users):
            created_at = self.timestamp(days_ago=32 + index)
            deposit, created = Transaction.objects.get_or_create(
                user=user,
                created=created_at,
                defaults={"amount": deposit_amount},
            )
            if created:
                deposit.created = created_at
                deposit.save(update_fields=["created"])

    def seed_orders(self, users, products):
        orders = (
            (0, 24, (("Demo Cola", 2), ("Demo Sjokolade", 1))),
            (1, 19, (("Demo Kaffe", 2), ("Demo Sjokolade", 1))),
            (2, 11, (("Demo Energidrikk", 1),)),
            (0, 4, (("Demo Kaffe", 1), ("Demo Cola", 1))),
            (1, 1, (("Demo Cola", 2),)),
        )
        for user_index, days_ago, lines in orders:
            user = users[user_index][0]
            created_at = self.timestamp(days_ago=days_ago)
            total = sum(
                (products[name].sale_price_int * amount for name, amount in lines),
                start=Decimal(0),
            )
            order, created = Order.objects.get_or_create(
                customer=user,
                created=created_at,
                defaults={"order_sum": total},
            )
            if created:
                order.created = created_at
                order.save(update_fields=["created"])
                for name, amount in lines:
                    product = products[name]
                    OrderLine.objects.create(
                        order=order,
                        product=product,
                        amount=amount,
                        unit_price=product.sale_price_int,
                    )
                    product.inventory_amount -= amount
                    product.save(update_fields=["inventory_amount"])

    @staticmethod
    def update_balances(users):
        for user, _ in users:
            deposits = Transaction.objects.filter(user=user).aggregate(total=Sum("amount"))["total"] or Decimal(0)
            purchases = Order.objects.filter(customer=user).aggregate(total=Sum("order_sum"))["total"] or Decimal(0)
            profile = user.profile
            profile.balance = deposits - purchases
            profile.save(update_fields=["balance"])

    def create_admin(self):
        admin_password = os.environ.get("BBS_SEED_ADMIN_PASSWORD")
        if not admin_password:
            return

        user_model = get_user_model()
        if user_model.objects.filter(username="admin").exists():
            self.stdout.write("Existing 'admin' account left unchanged.")
        else:
            user_model.objects.create_superuser(
                username="admin",
                email="admin@example.test",
                password=admin_password,
            )
            self.stdout.write("Created superuser 'admin'.")

    @staticmethod
    def timestamp(days_ago: int) -> datetime:
        date = timezone.localdate() - timedelta(days=days_ago)
        return timezone.make_aware(datetime.combine(date, time(hour=12)))
