import time
from datetime import datetime, timedelta
from itertools import groupby

from django.http import JsonResponse
from django.shortcuts import render
from django.utils import timezone
from django.views.generic import View

from main.models import Order, OrderLine, Product


def stats_list(request):
    products = Product.objects.filter(active=True)
    order_groups = ["hourly", "daily", "monthly", "yearly"]

    return render(request, "stats.html", {"products": products, "order_groups": order_groups})


class OrdersView(View):
    grouping = "orders"

    def get_range(self):
        raise NotImplementedError

    def get_key(self, order):
        raise NotImplementedError

    def group_by(self, orders):
        orders_grouped = dict([(key, 0) for key in self.get_range()])  # init
        for key, values in groupby(orders, key=self.get_key):
            count = len(list(values))
            orders_grouped[key] += count

        return orders_grouped

    def get(self, request):
        orders = Order.objects.all()
        if not orders.exists():
            return JsonResponse({})

        orders_grouped = self.group_by(orders)
        data = {
            "start": str(orders[0].created),
            "orders": [[k, v] for k, v in orders_grouped.items()],
            "total": sum(orders_grouped.values()),
            "grouping": self.grouping,
        }
        return JsonResponse(data)


class OrdersHourlyView(OrdersView):
    grouping = "hourly"

    def get_range(self):
        return range(0, 24)

    def get_key(self, order):
        return order.created.hour


class OrdersDailyView(OrdersView):
    grouping = "daily"

    def get_range(self):
        return range(0, 7)

    def get_key(self, order):
        return order.created.weekday()


class OrdersMonthlyView(OrdersView):
    grouping = "monthly"

    def get_range(self):
        return range(1, 13)

    def get_key(self, order):
        return order.created.month


class OrdersYearlyView(OrdersView):
    grouping = "yearly"

    def get_range(self):
        first = Order.objects.order_by("created").first()
        last = timezone.now().year
        first = first.created.year if first else last

        return range(first, last + 1)

    def get_key(self, order):
        return order.created.year


def stats_products_realtime(request):
    end_time = datetime.now()
    start_time = datetime.now() - timedelta(hours=24)

    order_lines = OrderLine.objects.filter(order__created__range=(start_time, end_time)).order_by("order__created")
    products = {}
    for order_line in order_lines:
        order_time_in_milliseconds = int(time.mktime(order_line.order.created.timetuple()) * 1000)
        if order_line.product not in products:
            products[order_line.product] = [[order_time_in_milliseconds, order_line.amount]]
        else:
            prev_entry = products[order_line.product][-1]
            products[order_line.product].append([order_time_in_milliseconds, prev_entry[1] + order_line.amount])

    serialized_products = {}
    for product, value in products.items():
        serialized_products[product.name] = value

    response = {"products": serialized_products}

    return JsonResponse(response)


def stats_products_per_user(request, user_id=None):
    if not user_id:
        return JsonResponse({"error": "Missing param user_id"})

    order_lines = OrderLine.objects.filter(order__customer__pk=user_id).order_by("order__created")
    products = {}
    for order_line in order_lines:
        order_time_in_milliseconds = int(time.mktime(order_line.order.created.timetuple()) * 1000)
        if order_line.product not in products:
            products[order_line.product] = [[order_time_in_milliseconds, order_line.amount]]
        else:
            prev_entry = products[order_line.product][-1]
            products[order_line.product].append([order_time_in_milliseconds, prev_entry[1] + order_line.amount])

    serialized_products = []
    for product, value in products.items():
        serialized_products.append({"name": product.name, "data": value})
    return JsonResponse(serialized_products, safe=False)
