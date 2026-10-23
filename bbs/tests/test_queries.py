ALL_USERS = "query { allUsers { id firstName lastName } }"
USER = "query User($userId: ID!) { user(userId: $userId) { id firstName lastName } }"
USER_PROFILE = "query User($userId: ID!) { user(userId: $userId) { profile { balance topMonths { period count sum } productOrderStats { productName data { x y } } } } }"
ALL_PRODUCTS = "query { allProducts { id name } }"
ALL_ORDERS = "query { allOrders { id orderSum } }"
ORDER_LIST = "query { orderList { id orderSum } }"
ORDER_STATS = "query { orderStats { yearly { period count } monthly { period count } daily { period count } hourly { period count } } }"
PRODUCT_STATS = "query { productStats { productName data { x y } } }"
TRANSACTION_LIST = "query { transactionList { id amount } }"


def test_user(user, gql_client):
    res = gql_client.query(USER, {"userId": str(user.id)})
    assert not res.errors
    assert res.data["user"]["id"] == str(user.id)


def test_all_users(user, gql_client):  # noqa: ARG001
    res = gql_client.query(ALL_USERS)
    assert not res.errors
    assert len(res.data["allUsers"]) == 1


def test_all_products(product, gql_client):  # noqa: ARG001
    res = gql_client.query(ALL_PRODUCTS)
    assert not res.errors
    assert len(res.data["allProducts"]) == 1


def test_all_orders(order, gql_client):  # noqa: ARG001
    res = gql_client.query(ALL_ORDERS)
    assert not res.errors
    assert len(res.data["allOrders"]) == 1


def test_order_list(order, gql_client):  # noqa: ARG001
    res = gql_client.query(ORDER_LIST)
    assert not res.errors
    assert len(res.data["orderList"]) == 1


def test_order_stats(db, gql_client):  # noqa: ARG001
    res = gql_client.query(ORDER_STATS)
    assert not res.errors
    assert "daily" in res.data["orderStats"]


def test_product_stats(order, gql_client):  # noqa: ARG001
    res = gql_client.query(PRODUCT_STATS)
    assert not res.errors
    assert res.data["productStats"]


def test_transaction_list(transaction, gql_client):  # noqa: ARG001
    res = gql_client.query(TRANSACTION_LIST)
    assert not res.errors
    assert len(res.data["transactionList"]) == 1


def test_user_profile(user, gql_client):
    res = gql_client.query(USER_PROFILE, {"userId": str(user.id)})
    assert not res.errors
    assert res.data["user"]["profile"]["balance"] is not None
