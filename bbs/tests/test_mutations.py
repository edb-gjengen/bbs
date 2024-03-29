import pytest
from django.test import Client
from strawberry.django.test import GraphQLTestClient

from bbs.models import Order, Product


@pytest.fixture(name="gql_client")
def gql_client_fixture(client: Client):
    yield GraphQLTestClient(client)


@pytest.fixture(name="product")
def product_fix(db):
    return Product.objects.create(name="borg", sale_price_ext=35, sale_price_int=30)


def test_create_order(product, gql_client):
    assert Order.objects.count() == 0
    variables = dict(customerId="external", isExternal=True, orderLines=[{"productId": product.id, "amount": 1}])
    query = """
    mutation CreateOrder($customerId: ID!, $isExternal: Boolean!, $orderLines: [OrderLineInput!]!) {
      createOrder(customerId: $customerId, isExternal: $isExternal, orderLines: $orderLines) {
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
        }
      }
    }
    """
    res = gql_client.query(query, variables)
    assert res
    assert not res.errors
    assert res.data
    order_lines = res.data.get("createOrder", {}).get("order", {}).get("orderlines", [])
    assert order_lines
    assert order_lines[0]["product"]["id"] == str(product.id)
    assert Order.objects.count() == 1
    o = Order.objects.first()
    assert o.orderlines.first().product.id == product.id
