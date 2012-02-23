# coding: utf-8
from django import forms
from django.utils.translation import ugettext as _

from models import *

class OrderForm(forms.ModelForm):
    def clean_customer(self):
        if self.cleaned_data['customer'].get_profile().balance <= 0:
            raise forms.ValidationError(_("Du har negativ saldo og kan ikke kjøpe noe."))

        return self.cleaned_data['customer']

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
