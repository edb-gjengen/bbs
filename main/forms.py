from django import forms

from models import *

class OrderForm(forms.Form):
	pass

class OrderLineForm(forms.ModelForm):
	#product = forms.CharField(required=True, widget=forms.HiddenInput)
	#amount = forms.IntegerField(required=True)
	class Meta:
		model = OrderLine
		fields = ('amount','product')
		widgets = {
			'product': forms.HiddenInput(),
			'amount': forms.TextInput(attrs={'size': '2'}),
		}
	# TODO : Validation
