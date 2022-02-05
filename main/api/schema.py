import strawberry
import strawberry_django

from main.api import mutations
from main.api.types import Order, OrderOrdering, Product, Transaction, TransactionOrdering, User


@strawberry.type
class Query:
    all_products: list[Product] = strawberry_django.field()
    all_users: list[User] = strawberry_django.field()
    all_orders: list[Order] = strawberry_django.field()
    order_list: list[Order] = strawberry_django.field(pagination=True, order=OrderOrdering)
    transaction_list: list[Transaction] = strawberry_django.field(pagination=True, order=TransactionOrdering)


@strawberry.type
class Mutation:
    create_order = mutations.create_order
    create_deposit = mutations.create_deposit


schema = strawberry.Schema(query=Query, mutation=Mutation)
