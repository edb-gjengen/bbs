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


@strawberry_django.type(UserModel)
class User:
    id: auto
    first_name: auto
    last_name: auto
    profile: UserProfile
