from decimal import Decimal
from typing import TYPE_CHECKING, Annotated

import strawberry
import strawberry_django
from strawberry import auto
from strawberry.scalars import JSON

from bbs import models

if TYPE_CHECKING:
    from .users import User


@strawberry_django.filter_type(models.Product)
class ProductFilter:
    id: auto
    active: auto


@strawberry_django.type(models.Product, filters=ProductFilter)
class Product:
    id: auto
    name: auto
    image_url: str
    sale_price_int: auto
    sale_price_ext: auto
    active: auto
    inventory_amount: auto
    updated: auto
    wholesale_unit_price: Decimal
    wholesale_value: Decimal
    # FIXME: stricter types
    user_counts: JSON


@strawberry_django.order_type(models.Order)
class OrderOrdering:
    created: auto


@strawberry_django.type(models.Order)
class Order:
    id: auto
    customer: Annotated["User", strawberry.lazy(".users")] | None
    order_sum: auto
    created: auto
    orderlines: list["OrderLine"]
    is_external: bool


@strawberry_django.type(models.OrderLine)
class OrderLine:
    id: auto
    order: Order
    product: Product
    amount: auto
    unit_price: auto


@strawberry.type
class OrderStatsByTime:
    period: int
    count: str


@strawberry.type
class OrderStats:
    yearly: list[OrderStatsByTime]
    monthly: list[OrderStatsByTime]
    daily: list[OrderStatsByTime]
    hourly: list[OrderStatsByTime]


@strawberry.type
class Point:
    x: str
    y: int


@strawberry.type
class ProductOrderStat:
    product_name: str
    data: list[Point]
