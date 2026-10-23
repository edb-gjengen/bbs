import pytest
from django.contrib.auth.models import User as DjangoUser
from django.test import Client
from strawberry.django.test import GraphQLTestClient

from bbs.models import Order, OrderLine, Product, Transaction, UserProfile


@pytest.fixture
def product(db):  # noqa: ARG001
    return Product.objects.create(name="borg", sale_price_ext=35, sale_price_int=30)


@pytest.fixture
def user(db):  # noqa: ARG001
    u = DjangoUser.objects.create_user(
        username="test@example.com",
        email="test@example.com",
        first_name="Test",
        last_name="User",
    )
    UserProfile.objects.create(user=u, balance=10)
    return u


@pytest.fixture
def order(product):
    o = Order.objects.create(order_sum=35)
    OrderLine.objects.create(order=o, product=product, amount=1, unit_price=35)
    return o


@pytest.fixture
def transaction(user):
    return Transaction.objects.create(user=user, amount=100)


@pytest.fixture
def gql_client(client: Client):
    return GraphQLTestClient(client)
