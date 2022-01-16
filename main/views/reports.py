from datetime import datetime, timedelta
from itertools import groupby

from django.contrib import messages
from django.shortcuts import redirect, render

from main.forms import DateRangeForm, InventoryTransactionForm
from main.models import InventoryTransaction, Order, Product, Transaction, UserProfile


def report(request):
    # FIXME: split this up in smaller pieces
    datetime_now = datetime.now()
    start_time = datetime.now() - timedelta(days=30)
    # start of day, 1 month
    start_time = start_time.replace(hour=0, minute=0, second=0, microsecond=0)
    # end of day
    end_time = datetime.now().replace(hour=23, minute=59, second=59, microsecond=999)

    if request.GET.get("start_time", False) or request.GET.get("end_time", False):
        form = DateRangeForm(request.GET)
        if form.is_valid():
            start_time = form.cleaned_data["start_time"]
            # end of day
            end_time = form.cleaned_data["end_time"].replace(hour=23, minute=59, second=59, microsecond=999)

    else:
        form = DateRangeForm(
            initial={
                "start_time": start_time.strftime("%Y-%m-%d"),
                "end_time": end_time.strftime("%Y-%m-%d"),
            }
        )

    # Inventory
    products = (
        Product.objects.filter(transactions__created__range=[start_time, end_time])
        .values("name", "transactions__unit_price", "transactions__amount")
        .order_by("name")
    )
    # group by name and sum
    inventory_products = {}
    for k, g in groupby(products, lambda x: x["name"]):
        group = []
        for el in g:
            el["transactions__price"] = el["transactions__amount"] * el["transactions__unit_price"]
            group.append(el)
        inventory_products.update(
            {
                k: {
                    "name": k,
                    "transactions": group,
                    "transactions_sum": sum(map(lambda x: x["transactions__price"], group)),
                    "transactions_units": sum(map(lambda x: x["transactions__amount"], group)),
                }
            }
        )

    itrans = InventoryTransaction.objects.filter(created__range=[start_time, end_time])
    inv_in = sum(map(lambda x: x[1].get("transactions_sum", 0), inventory_products.items()))

    # out
    out_products = (
        Product.objects.filter(orderlines__order__created__range=[start_time, end_time])
        .values("name", "orderlines__unit_price", "orderlines__amount")
        .order_by("name")
    )
    # group by name and sum
    for k, g in groupby(out_products, lambda x: x["name"]):
        group = []
        for el in g:
            el["orderlines__price"] = el["orderlines__amount"] * el["orderlines__unit_price"]
            group.append(el)

        product = {
            "name": k,
            "orderlines": group,
            "orderlines_sum": sum(map(lambda x: x["orderlines__price"], group)),
            "orderlines_units": sum(map(lambda x: x["orderlines__amount"], group)),
        }
        if k in inventory_products:
            # add diff
            inventory_products[k].update(product)
        else:
            inventory_products.update({k: product})

    for p in inventory_products.items():
        p[1]["value_diff"] = p[1].get("transactions_sum", 0) - p[1].get("orderlines_sum", 0)
        p[1]["units_diff"] = p[1].get("transactions_units", 0) - p[1].get("orderlines_units", 0)

    inv_out = sum(map(lambda x: x[1].get("orderlines_sum", 0), inventory_products.items()))

    inv_diff = inv_in - inv_out

    # Deposits and sales
    saldo_profiles = sum(UserProfile.objects.all().values_list("balance", flat=True))
    deposits = sum(Transaction.objects.all().values_list("amount", flat=True))
    purchases = sum(Order.objects.all().values_list("order_sum", flat=True))
    saldo = deposits - purchases

    deposits_start = sum(Transaction.objects.filter(created__lt=start_time).values_list("amount", flat=True))
    purchases_start = sum(Order.objects.filter(created__lt=start_time).values_list("order_sum", flat=True))
    saldo_start = deposits_start - purchases_start

    deposits_end = sum(Transaction.objects.filter(created__lt=end_time).values_list("amount", flat=True))
    purchases_end = sum(Order.objects.filter(created__lt=end_time).values_list("order_sum", flat=True))
    saldo_end = deposits_end - purchases_end

    deposits_diff = deposits_end - deposits_start
    purchases_diff = purchases_end - purchases_start
    saldo_diff = saldo_end - saldo_start

    return render(request, "report.html", locals())


def inventory(request):
    products = Product.objects.all().order_by("-active", "inventory_amount", "name")
    transactions = InventoryTransaction.objects.all().order_by("-created")
    products_active = products.filter(active=True)
    wholesale_value = sum([p.wholesale_value for p in products_active])
    num_products = sum(products_active.values_list("inventory_amount", flat=True))

    return render(request, "inventory.html", locals())


def inventory_add(request):
    if request.method == "POST":
        form = InventoryTransactionForm(data=request.POST)
        if form.is_valid():
            itrans = form.save(commit=False)
            # Add amount and user, then save
            itrans.product.inventory_amount += itrans.amount
            itrans.user = request.user
            itrans.product.save()
            itrans.save()
            messages.success(request, "Satt inn {0} stk {1}.".format(itrans.amount, itrans.product))
            return redirect("inventory-add")

        else:
            messages.error(request, "Feil med skjemaet, se under.")
            form = InventoryTransactionForm(data=request.POST)
    else:
        form = InventoryTransactionForm()

    return render(request, "inventory_add.html", locals())
