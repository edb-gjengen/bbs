from decimal import Decimal
from typing import TYPE_CHECKING, Annotated

import strawberry
import strawberry_django
from strawberry import ID, auto

from bbs import models

if TYPE_CHECKING:
    from .shop import Product
    from .users import User


@strawberry_django.order_type(models.Transaction)
class TransactionOrdering:
    created: auto


@strawberry_django.type(models.Transaction)
class Transaction:
    id: auto
    user: Annotated["User", strawberry.lazy(".users")]
    amount: auto
    created: auto


@strawberry_django.type(models.InventoryTransaction)
class InventoryTransaction:
    id: auto
    user: Annotated["User", strawberry.lazy(".users")]
    product: Annotated["Product", strawberry.lazy(".shop")]
    amount: auto
    unit_price: auto
    comment: auto
    created: auto


@strawberry_django.order_type(models.InventoryTransaction)
class InventoryTransactionOrdering:
    created: auto


@strawberry.type
class InventoryReportProduct:
    product_id: ID
    product_name: str
    purchase_units: int
    purchase_value: Decimal
    sales_units: int
    sales_value: Decimal


@strawberry.type
class InventoryReport:
    products: list[InventoryReportProduct]
    inventory_purchases: Decimal
    product_sales: Decimal
    deposits: Decimal
    order_purchases: Decimal
    balance_at_start: Decimal
    balance_at_end: Decimal
