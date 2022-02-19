import strawberry

from main.api.mutations.shop import ShopMutations
from main.api.mutations.users import UsersMutations
from main.api.queries.inventory import InventoryQueries
from main.api.queries.shop import ShopQueries
from main.api.queries.users import UsersQueries


@strawberry.type
class Query(InventoryQueries, ShopQueries, UsersQueries):
    pass


@strawberry.type
class Mutation(ShopMutations, UsersMutations):
    pass


schema = strawberry.Schema(query=Query, mutation=Mutation)
