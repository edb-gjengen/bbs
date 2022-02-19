import strawberry
import strawberry_django

from main import models
from main.api.types.shop import Order, OrderOrdering, OrderStats, OrderStatsByTime, Point, Product, ProductOrderStat


@strawberry.type
class ShopQueries:
    all_products: list[Product] = strawberry_django.field()
    all_orders: list[Order] = strawberry_django.field()
    order_list: list[Order] = strawberry_django.field(pagination=True, order=OrderOrdering)

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

    @strawberry.field
    def product_stats(self) -> list[ProductOrderStat]:
        return [
            ProductOrderStat(product_name=stat["product_name"], data=[Point(**p) for p in stat["data"]])
            for stat in models.OrderLine.objects.product_order_stats().as_series()
        ]
