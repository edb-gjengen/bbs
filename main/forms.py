from django import forms

from models import *

class OrderForm(forms.ModelForm):
    # TODO : validate that the customer can afford the order
    class Meta:
        model = Order
        fields = ('customer',)

class OrderLineForm(forms.Form):
    product = forms.IntegerField(required=True)
    amount = forms.IntegerField(required=True)
    unit_price = forms.FloatField(required=True)

class DepositForm(forms.ModelForm):

    class Meta:
        model = Transaction
