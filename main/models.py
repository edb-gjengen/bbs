from django.db import models
from django.contrib.auth.models import User

class Product(models.Model):
	description = models.CharField(max_length=256, blank=True)
	name = models.CharField(max_length=64)
	sale_price_int = models.FloatField()
	sale_price_ext = models.FloatField()
	volume_liter = models.FloatField(null=True)
	alcohol_percent = models.FloatField(null=True)
	image = models.ImageField(upload_to='uploads')
	created = models.DateTimeField(auto_now_add=True)
	updated = models.DateTimeField(auto_now=True)
	active = models.BooleanField(default=True)
	customer_support = models.CharField(max_length=32, blank=True)

class Order(models.Model):
	user = models.ForeignKey(User)
	order_sum = models.FloatField(db_column='sum')
	created = models.DateTimeField(auto_now_add=True)

class OrderLine(models.Model):
	order = models.ForeignKey(Order)
	product = models.ForeignKey(Product)
	amount = models.IntegerField()
	unit_price = models.FloatField()

	class Meta:
		unique_together = ('order', 'product')

class Transaction(models.Model):
	user = models.ForeignKey(User)
	created = models.DateTimeField(auto_now_add=True)
	amount = models.FloatField()

class UserProfile(models.Model):
	user = models.ForeignKey(User, unique=True)
	balance = models.FloatField()
	image = models.ImageField(upload_to='uploads')
