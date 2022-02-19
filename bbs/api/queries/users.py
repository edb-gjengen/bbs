from typing import List

import strawberry
import strawberry_django
from django.contrib.auth.models import User as DjangoUser
from strawberry import ID

from bbs.api.types.users import User


@strawberry.type
class UsersQueries:
    all_users: List[User] = strawberry_django.field()

    @strawberry.field
    def user(self, user_id: ID) -> User:
        return DjangoUser.objects.get(pk=user_id)
