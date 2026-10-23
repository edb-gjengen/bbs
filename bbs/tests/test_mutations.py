from django.contrib.auth import get_user_model
from django.utils import timezone

from bbs.models import InventoryTransaction, Order, OrderLine, Transaction, UserProfile

CREATE_ORDER = """
mutation CreateOrder($customerId: ID!, $isExternal: Boolean!, $orderLines: [OrderLineInput!]!) {
  createOrder(customerId: $customerId, isExternal: $isExternal, orderLines: $orderLines) {
    ... on CreateOrderSuccess {
      order { id orderSum orderlines { id product { id } } }
    }
    ... on InsufficientFunds {
      amountLacking
      error
    }
    ... on FormErrors {
      message
    }
  }
}
"""

CREATE_DEPOSIT = """
mutation CreateDeposit($userId: ID!, $amount: Int!) {
  createDeposit(userId: $userId, amount: $amount) {
    ... on CreateDepositSuccess {
      transaction { id amount }
    }
    ... on AboveMaxSaldo {
      maxSaldo
      above
    }
    ... on FormErrors {
      message
    }
  }
}
"""

CREATE_USER = """
mutation CreateUser($input: UserInput!) {
  createUser(input: $input) {
    id
    firstName
    lastName
  }
}
"""


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


def test_create_order_no_customer(product, gql_client):
    res = gql_client.query(
        CREATE_ORDER,
        {
            "customerId": "999",
            "isExternal": False,
            "orderLines": [{"productId": product.id, "amount": 1}],
        },
    )
    assert not res.errors
    assert res.data["createOrder"]["message"]


def test_create_order_empty_lines(product, gql_client):  # noqa: ARG001
    res = gql_client.query(
        CREATE_ORDER,
        {
            "customerId": "external",
            "isExternal": True,
            "orderLines": [],
        },
    )
    assert not res.errors
    assert res.data["createOrder"]["message"]


def test_create_order_insufficient_funds(user, product, gql_client):
    res = gql_client.query(
        CREATE_ORDER,
        {
            "customerId": str(user.id),
            "isExternal": False,
            "orderLines": [{"productId": product.id, "amount": 1}],
        },
    )
    assert not res.errors
    assert res.data["createOrder"]["amountLacking"] == 20
    assert res.data["createOrder"]["error"] is True
    assert Order.objects.count() == 0
    product.refresh_from_db()
    assert product.inventory_amount == 0


def test_create_order_internal_success(user, product, gql_client):
    user.profile.balance = 100
    user.profile.save()
    res = gql_client.query(
        CREATE_ORDER,
        {
            "customerId": str(user.id),
            "isExternal": False,
            "orderLines": [{"productId": product.id, "amount": 1}],
        },
    )
    assert not res.errors
    assert res.data["createOrder"]["order"]
    user.profile.refresh_from_db()
    assert user.profile.balance == 70
    product.refresh_from_db()
    assert product.inventory_amount == -1


def test_create_order_exact_balance(user, product, gql_client):
    user.profile.balance = 30
    user.profile.save()
    res = gql_client.query(
        CREATE_ORDER,
        {
            "customerId": str(user.id),
            "isExternal": False,
            "orderLines": [{"productId": product.id, "amount": 1}],
        },
    )
    assert not res.errors
    assert res.data["createOrder"]["order"]
    user.profile.refresh_from_db()
    assert user.profile.balance == 0


def test_create_deposit(user, gql_client):
    res = gql_client.query(CREATE_DEPOSIT, {"userId": str(user.id), "amount": 100})
    assert not res.errors
    assert res.data["createDeposit"]["transaction"]
    assert Transaction.objects.count() == 1
    user.profile.refresh_from_db()
    assert user.profile.balance == 110


def test_create_deposit_invalid_user(db, gql_client):  # noqa: ARG001
    res = gql_client.query(CREATE_DEPOSIT, {"userId": "999", "amount": 100})
    assert not res.errors
    assert res.data["createDeposit"]["message"]


def test_create_deposit_invalid_amount(user, gql_client):
    res = gql_client.query(CREATE_DEPOSIT, {"userId": str(user.id), "amount": 0})
    assert not res.errors
    assert res.data["createDeposit"]["message"]


def test_create_deposit_above_max_saldo(user, gql_client):
    res = gql_client.query(CREATE_DEPOSIT, {"userId": str(user.id), "amount": 1000})
    assert not res.errors
    assert res.data["createDeposit"]["maxSaldo"] is not None
    assert res.data["createDeposit"]["above"] == 10
    assert Transaction.objects.count() == 0


def test_create_deposit_1337(user, gql_client):
    # balance=10, so amount=1327 makes balance+amount==1337, bypassing max saldo
    res = gql_client.query(CREATE_DEPOSIT, {"userId": str(user.id), "amount": 1327})
    assert not res.errors
    assert res.data["createDeposit"]["transaction"]


def test_create_user(db, gql_client):  # noqa: ARG001
    res = gql_client.query(CREATE_USER, {"input": {"email": "new@example.com", "firstName": "New", "lastName": "User"}})
    assert not res.errors
    assert get_user_model().objects.filter(username="new@example.com").exists()
    assert UserProfile.objects.count() == 1
