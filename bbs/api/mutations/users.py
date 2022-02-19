import strawberry
import strawberry_django
from django.contrib.auth import get_user_model
from django.db import transaction
from strawberry_django import auto

from bbs import models
from bbs.api.types.users import User

DjangoUser = get_user_model()


@strawberry_django.input(DjangoUser)
class UserInput:
    email: auto
    first_name: auto
    last_name: auto


@strawberry.mutation
@transaction.atomic
def register_mutation(input: UserInput) -> User:
    user = DjangoUser.objects.create_user(
        first_name=input.first_name, last_name=input.last_name, email=input.email, username=input.email
    )
    models.UserProfile.objects.create(user=user)
    return user


@strawberry.type
class UsersMutations:
    create_user = register_mutation
