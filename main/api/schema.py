import strawberry
from strawberry_django import auto

from main import models


@strawberry.django.type(models.Product)
class Product:
    id: auto
    name: auto
    sale_price_int: auto
    sale_price_ext: auto


@strawberry.type
class Query:
    all_products: list[Product] = strawberry.django.field()


schema = strawberry.Schema(query=Query)
