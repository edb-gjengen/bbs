import pytest
from django.test import Client
from strawberry.django.test import GraphQLTestClient

from main.api.mutations import create_order
from main.models import Order, Product
from main.testing import MutationTest


@pytest.fixture(name="gql_client")
def gql_client_fixture(client: Client):
    yield GraphQLTestClient(client)


@pytest.fixture(name="product")
def product_fix(db):
    return Product.objects.create(name="borg", sale_price_ext=35, sale_price_int=30)


@pytest.fixture(name="create_order_mutation")
def create_order_mutation_fixture(product):
    fields = """
    ... on CreateOrderSuccess {
      order {
        id
        orderSum
        orderlines {
          id
          product {
            id
          }
        }
      }
    }"""
    # FIXME: maybe drop this helper and just use GraphQLTestClient
    return MutationTest(create_order, fields)


def test_create_order(product, create_order_mutation):
    assert Order.objects.count() == 0
    res = create_order_mutation.mutate(
        customerId="external", isExternal=True, orderLines=[{"productId": product.id, "amount": 1}]
    )
    assert res
    assert not res.errors
    assert res.data
    order_lines = res.data.get("createOrder", {}).get("order", {}).get("orderlines", [])
    assert order_lines
    assert order_lines[0]["product"]["id"] == str(product.id)
    assert Order.objects.count() == 1
    o = Order.objects.first()
    assert o.orderlines.first().product.id == product.id
