# coding: utf-8
from django import forms
from django.contrib.auth.models import User
from django.utils.translation import ugettext as _

from models import *

import utils

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
    unit_price = forms.FloatField(required=True, localize=True)

class DepositForm(forms.ModelForm):

    class Meta:
        model = Transaction

class SimpleCreateUserForm(forms.Form):
    first_name = forms.CharField(required=True, label="Fornavn")
    last_name = forms.CharField(required=True, label="Etternavn")
    email = forms.EmailField(required=True, label="E-post")
    facebook_username = forms.CharField(required=False, label="Facebook-brukernavn")

    def _get_facebook_url(self, facebook_username):
        if facebook_username == "":
            return ""
        return "https://graph.facebook.com/{0}/picture".format(facebook_username)

    def save(self, commit=True):   
        username = utils.format_username(self.cleaned_data['first_name'], self.cleaned_data['last_name'])
        user = User.objects.create_user(username, email=self.cleaned_data['email'])
        user.first_name = self.cleaned_data['first_name']
        user.last_name = self.cleaned_data['last_name']

        profile = user.get_profile()
        profile.image = self._get_facebook_url(self.cleaned_data['facebook_username'])

        if commit:
            user.save()
            profile.save()

        return user

class InventoryTransactionForm(forms.ModelForm):
    unit_price = forms.FloatField(required=True, localize=True)

    def __init__(self, *args, **kwargs):
        # Only show active products
        super (InventoryTransactionForm, self).__init__(*args,**kwargs)
        self.fields['product'].queryset = Product.objects.filter(active=True)    

    class Meta:
        model = InventoryTransaction
        fields = ['product', 'amount', 'unit_price', 'comment']

class DateRangeForm(forms.Form):
    start_time = forms.DateTimeField(required=False, label=_("Fra"))
    end_time = forms.DateTimeField(required=False, label=_("Til"))

