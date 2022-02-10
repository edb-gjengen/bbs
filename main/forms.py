from django import forms
from django.contrib.auth.models import User

from main.models import InventoryTransaction, Product, UserProfile
from main.utils import format_username


class SimpleCreateUserForm(forms.Form):
    first_name = forms.CharField(required=True, label="Fornavn")
    last_name = forms.CharField(required=True, label="Etternavn")
    email = forms.EmailField(required=True, label="E-post")

    def save(self, commit=True):
        username = format_username(self.cleaned_data["first_name"], self.cleaned_data["last_name"])
        user = User.objects.create_user(username, email=self.cleaned_data["email"])
        user.first_name = self.cleaned_data["first_name"]
        user.last_name = self.cleaned_data["last_name"]

        profile = UserProfile.objects.create(user=user)
        profile.image = self._get_facebook_url()

        if commit:
            user.save()
            profile.save()

        return user


class InventoryTransactionForm(forms.ModelForm):
    unit_price = forms.FloatField(required=True, localize=True)

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
