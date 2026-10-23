import os
import random
from datetime import datetime, time, timedelta
from decimal import Decimal
from urllib.parse import quote

from django.contrib.auth import get_user_model
from django.core.management import BaseCommand, CommandParser
from django.db import transaction as db_transaction
from django.db.models import Sum
from django.utils import timezone

from bbs.models import InventoryTransaction, Order, OrderLine, Product, Transaction, UserProfile

# Some users go by first name only, which the frontend handles differently.
DEMO_USERS = (
    ("demo-ada", "Ada", "Nord", "ada@example.test", Decimal("300.0")),
    ("demo-bjørn", "Bjørn", "Berg", "bjorn@example.test", Decimal("250.0")),
    ("demo-casey", "Casey", "Sol", "casey@example.test", Decimal("200.0")),
    ("demo-kari", "Kari", "Nordmann", "kari@example.test", Decimal("400.0")),
    ("demo-ole-martin", "Ole-Martin", "Ødegård", "ole-martin@example.test", Decimal("300.0")),
    ("demo-solveig", "Solveig", "", "solveig@example.test", Decimal("250.0")),
    ("demo-trygve", "Trygve", "Halvorsen", "trygve@example.test", Decimal("200.0")),
    ("demo-ingrid", "Ingrid", "Bakken", "ingrid@example.test", Decimal("350.0")),
    ("demo-håkon", "Håkon", "", "hakon@example.test", Decimal("150.0")),
)

# name, volume_liter, alcohol_percent, sale_price_int, sale_price_ext
BEERS = (
    ("Frydenlund Fatøl", "0.5", "4.5", "25", "35"),
    ("Ringnes Pilsner", "0.5", "4.7", "25", "35"),
    ("Nøgne Ø India Pale Ale", "0.5", "7.5", "45", "60"),
    ("Lervig Lucky Jack", "0.33", "4.7", "40", "55"),
    ("Munkholm Alkoholfri", "0.5", "0.5", "20", "28"),
    ("Haandbryggeriet Mjød", "0.5", "8.0", "55", "70"),
    ("Hansa Bayer", "0.5", "4.6", "27", "37"),
    ("Aass Bayer", "0.5", "4.5", "28", "38"),
    ("Mack Pilsner", "0.5", "4.7", "28", "38"),
    ("Dahls Pils", "0.5", "4.5", "25", "35"),
    ("Borg Bryggeri Pils", "0.5", "4.7", "30", "40"),
    ("Grans Bare Pils", "0.5", "4.7", "24", "34"),
    ("CB Pilsner", "0.5", "4.7", "25", "35"),
    ("7 Fjell Hopyards IPA", "0.33", "6.5", "48", "63"),
    ("Tuborg Grønn", "0.5", "4.6", "28", "38"),
    ("Carlsberg Pilsner", "0.5", "4.6", "28", "38"),
    ("Frydenlund Bayer", "0.5", "4.5", "26", "36"),
    ("Berentsens Julebrygg", "0.5", "4.7", "32", "42"),
    ("Ægir Sumble", "0.5", "4.7", "42", "57"),
    ("Kinn Vestkyst", "0.5", "5.2", "46", "61"),
    ("Trondhjem Pilsner", "0.5", "4.7", "30", "40"),
    ("Nøgne Ø Pale Ale", "0.5", "4.5", "44", "59"),
    ("Voss Bryggeri Pils", "0.5", "4.7", "38", "50"),
    ("Lervig Pils", "0.33", "4.7", "30", "40"),
)
DEMO_PRODUCTS = BEERS[:6]
DEMO_STOCK = 30

DESCRIPTIONS = (
    "Klassisk norsk pils med frisk og rund smak.",
    "Fyldig og maltrik, perfekt på en kald kveld.",
    "Lett og forfriskende, godt selskap til maten.",
    "Humlerik og bitter, for den som vil ha litt mer.",
    "Tradisjonsrik bryggekunst fra ærverdig bryggeri.",
)

# user index, days ago, (product name, amount) lines
DEMO_ORDERS = (
    (0, 26, (("Ringnes Pilsner", 2), ("Munkholm Alkoholfri", 1))),
    (1, 21, (("Frydenlund Fatøl", 2), ("Lervig Lucky Jack", 1))),
    (2, 13, (("Nøgne Ø India Pale Ale", 1),)),
    (3, 24, (("Frydenlund Fatøl", 2), ("Munkholm Alkoholfri", 1))),
    (4, 19, (("Nøgne Ø India Pale Ale", 2),)),
    (5, 15, (("Ringnes Pilsner", 1), ("Lervig Lucky Jack", 1))),
    (6, 11, (("Haandbryggeriet Mjød", 1),)),
    (7, 8, (("Lervig Lucky Jack", 2), ("Frydenlund Fatøl", 1))),
    (3, 4, (("Ringnes Pilsner", 1), ("Frydenlund Fatøl", 1))),
    (8, 2, (("Munkholm Alkoholfri", 3),)),
    (4, 1, (("Frydenlund Fatøl", 2),)),
)

# Extra random users for --size
FIRST_NAMES = (
    "Ola", "Kari", "Per", "Anne", "Lars", "Ingrid", "Bjørn", "Marit", "Geir", "Hanne", "Knut", "Liv",
    "Nils", "Solveig", "Erik", "Astrid", "Håkon", "Sigrid", "Trygve", "Randi", "Espen", "Tone", "Magnus",
    "Silje", "Henrik", "Maren", "Sander", "Ida", "Jonas", "Emma", "Mathias", "Nora", "Tobias", "Thea",
    "Vegard", "Kristin", "Ole-Martin", "Anne-Lise", "Frode", "Gunnhild",
)  # fmt: skip
LAST_NAMES = (
    "Hansen", "Johansen", "Olsen", "Larsen", "Andersen", "Pedersen", "Nilsen", "Kristiansen", "Jensen",
    "Karlsen", "Berg", "Haugen", "Hagen", "Johnsen", "Andreassen", "Jakobsen", "Dahl", "Lund", "Halvorsen",
    "Eriksen", "Bakken", "Moen", "Strand", "Ødegård",
)  # fmt: skip

SIZE_PRESETS = {
    "small": {"users": 6, "orders": 40, "days": 30},
    "medium": {"users": 15, "orders": 300, "days": 180},
    "large": {"users": 40, "orders": 1500, "days": 365},
}
FIRST_NAME_ONLY_PROB = 0.35  # users registered with just a first name
EXTERNAL_ORDER_PROB = 0.10  # orders with no customer (paid in cash)
WITHDRAWAL_PROB = 0.10  # users who have had money paid back out


def avatar_url(email: str) -> str:
    return f"https://i.pravatar.cc/150?u={quote(email)}"


def ascii_name(name: str) -> str:
    return name.lower().replace("ø", "o").replace("å", "a").replace("æ", "ae")


class Command(BaseCommand):
    help = "Create repeatable demo users, products, deposits, and orders for local testing."

    def add_arguments(self, parser: CommandParser):
        parser.add_argument(
            "--size",
            choices=sorted(SIZE_PRESETS),
            help="Also generate random users, orders and deposits on top of the demo data. Adds more on every run.",
        )
        parser.add_argument("--users", type=int, help="Number of random users (overrides --size).")
        parser.add_argument("--orders", type=int, help="Number of random orders (overrides --size).")
        parser.add_argument("--days", type=int, help="Spread random activity over this many past days.")
        parser.add_argument("--seed", type=int, help="Seed for the random data, for reproducible output.")

    def handle(self, *args, **options):  # noqa: ARG002
        users = self.seed_users()
        products = self.seed_products(users[0][0])
        self.seed_deposits(users)
        self.seed_orders(users, products)
        self.update_balances(users)
        self.create_admin()

        if options["size"]:
            preset = SIZE_PRESETS[options["size"]]
            generator = RandomData(
                random.Random(options["seed"]),  # noqa: S311
                days=options["days"] or preset["days"],
            )
            with db_transaction.atomic():
                generator.run(
                    n_users=options["users"] or preset["users"],
                    n_orders=options["orders"] or preset["orders"],
                )
            self.stdout.write(
                f"Generated {generator.n_users} random users and {generator.n_orders} random orders "
                f"over {generator.days} days.",
            )

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
            UserProfile.objects.get_or_create(user=user, defaults={"image": avatar_url(email)})
            users.append((user, deposit_amount))
        return users

    @staticmethod
    def seed_products(stock_user):
        products = {}
        for index, (name, volume, alcohol, sale_price_int, sale_price_ext) in enumerate(DEMO_PRODUCTS):
            product, created = Product.objects.get_or_create(
                name=name,
                defaults={
                    "sale_price_int": Decimal(sale_price_int),
                    "sale_price_ext": Decimal(sale_price_ext),
                    "volume_liter": Decimal(volume),
                    "alcohol_percent": Decimal(alcohol),
                    "inventory_amount": DEMO_STOCK,
                    "description": DESCRIPTIONS[index % len(DESCRIPTIONS)],
                },
            )
            products[name] = product
            if created:
                InventoryTransaction.objects.get_or_create(
                    user=stock_user,
                    product=product,
                    comment="Demo opening stock",
                    defaults={"amount": DEMO_STOCK, "unit_price": Decimal(sale_price_int) * Decimal("0.6")},
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
        for user_index, days_ago, lines in DEMO_ORDERS:
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


class RandomData:
    """Random users, restocks, orders and deposits spread over time, for realistic stats."""

    def __init__(self, rng: random.Random, days: int):
        self.rng = rng
        self.days = days
        self.end = timezone.now()
        self.start = self.end - timedelta(days=days)
        self.n_users = 0
        self.n_orders = 0

    def run(self, n_users: int, n_orders: int):
        users = self.create_users(n_users)
        products = self.create_products()
        self.restock(products, users)
        spent = self.create_orders(users, products, n_orders)
        self.create_money(users, spent)

    def random_time(self):
        span = int((self.end - self.start).total_seconds())
        return self.start + timedelta(seconds=self.rng.randint(0, max(span, 1)))

    @staticmethod
    def set_created(obj, created):
        # created is auto_now_add, so backdate with an update
        type(obj).objects.filter(pk=obj.pk).update(created=created)

    def create_users(self, n: int) -> list:
        user_model = get_user_model()
        users = []
        for _ in range(n):
            first = self.rng.choice(FIRST_NAMES)
            last = "" if self.rng.random() < FIRST_NAME_ONLY_PROB else self.rng.choice(LAST_NAMES)
            base = ".".join(ascii_name(part) for part in (first, last) if part)
            email = f"{base}@example.test"
            suffix = 1
            while user_model.objects.filter(username=email).exists():
                suffix += 1
                email = f"{base}{suffix}@example.test"

            user = user_model.objects.create_user(username=email, email=email, first_name=first, last_name=last)
            UserProfile.objects.create(user=user, image=avatar_url(email))
            users.append(user)
        self.n_users = len(users)
        return users

    def create_products(self) -> list:
        products = []
        for name, volume, alcohol, sale_price_int, sale_price_ext in BEERS:
            product, _ = Product.objects.get_or_create(
                name=name,
                defaults={
                    "sale_price_int": Decimal(sale_price_int),
                    "sale_price_ext": Decimal(sale_price_ext),
                    "volume_liter": Decimal(volume),
                    "alcohol_percent": Decimal(alcohol),
                    "description": self.rng.choice(DESCRIPTIONS),
                },
            )
            products.append(product)
        return products

    def restock(self, products: list, users: list):
        for product in products:
            wholesale = (product.sale_price_int * Decimal("0.6")).quantize(Decimal("0.1"))
            for _ in range(self.rng.randint(1, 3)):
                amount = self.rng.choice([24, 48, 60, 120])
                restock = InventoryTransaction.objects.create(
                    user=self.rng.choice(users),
                    product=product,
                    amount=amount,
                    unit_price=wholesale,
                    comment="Innkjøp",
                )
                self.set_created(restock, self.random_time())
                product.inventory_amount += amount
            product.save(update_fields=["inventory_amount"])

    def create_orders(self, users: list, products: list, n_orders: int) -> dict:
        spent = {user.pk: Decimal(0) for user in users}
        for _ in range(n_orders):
            customer = None if self.rng.random() < EXTERNAL_ORDER_PROB else self.rng.choice(users)
            # Mostly a single product, occasionally two or three
            n_lines = self.rng.choices([1, 2, 3], weights=[60, 30, 10])[0]
            lines = []
            order_sum = Decimal(0)
            for product in self.rng.sample(products, n_lines):
                amount = self.rng.choices([1, 2, 3, 6], weights=[55, 30, 10, 5])[0]
                unit_price = product.sale_price_int if customer else product.sale_price_ext
                lines.append(OrderLine(product=product, amount=amount, unit_price=unit_price))
                order_sum += unit_price * amount
                product.inventory_amount = max(0, product.inventory_amount - amount)

            order = Order.objects.create(customer=customer, order_sum=order_sum)
            for line in lines:
                line.order = order
            OrderLine.objects.bulk_create(lines)
            self.set_created(order, self.random_time())
            if customer:
                spent[customer.pk] += order_sum

        for product in products:
            product.save(update_fields=["inventory_amount"])
        self.n_orders = n_orders
        return spent

    def create_money(self, users: list, spent: dict):
        """Round deposits covering what each user spent, plus rare withdrawals within the leftover buffer."""
        for user in users:
            buffer = Decimal(self.rng.choice([0, 50, 100, 200, 300, 400]))
            remaining = spent[user.pk] + buffer
            net = Decimal(0)
            while remaining > 0:
                amount = min(Decimal(self.rng.choice([100, 200, 200, 300, 500])), remaining)
                deposit = Transaction.objects.create(user=user, amount=amount)
                self.set_created(deposit, self.random_time())
                net += amount
                remaining -= amount

            if buffer > 0 and self.rng.random() < WITHDRAWAL_PROB:
                withdrawal = Decimal(self.rng.randint(1, int(buffer)))
                payout = Transaction.objects.create(user=user, amount=-withdrawal)
                self.set_created(payout, self.random_time())
                net -= withdrawal

            user.profile.balance = net - spent[user.pk]
            user.profile.save(update_fields=["balance"])
