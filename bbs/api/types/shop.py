from typing import List

import strawberry
import strawberry_django
from strawberry_django import auto

from bbs import models
from bbs.api.types.utils import JSONScalar


@strawberry_django.filters.filter(models.Product)
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
    # FIXME: stricter types
    user_counts: JSONScalar


@strawberry_django.ordering.order(models.Order)
class OrderOrdering:
    created: auto


@strawberry_django.type(models.Order)
class Order:
    id: auto
    customer: strawberry.LazyType["User", "bbs.api.types.users"]
    order_sum: auto
    created: auto
    orderlines: List["OrderLine"]
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
    yearly: List[OrderStatsByTime]
    monthly: List[OrderStatsByTime]
    daily: List[OrderStatsByTime]
    hourly: List[OrderStatsByTime]


@strawberry.type
class Point:
    x: str
    y: int


@strawberry.type
class ProductOrderStat:
    product_name: str
    data: List[Point]
