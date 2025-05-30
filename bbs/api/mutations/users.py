import strawberry
import strawberry_django
from django.contrib.auth.models import User as DjangoUser
from django.db import transaction
from strawberry import auto

from bbs import models
from bbs.api.types.users import User


@strawberry_django.input(DjangoUser)
class UserInput:
    email: auto
    first_name: auto
    last_name: auto


@strawberry.mutation
@transaction.atomic
def register_mutation(input: UserInput) -> User:  # noqa: A002
    user = DjangoUser.objects.create_user(
        first_name=input.first_name,
        last_name=input.last_name,
        email=input.email,
        username=input.email,
    )
    models.UserProfile.objects.create(user=user)
    return user


@strawberry.type
class UsersMutations:
    create_user = register_mutation
