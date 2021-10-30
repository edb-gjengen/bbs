from datetime import datetime

import strawberry
import strawberry_django
from django.contrib.auth import get_user_model
from strawberry_django import auto

from main import models

UserModel = get_user_model()


@strawberry_django.filters.filter(models.Product)
class ProductFilter:
    id: auto
    active: auto


@strawberry_django.type(models.Product, filters=ProductFilter)
class Product:
    id: auto
    name: auto
    sale_price_int: auto
    sale_price_ext: auto


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
    # todo
