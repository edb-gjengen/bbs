import strawberry
from django.contrib.auth.models import User as DjangoUser
from strawberry import ID

from bbs.api.types.users import User


@strawberry.type
class UsersQueries:
    @strawberry.field
    def all_users(self) -> list[User]:
        return DjangoUser.objects.filter(profile__isnull=False)

    @strawberry.field
    def user(self, user_id: ID) -> User:
        return DjangoUser.objects.get(pk=user_id)
