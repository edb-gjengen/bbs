# coding: utf-8
# Create your views here.
from django.contrib.auth import login, logout as auth_logout
from django.contrib.auth.decorators import login_required
from django.contrib.auth.forms import AuthenticationForm
from django.core.urlresolvers import reverse
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render_to_response, get_object_or_404
from django.template import RequestContext
from django.forms.formsets import formset_factory
from django.contrib import messages

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
    products = Product.objects.all()
    users = User.objects.filter(userprofile__balance__gt=0)
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
            # errors
            messages.error(request, 'Skjemaet er ikke gyldig.')
            orderform = OrderForm(request.POST)
            formset = OrderLineFormSet(request.POST)
    else:
        orderform = OrderForm()
        formset = OrderLineFormSet()
    return render_to_response('register.html', locals(), context_instance=RequestContext(request))

def deposit(request):
    users = User.objects.all()
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

def logout(request):
    auth_logout(request)
    return render_to_response('registration/logout.html', locals(), context_instance=RequestContext(request))

def users_format_js(users):
    users = "[{0}]".format(
        ",".join(['"'+user+'"' for user in users.values_list('username', flat=True)]))
    return users

