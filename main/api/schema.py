import strawberry
import strawberry_django
from django.contrib.auth.models import User as DjangoUser
from strawberry import ID

from main import models
from main.api import mutations
from main.api.types import (
    Order,
    OrderOrdering,
    OrderStats,
    OrderStatsByTime,
    Product,
    Transaction,
    TransactionOrdering,
    User,
)


@strawberry.type
class Query:
    all_products: list[Product] = strawberry_django.field()
    all_users: list[User] = strawberry_django.field()
    all_orders: list[Order] = strawberry_django.field()
    order_list: list[Order] = strawberry_django.field(pagination=True, order=OrderOrdering)
    transaction_list: list[Transaction] = strawberry_django.field(pagination=True, order=TransactionOrdering)

    @strawberry.field
    def user(self, user_id: ID) -> User:
        return DjangoUser.objects.get(pk=user_id)

    @strawberry.field
    def order_stats(self) -> OrderStats:
        return OrderStats(
            **{
                period: [
                    OrderStatsByTime(**stat)
                    for stat in models.Order.objects.count_by_created_period(period).order_by("period")
                ]
                for period in ["yearly", "monthly", "daily", "hourly"]
            }
        )


@strawberry.type
class Mutation:
    create_order = mutations.create_order
    create_deposit = mutations.create_deposit


schema = strawberry.Schema(query=Query, mutation=Mutation)
