import pytest  # noqa: INP001
from django.contrib.auth import get_user_model
from django.core.management import call_command
from django.test import Client
from strawberry.django.test import GraphQLTestClient

from bbs.models import InventoryTransaction, Order, Product, Transaction


@pytest.mark.django_db
def test_seed_demo_data_is_repeatable():
    call_command("seed_demo_data")
    call_command("seed_demo_data")

    assert get_user_model().objects.filter(username__startswith="demo-").count() == 3
    assert Product.objects.filter(name__startswith="Demo ").count() == 4
    assert Order.objects.count() == 5
    assert Transaction.objects.count() == 3
    assert InventoryTransaction.objects.count() == 4
    assert sum(product.inventory_amount for product in Product.objects.filter(name__startswith="Demo ")) == 109


@pytest.mark.django_db
def test_demo_data_is_available_when_an_admin_has_no_profile():
    user_model = get_user_model()
    user_model.objects.create_superuser(username="admin", email="admin@example.test", password="password")
    call_command("seed_demo_data")

    gql_client = GraphQLTestClient(Client())
    result = gql_client.query(
        """
        {
          allProducts(filters: {active: true}) { name }
          allUsers { firstName lastName profile { balance } }
        }
        """
    )

    assert not result.errors
    assert result.data
    assert len(result.data["allProducts"]) == 4
    assert len(result.data["allUsers"]) == 3

    ada = user_model.objects.get(username="demo-ada")
    detail_result = gql_client.query(
        """
        query UserDetail($userId: ID!) {
          user(userId: $userId) {
            firstName
            profile {
              balance
              lastPurchaseDate
              orderSumTotal
              topMonths { period sum count }
              productOrderStats { productName data { x y } }
            }
          }
        }
        """,
        variables={"userId": str(ada.pk)},
    )

    assert not detail_result.errors
    assert detail_result.data["user"]["profile"]["topMonths"]
    assert isinstance(detail_result.data["user"]["profile"]["topMonths"][0]["sum"], float)
