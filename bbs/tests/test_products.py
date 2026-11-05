from decimal import Decimal

import pytest
from django.contrib.auth.models import Permission
from django.contrib.auth.models import User as DjangoUser

from bbs.models import Product

ME = "query { me { firstName canAddProducts canChangeProducts } }"

SAVE_RESULT = """
    ... on SaveProductSuccess {
      product { id name salePriceInt salePriceExt volumeLiter alcoholPercent description active inventoryAmount }
    }
    ... on FormErrors { message fields { field message } }
"""
CREATE_PRODUCT = f"mutation CreateProduct($data: ProductInput!) {{ createProduct(data: $data) {{ {SAVE_RESULT} }} }}"
UPDATE_PRODUCT = f"""
mutation UpdateProduct($productId: ID!, $data: ProductInput!) {{
  updateProduct(productId: $productId, data: $data) {{ {SAVE_RESULT} }}
}}
"""

PRODUCT_DATA = {
    "name": "Ny pils",
    "salePriceInt": "25.0",
    "salePriceExt": "30.0",
    "volumeLiter": "0.5",
    "alcoholPercent": "4.7",
    "description": "Frisk",
    "active": True,
}


def make_user(username, *, staff=False, superuser=False, permissions=()):
    user = DjangoUser.objects.create_user(username=username, first_name=username.title())
    user.is_staff = staff
    user.is_superuser = superuser
    user.save()
    user.user_permissions.set(Permission.objects.filter(content_type__app_label="bbs", codename__in=permissions))
    return user


@pytest.fixture
def staff_with_product_access(db):  # noqa: ARG001
    return make_user("lager", staff=True, permissions=["add_product", "change_product"])


# me
# ==


def test_me_is_null_when_logged_out(db, gql_client):  # noqa: ARG001
    res = gql_client.query(ME)
    assert not res.errors
    assert res.data["me"] is None


@pytest.mark.parametrize(
    ("staff", "superuser", "permissions", "can_add", "can_change"),
    [
        (False, False, ["add_product", "change_product"], False, False),  # permissions without admin access
        (True, False, [], False, False),
        (True, False, ["change_product"], False, True),
        (True, False, ["add_product", "change_product"], True, True),
        (True, True, [], True, True),
    ],
)
def test_me_reports_product_access(db, gql_client, client, staff, superuser, permissions, can_add, can_change):  # noqa: ARG001, PLR0913, PLR0917
    client.force_login(make_user("someone", staff=staff, superuser=superuser, permissions=permissions))
    res = gql_client.query(ME)
    assert not res.errors
    assert res.data["me"] == {"firstName": "Someone", "canAddProducts": can_add, "canChangeProducts": can_change}


# createProduct
# =============


def test_create_product(gql_client, client, staff_with_product_access):
    client.force_login(staff_with_product_access)
    res = gql_client.query(CREATE_PRODUCT, {"data": PRODUCT_DATA})
    assert not res.errors
    product = res.data["createProduct"]["product"]
    assert product["name"] == "Ny pils"
    assert product["inventoryAmount"] == 0

    saved = Product.objects.get(pk=product["id"])
    assert saved.sale_price_int == Decimal("25.0")
    assert saved.volume_liter == Decimal("0.5")
    assert saved.active


@pytest.mark.parametrize(
    ("user_kwargs", "message"),
    [
        (None, "Logg inn for å endre varer."),
        ({}, "Du har ikke tilgang til å endre varer."),
        ({"permissions": ["add_product"]}, "Du har ikke tilgang til å endre varer."),  # not staff
        ({"staff": True, "permissions": ["change_product"]}, "Du har ikke tilgang til å endre varer."),
    ],
)
def test_create_product_requires_admin_access(db, gql_client, client, user_kwargs, message):  # noqa: ARG001
    if user_kwargs is not None:
        client.force_login(make_user("someone", **user_kwargs))
    res = gql_client.query(CREATE_PRODUCT, {"data": PRODUCT_DATA})
    assert not res.errors
    assert res.data["createProduct"]["message"] == message
    assert not Product.objects.exists()


@pytest.mark.parametrize(
    ("changes", "field"),
    [
        ({"name": ""}, "name"),
        ({"salePriceInt": "-1"}, "sale_price_int"),
        ({"salePriceExt": "12.55"}, "sale_price_ext"),  # one decimal at most
        ({"volumeLiter": None}, "volume_liter"),
        ({"alcoholPercent": "-0.5"}, "alcohol_percent"),
    ],
)
def test_create_product_validates(gql_client, client, staff_with_product_access, changes, field):
    client.force_login(staff_with_product_access)
    res = gql_client.query(CREATE_PRODUCT, {"data": {**PRODUCT_DATA, **changes}})
    assert not res.errors
    errors = res.data["createProduct"]
    assert errors["message"] == "Varen ble ikke lagret. Rett opp feilene i skjemaet."
    assert [error["field"] for error in errors["fields"]] == [field]
    assert not Product.objects.exists()


# updateProduct
# =============


def test_update_product(product, gql_client, client):
    product.inventory_amount = 7
    product.save()
    client.force_login(make_user("admin", staff=True, superuser=True))

    res = gql_client.query(UPDATE_PRODUCT, {"productId": str(product.id), "data": {**PRODUCT_DATA, "active": False}})
    assert not res.errors
    assert res.data["updateProduct"]["product"]["name"] == "Ny pils"

    product.refresh_from_db()
    assert product.name == "Ny pils"
    assert product.sale_price_ext == Decimal("30.0")
    assert not product.active
    assert product.inventory_amount == 7  # stock only changes through transactions and sales


def test_update_product_requires_change_permission(product, gql_client, client):
    client.force_login(make_user("someone", staff=True, permissions=["add_product"]))
    res = gql_client.query(UPDATE_PRODUCT, {"productId": str(product.id), "data": PRODUCT_DATA})
    assert not res.errors
    assert res.data["updateProduct"]["message"] == "Du har ikke tilgang til å endre varer."
    product.refresh_from_db()
    assert product.name == "borg"


def test_update_missing_product(gql_client, client, staff_with_product_access):
    client.force_login(staff_with_product_access)
    res = gql_client.query(UPDATE_PRODUCT, {"productId": "999", "data": PRODUCT_DATA})
    assert not res.errors
    assert res.data["updateProduct"]["message"] == "Fant ikke varen."


# product
# =======


def test_product_query(product, gql_client):
    res = gql_client.query("query P($id: ID!) { product(productId: $id) { name } }", {"id": str(product.id)})
    assert not res.errors
    assert res.data["product"]["name"] == "borg"
