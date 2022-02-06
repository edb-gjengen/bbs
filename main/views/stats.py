import time
from datetime import datetime, timedelta

from django.http import JsonResponse

from main.models import OrderLine


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
