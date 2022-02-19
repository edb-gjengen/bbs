import strawberry

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


schema = strawberry.Schema(query=Query, mutation=Mutation)
