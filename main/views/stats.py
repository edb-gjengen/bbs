from __future__ import unicode_literals
import time
from datetime import datetime, timedelta
from django.db.models import Sum, Count
from django.http import JsonResponse
from django.shortcuts import render, get_object_or_404
from itertools import groupby

from django.utils import six
from main.models import Product, OrderLine, Order


def stats_list(request):
    products = Product.objects.filter(active=True)

    return render(request, 'stats.html', {'products': products})


def serialize_product(product):
    f_product = {}
    for attr in Product._meta.get_all_field_names():
        if attr in ["transactions", "orderlines", "image"]:
            continue

        if hasattr(product, attr) and product.__getattribute__(attr):
            if type(product.__getattribute__(attr)) is datetime:
                f_product[attr] = str(product.__getattribute__(attr))
            else:
                f_product[attr] = product.__getattribute__(attr)
    return f_product


def products_json(request, product_id=None):
    if product_id:
        # single
        products = get_object_or_404(Product, pk=product_id)
    else:
        # many
        products = Product.objects.filter(active=True)

    if product_id:
        f_products = serialize_product(products)
    else:
        f_products = [serialize_product(product) for product in products]

    return JsonResponse(f_products)


def stats_product(product):
    # reverse lookup via order, customer
    per_user = OrderLine.objects\
        .filter(product=product)\
        .values('order__customer__first_name', 'order__customer__last_name')\
        .annotate(num=Sum('amount'))\
        .order_by('-num')
    f_per_user = []
    for row in per_user:
        if row['order__customer__first_name'] is not None:
            who = row['order__customer__first_name'] + " " + row['order__customer__last_name']
        else:
            who = "Ekstern"
        num = row['num']
        f_per_user.append([who, num])

    response = {
        'product': serialize_product(Product.objects.get(pk=product)) if type(product) in six.string_types else serialize_product(product),
        'counts': f_per_user,
        'total_counts': sum([row['num'] for row in per_user]),
    }

    return response


def stats_products(request, product=None):
    if product:
        # single
        f_products = [stats_product(product)]
        sales = OrderLine.objects.filter(product=product)
    else:
        # all
        sales = OrderLine.objects.filter(product__active=True)
        f_products = [stats_product(p) for p in Product.objects.filter(active=True)]

    totals = float(sum([sale.amount for sale in sales]))
    response = {
        'request': 'all' if not product else product,
        'response': {
            'products': f_products,
            'total_count': totals,
        }
    }
    return JsonResponse(response)


def stats_orders(request):
    num_external_orders = Order.objects.filter(customer=None).count()
    per_user = Order.objects\
        .values('customer__first_name', 'customer__last_name')\
        .annotate(num=Count('customer'))\
        .order_by('num').reverse()
    f_per_user = []
    for row in per_user:
        if row['customer__first_name'] is not None:
            who = row['customer__first_name'] + " " + row['customer__last_name']
            num = row['num']
        else:
            who = "Ekstern"
            num = num_external_orders
        f_per_user.append([who, num])

    return JsonResponse(f_per_user, safe=False)


def stats_orders_hourly(request):
    orders = Order.objects.all()
    f_hourly = dict([(key, 0) for key in range(0, 24)])  # init
    # group by hour
    for key, values in groupby(orders, key=lambda row: row.created.hour):
        count = len(list(values))
        f_hourly[key] += count

    if len(orders) == 0:
        return JsonResponse({})

    response = {
        'start': str(orders[0].created),
        'hourly': [[k, v] for k, v in f_hourly.items()],
        'total': sum(f_hourly.values()),
    }
    return JsonResponse(response)


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

    response = {
        'products': serialized_products
    }

    return JsonResponse(response)


def stats_products_per_user(request, user_id=None):
    if not user_id:
        return JsonResponse({'error': 'Missing param user_id'})

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
        serialized_products.append({
            'name': product.name,
            'data': value
        })
    return JsonResponse(serialized_products, safe=False)
