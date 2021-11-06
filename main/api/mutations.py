import strawberry
from django.contrib.auth import get_user_model
from django.db import transaction
from django.shortcuts import get_object_or_404
from strawberry import ID

from main import models
from main.api.errors import Error, FormErrors, FieldError
from main.api.types import Order

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


Response = strawberry.union("CreateOrderResponse", [CreateOrderSuccess, InsufficientFunds, FormErrors])


@strawberry.mutation
@transaction.atomic
def create_order(customer_id: ID, order_lines: list[OrderLineInput], is_external: bool = False) -> Response:
    # clean and validate
    try:
        customer = UserModel.objects.get(pk=customer_id)
    except (UserModel.DoesNotExist, ValueError):
        customer = None

    if customer is None and not is_external:
        message = "Du har ikke valgt hvem som skal kjøpe."
        return FormErrors(
            message=message,
            fields=[FieldError(field="customer_id", message=message)],
        )

    ols = []
    order_sum = 0
    for ol in order_lines:
        product = get_object_or_404(models.Product, pk=ol.product_id)
        price = product.sale_price_ext if is_external else product.sale_price_int
        ols.append(models.OrderLine(product=product, amount=ol.amount, unit_price=price))
        order_sum += ol.amount * price

    if not is_external and customer.profile.balance <= order_sum:
        return InsufficientFunds(amount_lacking=abs(order_sum - customer.profile.balance))

    # create
    order = models.Order.objects.create(customer=customer, order_sum=order_sum)
    for ol in ols:
        ol.order = order
    models.OrderLine.objects.bulk_create(ols)

    return CreateOrderSuccess(order=order)
