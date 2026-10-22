from bbs.forms import DateRangeForm, InventoryTransactionForm
from bbs.models import Product


def test_inventory_form_filters_active_products(db):  # noqa: ARG001
    active = Product.objects.create(name="active", sale_price_int=10, sale_price_ext=12, active=True)
    inactive = Product.objects.create(name="inactive", sale_price_int=10, sale_price_ext=12, active=False)
    product_queryset = InventoryTransactionForm().fields["product"].queryset

    assert active in product_queryset
    assert inactive not in product_queryset


def test_inventory_form_valid(db):  # noqa: ARG001
    product = Product.objects.create(name="borg", sale_price_ext=35, sale_price_int=30)
    form = InventoryTransactionForm(
        data={"product": product.pk, "amount": 5, "unit_price": "12.5", "comment": ""},
    )

    assert form.is_valid()


def test_inventory_form_invalid_missing_required_fields(db):  # noqa: ARG001
    form = InventoryTransactionForm(data={})

    assert not form.is_valid()
    assert "product" in form.errors


def test_date_range_form_allows_missing_dates():
    assert DateRangeForm(data={}).is_valid()


def test_date_range_form_accepts_dates():
    form = DateRangeForm(data={"start_time": "2026-01-01 00:00:00", "end_time": "2026-01-31 23:59:59"})

    assert form.is_valid()
    assert form.cleaned_data["start_time"] is not None
