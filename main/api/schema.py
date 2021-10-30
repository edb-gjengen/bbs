import strawberry
import strawberry_django
from strawberry_django import auto

from main import models


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


@strawberry.type
class Query:
    all_products: list[Product] = strawberry_django.field()


schema = strawberry.Schema(query=Query)
