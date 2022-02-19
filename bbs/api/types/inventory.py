import strawberry_django
from strawberry_django import auto

from bbs import models
from bbs.api.types.users import User


@strawberry_django.ordering.order(models.Transaction)
class TransactionOrdering:
    created: auto


@strawberry_django.type(models.Transaction)
class Transaction:
    id: auto
    user: "User"
    amount: auto
    created: auto
