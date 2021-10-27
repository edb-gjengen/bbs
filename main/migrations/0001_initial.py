from django.db import migrations, models
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name="InventoryTransaction",
            fields=[
                (
                    "id",
                    models.AutoField(
                        verbose_name="ID",
                        serialize=False,
                        auto_created=True,
                        primary_key=True,
                    ),
                ),
                ("amount", models.FloatField(verbose_name="Antall")),
                ("unit_price", models.FloatField(verbose_name="Enhetspris")),
                ("comment", models.TextField(verbose_name="Kommentar", blank=True)),
                ("created", models.DateTimeField(auto_now_add=True)),
            ],
        ),
        migrations.CreateModel(
            name="Order",
            fields=[
                (
                    "id",
                    models.AutoField(
                        verbose_name="ID",
                        serialize=False,
                        auto_created=True,
                        primary_key=True,
                    ),
                ),
                ("order_sum", models.FloatField(db_column="sum")),
                ("created", models.DateTimeField(auto_now_add=True)),
                (
                    "customer",
                    models.ForeignKey(
                        related_name="orders",
                        on_delete=models.CASCADE,
                        blank=True,
                        to=settings.AUTH_USER_MODEL,
                        null=True,
                    ),
                ),
            ],
        ),
        migrations.CreateModel(
            name="OrderLine",
            fields=[
                (
                    "id",
                    models.AutoField(
                        verbose_name="ID",
                        serialize=False,
                        auto_created=True,
                        primary_key=True,
                    ),
                ),
                ("amount", models.IntegerField()),
                ("unit_price", models.FloatField(verbose_name="Enhetspris")),
                (
                    "order",
                    models.ForeignKey(
                        on_delete=models.CASCADE,
                        related_name="orderlines",
                        to="main.Order",
                    ),
                ),
            ],
        ),
        migrations.CreateModel(
            name="Product",
            fields=[
                (
                    "id",
                    models.AutoField(
                        verbose_name="ID",
                        serialize=False,
                        auto_created=True,
                        primary_key=True,
                    ),
                ),
                ("name", models.CharField(max_length=64)),
                ("sale_price_int", models.FloatField()),
                ("sale_price_ext", models.FloatField()),
                ("description", models.CharField(max_length=256, blank=True)),
                ("volume_liter", models.FloatField(null=True)),
                ("alcohol_percent", models.FloatField(null=True)),
                ("image", models.ImageField(upload_to="products", blank=True)),
                ("customer_support", models.CharField(max_length=32, blank=True)),
                ("inventory_amount", models.FloatField(default=0)),
                ("active", models.BooleanField(default=True)),
                ("created", models.DateTimeField(auto_now_add=True)),
                ("updated", models.DateTimeField(auto_now=True)),
            ],
            options={
                "ordering": ["name"],
            },
        ),
        migrations.CreateModel(
            name="Transaction",
            fields=[
                (
                    "id",
                    models.AutoField(
                        verbose_name="ID",
                        serialize=False,
                        auto_created=True,
                        primary_key=True,
                    ),
                ),
                ("amount", models.FloatField()),
                ("created", models.DateTimeField(auto_now_add=True)),
                (
                    "user",
                    models.ForeignKey(
                        on_delete=models.CASCADE,
                        related_name="transactions",
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
        ),
        migrations.CreateModel(
            name="UserProfile",
            fields=[
                (
                    "id",
                    models.AutoField(
                        verbose_name="ID",
                        serialize=False,
                        auto_created=True,
                        primary_key=True,
                    ),
                ),
                ("balance", models.FloatField(default=0.0)),
                ("image", models.URLField(blank=True)),
                (
                    "user",
                    models.OneToOneField(
                        on_delete=models.CASCADE,
                        related_name="profile",
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
        ),
        migrations.AddField(
            model_name="orderline",
            name="product",
            field=models.ForeignKey(on_delete=models.CASCADE, related_name="orderlines", to="main.Product"),
        ),
        migrations.AddField(
            model_name="inventorytransaction",
            name="product",
            field=models.ForeignKey(
                on_delete=models.CASCADE,
                related_name="transactions",
                verbose_name="Produkt",
                to="main.Product",
            ),
        ),
        migrations.AddField(
            model_name="inventorytransaction",
            name="user",
            field=models.ForeignKey(
                on_delete=models.CASCADE,
                related_name="inventory_transactions",
                to=settings.AUTH_USER_MODEL,
            ),
        ),
        migrations.AlterUniqueTogether(
            name="orderline",
            unique_together=set([("order", "product")]),
        ),
    ]
