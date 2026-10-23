import hashlib
from datetime import UTC, datetime
from decimal import Decimal

import pytest
from django.contrib.auth.models import User as DjangoUser

from bbs.models import (
    EXTERNAL_USER,
    InventoryTransaction,
    Order,
    OrderLine,
    Product,
    UserProfile,
    _format_counts,
)

# _format_counts
# ==============


def test_format_counts_with_last_name():
    rows = [{"order__customer__first_name": "Alice", "order__customer__last_name": "Smith", "count": 3}]
    result = _format_counts(rows)
    assert result[0]["name"] == "Alice S"


def test_format_counts_no_last_name():
    rows = [{"order__customer__first_name": "Bob", "order__customer__last_name": "", "count": 1}]
    result = _format_counts(rows)
    assert result[0]["name"] == "Bob"


def test_format_counts_external():
    rows = [{"order__customer__first_name": None, "order__customer__last_name": None, "count": 2}]
    result = _format_counts(rows)
    assert result[0]["name"] == EXTERNAL_USER


# Product
# =======


def test_product_str(product):
    assert str(product) == "borg"


def test_image_url_without_image(product):
    assert product.image_url == ""


def test_image_url_with_image(product):
    product.image = "products/test.jpg"
    assert product.image_url == product.image.url


def test_wholesale_unit_price_no_inventory(product):
    product.inventory_amount = 0
    assert product.wholesale_unit_price == 0


def test_wholesale_unit_price_no_transactions(product):
    product.inventory_amount = 5
    assert product.wholesale_unit_price == 0


def test_wholesale_unit_price_within_batch(user, product):
    product.inventory_amount = 5
    product.save()
    InventoryTransaction.objects.create(user=user, product=product, amount=10, unit_price=Decimal("8.0"))
    assert product.wholesale_unit_price == Decimal("8.0")


def test_wholesale_unit_price_exceeds_all_batches(user, product):
    product.inventory_amount = 20
    product.save()
    InventoryTransaction.objects.create(user=user, product=product, amount=5, unit_price=Decimal("8.0"))
    InventoryTransaction.objects.create(user=user, product=product, amount=5, unit_price=Decimal("6.0"))
    # inventory(20) > total transactions(10), falls back to first transaction's unit_price
    assert product.wholesale_unit_price == Decimal("8.0")


def test_wholesale_value(user, product):
    product.inventory_amount = 5
    product.save()
    InventoryTransaction.objects.create(user=user, product=product, amount=10, unit_price=Decimal("8.0"))
    assert product.wholesale_value == product.wholesale_unit_price * 5


def test_user_counts(user, product):
    o = Order.objects.create(customer=user, order_sum=60)
    OrderLine.objects.create(order=o, product=product, amount=2, unit_price=30)
    counts = product.user_counts()
    assert len(counts) == 1
    assert counts[0]["name"] == "Test U"
    assert counts[0]["count"] == 2


# OrderManager
# ============


def test_count_by_created_period_yearly(order):  # noqa: ARG001
    qs = list(Order.objects.count_by_created_period("yearly"))
    assert len(qs) == 1
    assert "period" in qs[0]


def test_count_by_created_period_monthly(order):  # noqa: ARG001
    qs = list(Order.objects.count_by_created_period("monthly"))
    assert len(qs) == 1


def test_count_by_created_period_daily(order):  # noqa: ARG001
    qs = list(Order.objects.count_by_created_period("daily"))
    assert len(qs) == 1


def test_count_by_created_period_hourly(order):  # noqa: ARG001
    qs = list(Order.objects.count_by_created_period("hourly"))
    assert len(qs) == 1


def test_count_by_created_period_invalid():
    with pytest.raises(AssertionError):
        Order.objects.count_by_created_period("weekly")


# Order
# =====


def test_order_is_external_true(db):  # noqa: ARG001
    o = Order.objects.create(order_sum=10)
    assert o.is_external() is True


def test_order_is_external_false(user):
    o = Order.objects.create(customer=user, order_sum=10)
    assert o.is_external() is False


def test_order_receipt_single_line(order):
    ol = order.orderlines.first()
    assert order.reciept() == str(ol)


def test_order_receipt_multiple_lines(product):
    product2 = Product.objects.create(name="cola", sale_price_ext=20, sale_price_int=15)
    o = Order.objects.create(order_sum=55)
    OrderLine.objects.create(order=o, product=product, amount=1, unit_price=35)
    OrderLine.objects.create(order=o, product=product2, amount=1, unit_price=20)
    receipt = o.reciept()
    assert "borg" in receipt
    assert "cola" in receipt
    assert ", " in receipt


def test_order_str_external(db):  # noqa: ARG001
    o = Order.objects.create(order_sum=Decimal("15.0"))
    assert EXTERNAL_USER in str(o)
    assert "15.0" in str(o)


def test_order_str_with_customer(user):
    o = Order.objects.create(customer=user, order_sum=Decimal("20.0"))
    assert str(user) in str(o)


# OrderLine / OrderLineManager
# ============================


def test_orderline_price(order):
    ol = order.orderlines.first()
    assert ol.price == ol.amount * ol.unit_price


def test_orderline_str(order):
    ol = order.orderlines.first()
    assert str(ol) == f"{ol.amount} {ol.product} ({ol.unit_price} kr per)"


def test_product_order_stats(order):  # noqa: ARG001
    qs = list(OrderLine.objects.all().product_order_stats())
    assert len(qs) == 1
    assert qs[0]["product_name"] == "borg"
    assert qs[0]["count"] == 1


def test_as_series_single_product(order):  # noqa: ARG001
    qs = OrderLine.objects.all().product_order_stats()
    series = qs.as_series()
    assert len(series) == 1
    assert series[0]["product_name"] == "borg"
    assert len(series[0]["data"]) == 1
    assert "x" in series[0]["data"][0]
    assert "y" in series[0]["data"][0]


def test_as_series_multiple_products(user, product):
    product2 = Product.objects.create(name="cola", sale_price_ext=20, sale_price_int=15)
    o = Order.objects.create(customer=user, order_sum=55)
    OrderLine.objects.create(order=o, product=product, amount=2, unit_price=30)
    OrderLine.objects.create(order=o, product=product2, amount=1, unit_price=20)
    qs = OrderLine.objects.all().product_order_stats()
    series = qs.as_series()
    assert {s["product_name"] for s in series} == {"borg", "cola"}


# Transaction
# ===========


def test_transaction_str(transaction, user):
    result = str(transaction)
    assert str(transaction.id) in result
    assert str(user) in result
    assert str(transaction.amount) in result


# InventoryTransaction
# ====================


def test_inventory_transaction_price(user, product):
    it = InventoryTransaction.objects.create(user=user, product=product, amount=3, unit_price=Decimal("10.0"))
    assert it.price == Decimal("30.0")


def test_inventory_transaction_str(user, product):
    it = InventoryTransaction.objects.create(user=user, product=product, amount=3, unit_price=Decimal("10.0"))
    result = str(it)
    assert str(it.id) in result
    assert str(user) in result
    assert "borg" in result


# UserProfile
# ===========


def test_userprofile_str(user):
    assert str(user.profile) == str(user)


def test_last_purchase_none(user):
    assert user.profile.last_purchase() is None


def test_last_purchase_returns_latest(user):
    Order.objects.create(customer=user, order_sum=10)
    o2 = Order.objects.create(customer=user, order_sum=20)
    assert user.profile.last_purchase() == o2


def test_last_purchase_date_no_orders(user):
    assert user.profile.last_purchase_date() == datetime.min.replace(tzinfo=UTC)


def test_last_purchase_date_with_orders(user):
    o = Order.objects.create(customer=user, order_sum=10)
    assert user.profile.last_purchase_date() == o.created


def test_top_months(user):
    Order.objects.create(customer=user, order_sum=50)
    Order.objects.create(customer=user, order_sum=30)
    result = list(user.profile.top_months())
    assert len(result) == 1
    assert result[0]["sum"] == Decimal("80.0")


def test_order_sum_total_no_orders(user):
    assert user.profile.order_sum_total() == 0


def test_order_sum_total_with_orders(user):
    Order.objects.create(customer=user, order_sum=Decimal("25.0"))
    Order.objects.create(customer=user, order_sum=Decimal("15.0"))
    assert user.profile.order_sum_total() == Decimal("40.0")


def test_userprofile_product_order_stats(user, product):
    o = Order.objects.create(customer=user, order_sum=30)
    OrderLine.objects.create(order=o, product=product, amount=1, unit_price=30)
    result = list(user.profile.product_order_stats())
    assert len(result) == 1
    assert result[0]["product_name"] == "borg"


def test_image_url_with_email(user):
    expected_hash = hashlib.sha256(user.email.lower().strip().encode()).hexdigest()
    assert expected_hash in user.profile.image_url()


def test_image_url_no_email(db):  # noqa: ARG001
    u = DjangoUser.objects.create_user(username="noemail", email="")
    profile = UserProfile.objects.create(user=u, balance=0)
    assert profile.image_url() == ""


def test_save_auto_populates_image(db):  # noqa: ARG001
    u = DjangoUser.objects.create_user(username="auto@test.com", email="auto@test.com")
    profile = UserProfile.objects.create(user=u, balance=0)
    assert profile.image != ""
    assert "gravatar" in profile.image


def test_save_preserves_existing_image(db):  # noqa: ARG001
    u = DjangoUser.objects.create_user(username="img@test.com", email="img@test.com")
    profile = UserProfile.objects.create(user=u, balance=0, image="https://example.com/custom.jpg")
    assert profile.image == "https://example.com/custom.jpg"
