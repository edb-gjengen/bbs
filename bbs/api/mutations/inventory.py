from decimal import Decimal
from typing import Annotated

import strawberry
from django.db import transaction
from strawberry import ID, Info

from bbs import models
from bbs.api.errors import FieldError, FormErrors
from bbs.api.types.inventory import InventoryTransaction


@strawberry.input
class InventoryTransactionInput:
    product_id: ID
    amount: int
    unit_price: Decimal
    comment: str = ""


@strawberry.type
class CreateInventoryTransactionSuccess:
    inventory_transaction: InventoryTransaction


CreateInventoryTransactionResponse = Annotated[
    CreateInventoryTransactionSuccess | FormErrors,
    strawberry.union("CreateInventoryTransactionResponse"),
]


@strawberry.mutation
@transaction.atomic
def create_inventory_transaction(
    info: Info,
    data: InventoryTransactionInput,
) -> CreateInventoryTransactionResponse:
    user = info.context.request.user
    if not user.is_authenticated:
        message = "Logg inn for å registrere varetransaksjoner."
        return FormErrors(message=message, fields=[FieldError(field="user", message=message)])

    try:
        product = models.Product.objects.get(pk=data.product_id, active=True)
    except (models.Product.DoesNotExist, ValueError):
        message = "Velg et aktivt produkt."
        return FormErrors(message=message, fields=[FieldError(field="product_id", message=message)])

    product.inventory_amount += data.amount
    product.save()
    inventory_transaction = models.InventoryTransaction.objects.create(
        user=user,
        product=product,
        amount=data.amount,
        unit_price=data.unit_price,
        comment=data.comment,
    )
    return CreateInventoryTransactionSuccess(inventory_transaction=inventory_transaction)


@strawberry.type
class InventoryMutations:
    create_inventory_transaction = create_inventory_transaction
