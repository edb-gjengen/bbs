from typing import List

import strawberry
import strawberry_django

from bbs.api.types.inventory import Transaction, TransactionOrdering


@strawberry.type
class InventoryQueries:
    transaction_list: List[Transaction] = strawberry_django.field(pagination=True, order=TransactionOrdering)
