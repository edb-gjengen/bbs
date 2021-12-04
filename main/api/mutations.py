import strawberry
from django.conf import settings
from django.contrib.auth import get_user_model
from django.db import transaction
from django.shortcuts import get_object_or_404
from strawberry import ID

from main import models
from main.api.errors import Error, FormErrors, FieldError
from main.api.types import Order, Transaction, UserProfile

UserModel = get_user_model()


@strawberry.input
class OrderLineInput:
    product_id: ID
    amount: int


@strawberry.type
class CreateOrderSuccess:
    order: Order


@strawberry.type
class InsufficientFunds(Error):
    amount_lacking: float


CreateOrderResponse = strawberry.union("CreateOrderResponse", [CreateOrderSuccess, InsufficientFunds, FormErrors])


@strawberry.mutation
@transaction.atomic
def create_order(customer_id: ID, order_lines: list[OrderLineInput], is_external: bool = False) -> CreateOrderResponse:
    # clean and validate
    try:
        user = UserModel.objects.get(pk=customer_id)
    except (UserModel.DoesNotExist, ValueError):
        user = None

    if user is None and not is_external:
        message = "Du har ikke valgt hvem som skal kjøpe."
        return FormErrors(
            message=message,
            fields=[FieldError(field="customer_id", message=message)],
        )
    if not order_lines:
        message = "Du har ikke valgt hva du skal kjøpe."
        return FormErrors(
            message=message,
            fields=[FieldError(field="order_lines", message=message)],
        )

    ols = []
    order_sum = 0
    for ol in order_lines:
        product = get_object_or_404(models.Product, pk=ol.product_id)
        price = product.sale_price_ext if is_external else product.sale_price_int
        ols.append(models.OrderLine(product=product, amount=ol.amount, unit_price=price))
        order_sum += ol.amount * price
        product.inventory_amount -= ol.amount
        product.save()

    if not is_external and user.profile.balance <= order_sum:
        return InsufficientFunds(
            message="Du har ikke nok penger på bok.", amount_lacking=abs(order_sum - user.profile.balance)
        )

    # create
    order = models.Order.objects.create(customer=user, order_sum=order_sum)
    for ol in ols:
        ol.order = order
    models.OrderLine.objects.bulk_create(ols)

    # update balance
    if not is_external:
        user.profile.balance -= order_sum
        user.profile.save()

    return CreateOrderSuccess(order=order)


@strawberry.type
class CreateDepositSuccess:
    transaction: Transaction


@strawberry.type
class AboveMaxSaldo(Error):
    max_saldo: float
    above: float


CreateDepositResponse = strawberry.union("CreateDepositResponse", [CreateDepositSuccess, AboveMaxSaldo, FormErrors])


@strawberry.mutation
@transaction.atomic
def create_deposit(user_id: ID, amount: int) -> CreateDepositResponse:
    # clean and validate
    try:
        user = UserModel.objects.get(pk=user_id)
    except (UserModel.DoesNotExist, ValueError):
        message = "Du har ikke valgt hvem som sette inn penger."
        return FormErrors(
            message=message,
            fields=[FieldError(field="user_id", message=message)],
        )
    if amount <= 0:
        message = "Du har ikke valgt beløp som skal settes inn."
        return FormErrors(
            message=message,
            fields=[FieldError(field="amount", message=message)],
        )
    # 1337 is special <3
    if amount + user.profile.balance > settings.BBS_SALDO_MAX and amount + user.profile.balance != 1337:
        return AboveMaxSaldo(
            message="Du prøver å sette inn for mye penger",
            max_saldo=settings.BBS_SALDO_MAX,
            above=amount + user.profile.balance - settings.BBS_SALDO_MAX,
        )

    trans = models.Transaction.objects.create(user=user, amount=amount)
    profile = trans.user.profile
    profile.balance += trans.amount
    profile.save()

    return CreateDepositSuccess(transaction=trans)
