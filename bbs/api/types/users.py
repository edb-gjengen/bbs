from datetime import datetime
from decimal import Decimal

import strawberry
import strawberry_django
from django.contrib.auth.models import User as DjangoUser
from strawberry import auto

from bbs import models
from bbs.api.types.shop import Point, ProductOrderStat


@strawberry.type
class TopMonth:
    period: str
    count: int
    sum: float


@strawberry_django.type(models.UserProfile)
class UserProfile:
    id: auto
    balance: auto
    image: auto
    last_purchase_date: datetime
    order_sum_total: Decimal

    @strawberry.field()
    def top_months(self) -> list[TopMonth]:
        return [
            TopMonth(period=month["period"], count=month["count"], sum=float(month["sum"]))
            for month in self.top_months()
        ]

    @strawberry.field()
    def product_order_stats(self) -> list[ProductOrderStat]:
        return [
            ProductOrderStat(
                product_name=stat["product_name"],
                data=[Point(**p) for p in stat["data"]],
            )
            for stat in self.product_order_stats().as_series()
        ]


@strawberry_django.type(DjangoUser)
class User:
    id: auto
    first_name: auto
    last_name: auto
    profile: UserProfile | None
