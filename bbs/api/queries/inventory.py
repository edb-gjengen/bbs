from datetime import datetime
from decimal import Decimal

import strawberry
import strawberry_django
from django.db.models import F, Sum
from django.utils import timezone

from bbs import models
from bbs.api.types.inventory import (
    InventoryReport,
    InventoryReportProduct,
    InventoryTransaction,
    InventoryTransactionOrdering,
    Transaction,
    TransactionOrdering,
)


@strawberry.type
class InventoryQueries:
    transaction_list: list[Transaction] = strawberry_django.field(pagination=True, ordering=TransactionOrdering)
    inventory_transaction_list: list[InventoryTransaction] = strawberry_django.field(
        pagination=True,
        ordering=InventoryTransactionOrdering,
    )

    @strawberry.field
    def inventory_report(self, start_time: datetime, end_time: datetime) -> InventoryReport:
        if timezone.is_naive(start_time):
            start_time = timezone.make_aware(start_time)
        if timezone.is_naive(end_time):
            end_time = timezone.make_aware(end_time)
        if start_time > end_time:
            raise ValueError("The report start date must not be after the end date.")

        purchases = (
            models.InventoryTransaction.objects.filter(created__range=(start_time, end_time))
            .values("product_id", "product__name")
            .annotate(units=Sum("amount"), value=Sum(F("amount") * F("unit_price")))
        )
        sales = (
            models.OrderLine.objects.filter(order__created__range=(start_time, end_time))
            .values("product_id", "product__name")
            .annotate(units=Sum("amount"), value=Sum(F("amount") * F("unit_price")))
        )

        product_totals = {}
        for product in purchases:
            product_totals[product["product_id"]] = {
                "product_id": product["product_id"],
                "product_name": product["product__name"],
                "purchase_units": product["units"] or 0,
                "purchase_value": product["value"] or Decimal(0),
                "sales_units": 0,
                "sales_value": Decimal(0),
            }

        for product in sales:
            product_data = product_totals.setdefault(
                product["product_id"],
                {
                    "product_id": product["product_id"],
                    "product_name": product["product__name"],
                    "purchase_units": 0,
                    "purchase_value": Decimal(0),
                    "sales_units": 0,
                    "sales_value": Decimal(0),
                },
            )
            product_data["sales_units"] = product["units"] or 0
            product_data["sales_value"] = product["value"] or Decimal(0)

        product_data = sorted(product_totals.values(), key=lambda product: product["product_name"])
        inventory_purchases = sum((product["purchase_value"] for product in product_data), Decimal(0))
        product_sales = sum((product["sales_value"] for product in product_data), Decimal(0))

        deposits = models.Transaction.objects.filter(created__range=(start_time, end_time)).aggregate(
            total=Sum("amount")
        )["total"] or Decimal(0)
        order_purchases = models.Order.objects.filter(created__range=(start_time, end_time)).aggregate(
            total=Sum("order_sum")
        )["total"] or Decimal(0)
        deposits_start = models.Transaction.objects.filter(created__lt=start_time).aggregate(total=Sum("amount"))[
            "total"
        ] or Decimal(0)
        orders_start = models.Order.objects.filter(created__lt=start_time).aggregate(total=Sum("order_sum"))[
            "total"
        ] or Decimal(0)
        deposits_end = models.Transaction.objects.filter(created__lte=end_time).aggregate(total=Sum("amount"))[
            "total"
        ] or Decimal(0)
        orders_end = models.Order.objects.filter(created__lte=end_time).aggregate(total=Sum("order_sum"))[
            "total"
        ] or Decimal(0)

        return InventoryReport(
            products=[InventoryReportProduct(**product) for product in product_data],
            inventory_purchases=inventory_purchases,
            product_sales=product_sales,
            deposits=deposits,
            order_purchases=order_purchases,
            balance_at_start=deposits_start - orders_start,
            balance_at_end=deposits_end - orders_end,
        )
