from typing import List

import strawberry
import strawberry_django

from bbs import models
from bbs.api.types.shop import Order, OrderOrdering, OrderStats, OrderStatsByTime, Point, Product, ProductOrderStat


@strawberry.type
class ShopQueries:
    all_products: List[Product] = strawberry_django.field()
    all_orders: List[Order] = strawberry_django.field()
    order_list: List[Order] = strawberry_django.field(pagination=True, order=OrderOrdering)

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
    def product_stats(self) -> List[ProductOrderStat]:
        return [
            ProductOrderStat(product_name=stat["product_name"], data=[Point(**p) for p in stat["data"]])
            for stat in models.OrderLine.objects.product_order_stats().as_series()
        ]
