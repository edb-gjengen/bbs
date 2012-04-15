# coding: utf-8
from datetime import datetime
from datetime import timedelta
from itertools import groupby
import simplejson as json

from django.contrib.auth import login, logout as auth_logout
from django.contrib.auth.decorators import login_required
from django.contrib.auth.forms import AuthenticationForm
from django.core.urlresolvers import reverse
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render_to_response, get_object_or_404
from django.template import RequestContext
from django.forms.formsets import formset_factory
from django.contrib import messages
from django.db.models import Count, Sum

from models import *

from forms import *

def home(request):
    if request.method == "POST":
        form = AuthenticationForm(data=request.POST)
        if form.is_valid():
            # Log the user in.
            login(request, form.get_user())
    else:
        if request.user.is_authenticated():
            # Redirect to the register
            return HttpResponseRedirect( reverse('main.views.register') )
        else:
            form = AuthenticationForm(request)
    return render_to_response('home.html', locals(), context_instance=RequestContext(request))

def register(request):
    products = Product.objects.filter(active=True)
    users = User.objects.filter(userprofile__balance__gt=0)
    # sort users after user's last purchase time
    users = sorted(users, key=lambda u: u.get_profile().last_purchase_date(), reverse=True)
    users_js = users_format_js(users)

    # multiple orderlines (one per product)
    OrderLineFormSet = formset_factory(OrderLineForm)
    if request.method == "POST":
        orderform = OrderForm(request.POST)
        formset = OrderLineFormSet(request.POST)

        if formset.is_valid() and orderform.is_valid():
            order_sum = sum([ol['amount'] * ol['unit_price'] for ol in formset.cleaned_data])
            order = orderform.save(commit=False)
            # can he afford it?
            profile = order.customer.get_profile()
            if order_sum > profile.balance:
                messages.error(request, '{0} har ikke råd, mangler {1} kr.'.format(
                    order.customer,
                    int(order_sum - profile.balance)))
                return HttpResponseRedirect( reverse('main.views.register') )
            # empty order?
            if order_sum == 0:
                messages.error(request, 'Du har ikke valgt hva du skal kjøpe...')
                return HttpResponseRedirect( reverse('main.views.register') )
            order.order_sum = order_sum
            order.save()
            # substract order from balance
            profile.balance -= order.order_sum
            profile.save()

            orderlines = []
            for ol in formset.cleaned_data:
                if ol['amount'] > 0:
                    product = Product.objects.get(pk=ol['product'])
                    OrderLine.objects.create(
                        order=order,
                        product=product,
                        amount=ol['amount'],
                        unit_price=ol['unit_price'])

                    orderlines.append(str(ol['amount']) + " " + str(product))
                
            messages.success(request, '{0} kjøpte {1}.'.format(order.customer, ", ".join(orderlines)))
            return HttpResponseRedirect( reverse('main.views.register') )
        else:
            # TODO specify error(s)
            messages.error(request, 'Skjemaet er ikke gyldig.')
            orderform = OrderForm(request.POST)
            formset = OrderLineFormSet(request.POST)
    else:
        orderform = OrderForm()
        formset = OrderLineFormSet()
    return render_to_response('register.html', locals(), context_instance=RequestContext(request))

def deposit(request):
    users = User.objects.all().order_by('first_name','last_name')
    users_js = users_format_js(users)

    if request.method == "POST":
        form = DepositForm(request.POST)
        if form.is_valid():
            transaction = form.save()
            profile = transaction.user.get_profile()
            profile.balance += transaction.amount
            profile.save()

            messages.success(request, '{0} satte inn {1} kr. Ny saldo er {2}'.format(
                transaction.user,
                transaction.amount,
                profile.balance))
            return HttpResponseRedirect( reverse('main.views.deposit') )
        else:
            messages.error(request, 'Skjemaet er ikke gyldig.')
            form = DepositForm(request.POST)
    else:
        form = DepositForm()

    return render_to_response('deposit.html', locals(), context_instance=RequestContext(request))

def log(request, limit=datetime.now()-timedelta(days=2)):
    if limit: 
        # display last two days of orders and transactions
        orders = Order.objects.filter(created__gte=limit).order_by('-created')
        transactions = Transaction.objects.filter(created__gte=limit).order_by('-created')

        # no action in the last two days?
        # ...then display the last 5 items
        if len(orders) == 0:
            orders = Order.objects.all().order_by('-created')[:5]

        if len(transactions) == 0:
            transactions = Transaction.objects.all().order_by('-created')[:5]
    else:
        # display everything
        orders = Order.objects.all().order_by('-created')
        transactions = Transaction.objects.all().order_by('-created')

    return render_to_response('log.html', locals(), context_instance=RequestContext(request))

def stats(request):
    products = Product.objects.filter(active=True)

    return render_to_response('stats.html', locals(), context_instance=RequestContext(request))

def serialize_product(product):
    f_product = {}
    for attr in Product._meta.get_all_field_names():
        if hasattr(product, attr) and product.__getattribute__(attr):
            if type(product.__getattribute__(attr)) is datetime:
                f_product[attr] = str(product.__getattribute__(attr))
            else:
                f_product[attr] = product.__getattribute__(attr)
    return f_product

def products(request, product_id=None):
    if product_id:
        #single
        products = get_object_or_404(Product, pk=product_id)
    else:
        #many
        products = Product.objects.filter(active=True)

    if product_id:
        f_products = serialize_product(products)
    else:
        f_products = [serialize_product(product) for product in products]

    return HttpResponse(json.dumps(f_products), content_type='application/javascript; charset=utf8')

def stats_product(product):
    sales = OrderLine.objects.filter(product=product)
    # reverse lookup via order, customer
    per_user = sales.values('order__customer__first_name','order__customer__last_name').annotate(num=Sum('amount')).order_by('num').reverse()
    f_per_user = []
    for row in per_user:
        who = row['order__customer__first_name'] + " " + row['order__customer__last_name'][0]
        num = row['num']
        f_per_user.append([who, num])
    response = {
        'product' : serialize_product(Product.objects.get(pk=product)) if type(product) is unicode else serialize_product(product),
        'counts' : f_per_user,
        'total_counts' : sum([row['num'] for row in per_user]),
        }
    return response

def stats_products(request, product=None):
    if product:
        #single
        f_products = [stats_product(product)]
        sales = OrderLine.objects.filter(product=product)
    else:
        #all
        sales = OrderLine.objects.filter(product__active=True)
        f_products = [stats_product(p) for p in Product.objects.filter(active=True)]

    totals = float(sum([sale.amount for sale in sales]))
    response = {
        'request' : 'all' if not product else product,
        'response' : {
            'products' : f_products,
            'total_count' : totals,
            }
        }
    return HttpResponse(json.dumps(response), content_type='application/javascript; charset=utf8')

def stats_orders(request):
    total = float(Order.objects.count())
    per_user = Order.objects.values('customer__first_name','customer__last_name').annotate(num=Count('customer')).order_by('num').reverse()
    f_per_user = []
    for row in per_user:
        who = row['customer__first_name'] + " " + row['customer__last_name'][0]
        num = row['num']
        f_per_user.append([who, num])
    return HttpResponse(json.dumps(f_per_user), content_type='application/javascript; charset=utf8')

def stats_orders_hourly(request):
    orders = Order.objects.all()
    f_hourly = dict([(key,0) for key in range(0,24)]) # init
    # group by hour
    for key, values in groupby(orders, key=lambda row: row.created.hour):
        count = len(list(values))
        f_hourly[key] = f_hourly[key] + count

    response = {
        'start': str(orders[0].created),
        'hourly' : [[k,v] for k,v in f_hourly.iteritems()],
        'total' : sum(f_hourly.values()),
    }
    return HttpResponse(json.dumps(response), content_type='application/javascript; charset=utf8')

def logout(request):
    auth_logout(request)
    return render_to_response('registration/logout.html', locals(), context_instance=RequestContext(request))

def users_format_js(users):
    users_js = []
    for user in users:
        users_js.append('"' + user.first_name + ' ' + user.last_name[:1] + '"')
    users_js = u"[{0}]".format(u",".join(users_js))
    return users_js

