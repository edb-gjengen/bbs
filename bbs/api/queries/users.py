import strawberry
from django.contrib.auth.models import User as DjangoUser
from strawberry import ID, Info

from bbs.api.permissions import can_add_products, can_change_products
from bbs.api.types.users import User, Viewer


@strawberry.type
class UsersQueries:
    @strawberry.field
    def all_users(self) -> list[User]:
        return DjangoUser.objects.filter(profile__isnull=False)

    @strawberry.field
    def user(self, user_id: ID) -> User:
        return DjangoUser.objects.get(pk=user_id)

    @strawberry.field(description="The logged in user, or null when nobody is logged in")
    def me(self, info: Info) -> Viewer | None:
        user = info.context.request.user
        if not user.is_authenticated:
            return None
        return Viewer(
            id=user.pk,
            first_name=user.first_name,
            can_add_products=can_add_products(user),
            can_change_products=can_change_products(user),
        )
