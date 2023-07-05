from django import forms

from bbs.models import InventoryTransaction, Product

MAX_DIGITS = 9
DECIMAL_PLACES = 1

class InventoryTransactionForm(forms.ModelForm):
    unit_price = forms.DecimalField(max_digits=MAX_DIGITS, decimal_places=DECIMAL_PLACES, required=True, localize=True)

    def __init__(self, *args, **kwargs):
        # Only show active products
        super(InventoryTransactionForm, self).__init__(*args, **kwargs)
        self.fields["product"].queryset = Product.objects.filter(active=True)

    class Meta:
        model = InventoryTransaction
        fields = ["product", "amount", "unit_price", "comment"]


class DateRangeForm(forms.Form):
    start_time = forms.DateTimeField(required=False, label="Fra")
    end_time = forms.DateTimeField(required=False, label="Til")
