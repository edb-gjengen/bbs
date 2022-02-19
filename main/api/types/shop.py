import strawberry
import strawberry_django
from strawberry_django import auto

from main import models
from main.api.types.users import User
from main.api.types.utils import JSONScalar


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
    customer: User
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
