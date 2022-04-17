import strawberry
from django.core.exceptions import ObjectDoesNotExist
from strawberry.extensions import Extension

from bbs.api.mutations.shop import ShopMutations
from bbs.api.mutations.users import UsersMutations
from bbs.api.queries.inventory import InventoryQueries
from bbs.api.queries.shop import ShopQueries
from bbs.api.queries.users import UsersQueries


@strawberry.type
class Query(InventoryQueries, ShopQueries, UsersQueries):
    pass


@strawberry.type
class Mutation(ShopMutations, UsersMutations):
    pass


class HandleNotFound(Extension):
    def on_request_end(self):
        result = self.execution_context.result
        if result.errors:
            for error in result.errors:
                if isinstance(error.original_error, ObjectDoesNotExist):
                    error.extensions = {
                        "code": "NOT_FOUND",
                        "model": type(error.original_error).__qualname__.replace(".DoesNotExist", ""),
                    }


schema = strawberry.Schema(query=Query, mutation=Mutation, extensions=[HandleNotFound])
