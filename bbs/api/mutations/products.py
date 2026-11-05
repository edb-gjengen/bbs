from decimal import Decimal
from typing import Annotated

import strawberry
from django.core.exceptions import ValidationError
from django.db import transaction
from strawberry import ID, Info

from bbs import models
from bbs.api.errors import FieldError, FormErrors
from bbs.api.permissions import can_add_products, can_change_products
from bbs.api.types.shop import Product


@strawberry.input
class ProductInput:
    name: str
    sale_price_int: Decimal
    sale_price_ext: Decimal
    volume_liter: Decimal | None = None
    alcohol_percent: Decimal | None = None
    description: str = ""
    active: bool = True


# The stock changes through inventory transactions and sales, and the image through the admin
EDITABLE_FIELDS = [
    "name",
    "sale_price_int",
    "sale_price_ext",
    "volume_liter",
    "alcohol_percent",
    "description",
    "active",
]
NON_NEGATIVE_FIELDS = ["sale_price_int", "sale_price_ext", "volume_liter", "alcohol_percent"]


@strawberry.type
class SaveProductSuccess:
    product: Product


SaveProductResponse = Annotated[SaveProductSuccess | FormErrors, strawberry.union("SaveProductResponse")]


def _access_denied(user) -> FormErrors:
    message = "Du har ikke tilgang til å endre varer." if user.is_authenticated else "Logg inn for å endre varer."
    return FormErrors(message=message, fields=[FieldError(field="user", message=message)])


def _save(product: models.Product, data: ProductInput) -> SaveProductResponse:
    for field in EDITABLE_FIELDS:
        setattr(product, field, getattr(data, field))

    errors: dict[str, list[str]] = {}
    try:
        product.full_clean()
    except ValidationError as e:
        errors = e.message_dict
    for field in NON_NEGATIVE_FIELDS:
        value = getattr(product, field)
        if value is not None and value < 0:
            errors.setdefault(field, []).append("Kan ikke være negativ.")

    if errors:
        return FormErrors(
            message="Varen ble ikke lagret. Rett opp feilene i skjemaet.",
            fields=[FieldError(field=field, message=" ".join(messages)) for field, messages in errors.items()],
        )
    product.save()
    return SaveProductSuccess(product=product)


@strawberry.mutation
@transaction.atomic
def create_product(info: Info, data: ProductInput) -> SaveProductResponse:
    user = info.context.request.user
    if not can_add_products(user):
        return _access_denied(user)
    return _save(models.Product(), data)


@strawberry.mutation
@transaction.atomic
def update_product(info: Info, product_id: ID, data: ProductInput) -> SaveProductResponse:
    user = info.context.request.user
    if not can_change_products(user):
        return _access_denied(user)
    try:
        product = models.Product.objects.select_for_update().get(pk=product_id)
    except models.Product.DoesNotExist, ValueError:
        message = "Fant ikke varen."
        return FormErrors(message=message, fields=[FieldError(field="product_id", message=message)])
    return _save(product, data)


@strawberry.type
class ProductMutations:
    create_product = create_product
    update_product = update_product
