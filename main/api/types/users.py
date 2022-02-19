from datetime import datetime

import strawberry
import strawberry_django
from django.contrib.auth import get_user_model
from strawberry_django import auto

from main import models

UserModel = get_user_model()


@strawberry.type
class TopMonth:
    period: str
    count: int
    sum: int


@strawberry.type
class Point:
    x: str
    y: int


@strawberry.type
class ProductOrderStat:
    product_name: str
    data: list[Point]


@strawberry_django.type(models.UserProfile)
class UserProfile:
    id: auto
    balance: auto
    image: auto
    last_purchase_date: datetime
    order_sum_total: float

    @strawberry.field()
    def top_months(self) -> list[TopMonth]:
        return [TopMonth(**month) for month in self.top_months()]

    @strawberry.field()
    def product_order_stats(self) -> list[ProductOrderStat]:
        return [
            ProductOrderStat(product_name=stat["product_name"], data=[Point(**p) for p in stat["data"]])
            for stat in self.product_order_stats().as_series()
        ]


@strawberry_django.type(UserModel)
class User:
    id: auto
    first_name: auto
    last_name: auto
    profile: UserProfile
