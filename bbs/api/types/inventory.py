from typing import TYPE_CHECKING, Annotated

import strawberry
import strawberry_django
from strawberry import auto

from bbs import models

if TYPE_CHECKING:
    from .users import User


@strawberry_django.order_type(models.Transaction)
class TransactionOrdering:
    created: auto


@strawberry_django.type(models.Transaction)
class Transaction:
    id: auto
    user: Annotated["User", strawberry.lazy(".users")]
    amount: auto
    created: auto
