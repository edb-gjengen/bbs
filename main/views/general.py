from datetime import datetime, timedelta

from django.conf import settings
from django.contrib import messages
from django.contrib.auth.models import User
from django.db.models import Min
from django.forms import formset_factory
from django.http import HttpResponseRedirect
from django.shortcuts import redirect, render
from django.urls import reverse

from main.forms import DepositForm, OrderForm, OrderLineForm
from main.models import Order, OrderLine, Product, Transaction
from main.utils import users_format_js, users_with_perm


def register(request):
    products = Product.objects.filter(active=True)
    cheapest_product_price = list(products.aggregate(Min("sale_price_int")).values())[0] or 0

    half_a_year_ago = datetime.now() - timedelta(days=180)
    users = User.objects.filter(profile__balance__gte=cheapest_product_price)
    # sort users after user's last purchase time
    users = sorted(users, key=lambda u: u.profile.last_purchase_date(), reverse=True)
    users_js = users_format_js(users)

    # multiple orderlines (one per product)
    OrderLineFormSet = formset_factory(OrderLineForm)
    if request.method == "POST":
        orderform = OrderForm(request.POST)
        formset = OrderLineFormSet(request.POST)

        if formset.is_valid() and orderform.is_valid():
            order = orderform.save(commit=False)

            if order.is_external():
                order_sum = sum([ol["amount"] * ol["unit_price_ext"] for ol in formset.cleaned_data])
            else:
                order_sum = sum([ol["amount"] * ol["unit_price_int"] for ol in formset.cleaned_data])

            # empty order?
            if order_sum == 0:
                messages.error(request, "Du har ikke valgt hva du skal kjøpe...")
                return HttpResponseRedirect(reverse("register"))

            if not order.is_external():
                profile = order.customer.profile
                # can she afford it?
                if profile.balance < order_sum:
                    messages.error(
                        request,
                        "{0} {1} har ikke råd, mangler {2} kr.".format(
                            order.customer.first_name,
                            order.customer.last_name,
                            int(order_sum - profile.balance),
                        ),
                    )
                    return HttpResponseRedirect(reverse("register"))
                # substract order from balance
                profile.balance -= order_sum
                profile.save()

            order.order_sum = order_sum
            order.save()

            orderlines = []
            for ol in formset.cleaned_data:
                if ol["amount"] > 0:
                    product = Product.objects.get(pk=ol["product"])

                    if order.is_external():
                        unit_price = ol["unit_price_ext"]
                    else:
                        unit_price = ol["unit_price_int"]

                    OrderLine.objects.create(
                        order=order,
                        product=product,
                        amount=ol["amount"],
                        unit_price=unit_price,
                    )

                    product.inventory_amount -= ol["amount"]
                    product.save()

                    orderlines.append("{0} {1}".format(ol["amount"], product))

            if order.is_external():
                messages.success(request, "Ekstern kjøpte {0}.".format(", ".join(orderlines)))
            else:
                messages.success(
                    request,
                    "{0} {1} kjøpte {2}.".format(
                        order.customer.first_name,
                        order.customer.last_name,
                        ", ".join(orderlines),
                    ),
                )

            return redirect("register")
        else:
            # TODO specify error(s)
            messages.error(request, "Skjemaet er ikke gyldig.")
            orderform = OrderForm(request.POST)
            formset = OrderLineFormSet(request.POST)
    else:
        orderform = OrderForm()
        formset = OrderLineFormSet()

    return render(request, "register.html", locals())


def deposit(request):
    users = User.objects.all().order_by("first_name", "last_name")
    users_js = users_format_js(users)
    allowed_users = users_with_perm("add_transaction")
    error_message_template = "{0} {1} kan ikke sette inn {2} kr, det overskrider maks saldo ({3} kr) med {4} kr"

    limit_deposists = settings.BBS_LIMIT_DEPOSITS

    if request.method == "POST":
        form = DepositForm(request.POST)
        if form.is_valid():
            amount = form.cleaned_data["amount"]
            user = form.cleaned_data["user"]
            if amount + user.profile.balance > settings.BBS_SALDO_MAX and amount + user.profile.balance != 1337:
                messages.error(
                    request,
                    error_message_template.format(
                        user.first_name,
                        user.last_name,
                        amount,
                        settings.BBS_SALDO_MAX,
                        amount + user.profile.balance - settings.BBS_SALDO_MAX,
                    ),
                )
                return HttpResponseRedirect(reverse("deposit"))

            transaction = form.save()
            profile = transaction.user.profile
            profile.balance += transaction.amount
            profile.save()

            messages.success(
                request,
                "{0} {1} satte inn {2} kr. Ny saldo er {3}".format(
                    transaction.user.first_name,
                    transaction.user.last_name,
                    transaction.amount,
                    profile.balance,
                ),
            )
            return HttpResponseRedirect(reverse("deposit"))
        else:
            messages.error(request, "Skjemaet er ikke gyldig.")
            form = DepositForm(request.POST)
    else:
        form = DepositForm()

    return render(request, "deposit.html", locals())


def log(request, limit=datetime.now() - timedelta(days=2)):
    if limit:
        # display last two days of orders and transactions
        orders = Order.objects.filter(created__gte=limit).order_by("-created")
        transactions = Transaction.objects.filter(created__gte=limit).order_by("-created")

        # no action in the last two days?
        # ...then display the last 5 items
        if len(orders) == 0:
            orders = Order.objects.all().order_by("-created")[:5]

        if len(transactions) == 0:
            transactions = Transaction.objects.all().order_by("-created")[:5]
    else:
        # display everything
        orders = Order.objects.all().order_by("-created")
        transactions = Transaction.objects.all().order_by("-created")

    return render(request, "log.html", locals())
