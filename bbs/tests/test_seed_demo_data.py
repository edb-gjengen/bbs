import pytest
from django.contrib.auth import get_user_model
from django.core.management import call_command
from django.test import Client
from strawberry.django.test import GraphQLTestClient

from bbs.management.commands.seed_demo_data import DEMO_PRODUCTS
from bbs.models import InventoryTransaction, Order, Product, Transaction, UserProfile

DEMO_PRODUCT_NAMES = [name for name, *_ in DEMO_PRODUCTS]


@pytest.mark.django_db
def test_seed_demo_data_is_repeatable():
    call_command("seed_demo_data")
    call_command("seed_demo_data")

    assert get_user_model().objects.filter(username__startswith="demo-").count() == 9
    assert Product.objects.filter(name__in=DEMO_PRODUCT_NAMES).count() == 6
    assert Order.objects.count() == 11
    assert Transaction.objects.count() == 9
    assert InventoryTransaction.objects.count() == 6
    assert sum(product.inventory_amount for product in Product.objects.filter(name__in=DEMO_PRODUCT_NAMES)) == 155
    assert all(profile.balance >= 0 for profile in UserProfile.objects.all())
    assert all("pravatar.cc" in profile.image for profile in UserProfile.objects.all())


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
    assert len(result.data["allProducts"]) == 6
    assert len(result.data["allUsers"]) == 9

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


@pytest.mark.django_db
def test_seed_demo_data_random_size_adds_consistent_data():
    call_command("seed_demo_data", size="small", seed=1, users=5, orders=30)

    random_users = get_user_model().objects.exclude(username__startswith="demo-")
    assert random_users.count() == 5
    assert Order.objects.count() == 11 + 30
    for user in random_users:
        deposits = sum(t.amount for t in Transaction.objects.filter(user=user))
        purchases = sum(o.order_sum for o in Order.objects.filter(customer=user))
        assert user.profile.balance == deposits - purchases
        assert user.profile.balance >= 0
    assert all(product.inventory_amount >= 0 for product in Product.objects.all())


@pytest.mark.django_db
def test_seed_demo_data_random_size_can_run_twice():
    call_command("seed_demo_data", size="small", seed=1, users=5, orders=5)
    call_command("seed_demo_data", size="small", seed=1, users=5, orders=5)

    assert get_user_model().objects.exclude(username__startswith="demo-").count() == 10
