import strawberry
import strawberry_django

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
    def order_stats(self) -> OrderStats:
        return OrderStats(
            yearly=[OrderStatsByTime(**stat) for stat in models.Order.objects.count_by_year().order_by("period")],
            monthly=[OrderStatsByTime(**stat) for stat in models.Order.objects.count_by_month().order_by("period")],
            dayly=[OrderStatsByTime(**stat) for stat in models.Order.objects.count_by_weekday().order_by("period")],
            hourly=[OrderStatsByTime(**stat) for stat in models.Order.objects.count_by_hour().order_by("period")],
        )


@strawberry.type
class Mutation:
    create_order = mutations.create_order
    create_deposit = mutations.create_deposit


schema = strawberry.Schema(query=Query, mutation=Mutation)
