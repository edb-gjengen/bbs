import strawberry
import strawberry_django

from main.api.types import Product, User


@strawberry.type
class Query:
    all_products: list[Product] = strawberry_django.field()
    all_users: list[User] = strawberry_django.field()


schema = strawberry.Schema(query=Query)
