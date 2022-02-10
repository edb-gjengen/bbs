from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.db import connection
from django.db.models import Count, Sum
from django.shortcuts import redirect, render

from main.forms import SimpleCreateUserForm
from main.models import Order, Transaction


def create_user(request):
    if request.method == "POST":
        form = SimpleCreateUserForm(data=request.POST)
        if form.is_valid():
            user = form.save()
            messages.success(request, f"Hurra! {user.first_name}{user.last_name} er lagt til")
            return redirect("create-user")

        else:
            messages.error(request, "Feil med skjemaet, se under.")
            form = SimpleCreateUserForm(data=request.POST)
    else:
        form = SimpleCreateUserForm()

    return render(request, "registration/create_user.html", {"form": form})


@login_required
def profile(request):
    transactions = Transaction.objects.filter(user=request.user.pk)
    transaction_totals = {"sum": sum([t.amount for t in transactions])}
    orders = Order.objects.filter(customer=request.user.pk)
    orders_totals = {"sum": sum([o.order_sum for o in orders])}

    # order_lines = OrderLine.objects.filter(order__customer__pk=1).order_by("order__created")
    order_report = _orders_monthly(filter_by={"customer": request.user.pk})
    top_months = order_report.order_by("-sum")[:5]

    return render(request, "profile.html", locals())


def _orders_monthly(filter_by={}, order_by="month"):

    truncate_date = connection.ops.date_trunc_sql("month", "created")
    qs = Order.objects.filter(**filter_by).extra({"month": truncate_date})
    order_report = qs.values("month").annotate(sum=Sum("order_sum"), num=Count("pk")).order_by(order_by)

    return order_report
