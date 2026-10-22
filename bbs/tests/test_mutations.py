import pytest
from django.contrib.auth import get_user_model
from django.test import Client
from django.utils import timezone
from strawberry.django.test import GraphQLTestClient

from bbs.models import InventoryTransaction, Order, OrderLine, Product, Transaction


@pytest.fixture(name="gql_client")
def gql_client_fixture(client: Client):
    return GraphQLTestClient(client)


@pytest.fixture(name="product")
def product_fix(db):  # noqa: ARG001
    return Product.objects.create(name="borg", sale_price_ext=35, sale_price_int=30)


def test_user_not_found(db, gql_client):  # noqa: ARG001
    result = gql_client.query(
        """
        query User($userId: ID!) {
          user(userId: $userId) {
            id
          }
        }
        """,
        {"userId": "999"},
        assert_no_errors=False,
    )

    assert result.errors
    error = result.errors[0]
    assert error["path"] == ["user"]
    assert error["extensions"]["code"] == "NOT_FOUND"
    assert error["extensions"]["model"] == "User"


def test_create_order(product, gql_client):
    assert Order.objects.count() == 0
    variables = {
        "customerId": "external",
        "isExternal": True,
        "orderLines": [{"productId": product.id, "amount": 1}],
    }
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


def test_create_inventory_transaction_requires_login(product, gql_client):
    result = gql_client.query(
        """
        mutation CreateInventoryTransaction($data: InventoryTransactionInput!) {
          createInventoryTransaction(data: $data) {
            ... on FormErrors { message }
          }
        }
        """,
        variables={"data": {"productId": str(product.id), "amount": 5, "unitPrice": "12.5"}},
    )

    assert not result.errors
    assert result.data["createInventoryTransaction"]["message"] == "Logg inn for å registrere varetransaksjoner."
    product.refresh_from_db()
    assert product.inventory_amount == 0
    assert InventoryTransaction.objects.count() == 0


def test_create_inventory_transaction_updates_stock(product, gql_client, client):
    user = get_user_model().objects.create_user(username="stock-manager")
    client.force_login(user)

    result = gql_client.query(
        """
        mutation CreateInventoryTransaction($data: InventoryTransactionInput!) {
          createInventoryTransaction(data: $data) {
            ... on CreateInventoryTransactionSuccess {
              inventoryTransaction {
                amount
                unitPrice
                product { id inventoryAmount }
                user { id }
              }
            }
          }
        }
        """,
        variables={
            "data": {
                "productId": str(product.id),
                "amount": 5,
                "unitPrice": "12.5",
                "comment": "Restock",
            }
        },
    )

    assert not result.errors
    transaction = result.data["createInventoryTransaction"]["inventoryTransaction"]
    assert transaction["amount"] == 5
    assert transaction["unitPrice"] == "12.5"
    assert transaction["product"]["inventoryAmount"] == 5
    assert transaction["user"]["id"] == str(user.id)
    product.refresh_from_db()
    assert product.inventory_amount == 5


def test_inventory_report_aggregates_period_data(product, gql_client):
    user = get_user_model().objects.create_user(username="report-user")
    InventoryTransaction.objects.create(user=user, product=product, amount=5, unit_price=10)
    transaction = Transaction.objects.create(user=user, amount=100)
    order = Order.objects.create(order_sum=30)
    OrderLine.objects.create(order=order, product=product, amount=2, unit_price=15)
    start_time = timezone.make_naive(timezone.now() - timezone.timedelta(days=1))
    end_time = timezone.make_naive(timezone.now() + timezone.timedelta(days=1))

    result = gql_client.query(
        """
        query InventoryReport($startTime: DateTime!, $endTime: DateTime!) {
          inventoryReport(startTime: $startTime, endTime: $endTime) {
            products {
              productId
              purchaseUnits
              purchaseValue
              salesUnits
              salesValue
            }
            inventoryPurchases
            productSales
            deposits
            orderPurchases
            balanceAtStart
            balanceAtEnd
          }
        }
        """,
        variables={"startTime": start_time.isoformat(), "endTime": end_time.isoformat()},
    )

    assert not result.errors
    report = result.data["inventoryReport"]
    assert report["products"] == [
        {
            "productId": str(product.id),
            "purchaseUnits": 5,
            "purchaseValue": "50",
            "salesUnits": 2,
            "salesValue": "30",
        }
    ]
    assert report["inventoryPurchases"] == "50"
    assert report["productSales"] == "30"
    assert report["deposits"] == "100"
    assert report["orderPurchases"] == "30"
    assert report["balanceAtStart"] == "0"
    assert report["balanceAtEnd"] == "70"
    assert transaction.amount == 100

    products_result = gql_client.query(
        """
        query InventoryProducts {
          allProducts {
            id
            active
            inventoryAmount
            wholesaleUnitPrice
            wholesaleValue
          }
          inventoryTransactionList(ordering: [{created: DESC}], pagination: {limit: 20, offset: 0}) {
            amount
            unitPrice
            product { name }
            user { firstName lastName }
          }
        }
        """
    )

    assert not products_result.errors
    assert products_result.data["allProducts"][0]["active"]
    assert products_result.data["inventoryTransactionList"][0]["amount"] == 5
