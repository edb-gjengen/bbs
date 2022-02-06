import json
from datetime import datetime
from typing import Any, NewType

import strawberry
import strawberry_django
from django.contrib.auth import get_user_model
from strawberry_django import auto

from main import models

UserModel = get_user_model()

JSONScalar = strawberry.scalar(
    NewType("JSONScalar", Any),
    serialize=lambda v: v,
    parse_value=lambda v: json.loads(v),
    description="The GenericScalar scalar type represents a generic GraphQL scalar value that could be: List or Object.",
)


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


@strawberry_django.type(models.UserProfile)
class UserProfile:
    id: auto
    balance: auto
    image: auto

    @strawberry.field()
    def last_purchase_date(self) -> datetime:
        return self.last_purchase_date()


@strawberry_django.type(UserModel)
class User:
    id: auto
    first_name: auto
    last_name: auto
    profile: UserProfile


@strawberry_django.ordering.order(models.Order)
class OrderOrdering:
    created: auto


@strawberry_django.type(models.Order)
class Order:
    id: auto
    customer: "User"
    order_sum: auto
    created: auto
    orderlines: list["OrderLine"]
    is_external: bool


@strawberry_django.type(models.OrderLine)
class OrderLine:
    id: auto
    order: "Order"
    product: "Product"
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
    dayly: list[OrderStatsByTime]
    hourly: list[OrderStatsByTime]


@strawberry_django.ordering.order(models.Transaction)
class TransactionOrdering:
    created: auto


@strawberry_django.type(models.Transaction)
class Transaction:
    id: auto
    user: "User"
    amount: auto
    created: auto
