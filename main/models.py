from django.contrib.auth.models import User
from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver

class Product(models.Model):

	def __unicode__(self):
		return self.name

	name = models.CharField(max_length=64)
	sale_price_int = models.FloatField()
	sale_price_ext = models.FloatField()
	description = models.CharField(max_length=256, blank=True)
	volume_liter = models.FloatField(null=True)
	alcohol_percent = models.FloatField(null=True)
	image = models.ImageField(upload_to='uploads', blank=True)
	active = models.BooleanField(default=True)
	customer_support = models.CharField(max_length=32, blank=True)
	created = models.DateTimeField(auto_now_add=True)
	updated = models.DateTimeField(auto_now=True)

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
	amount = models.FloatField()
	created = models.DateTimeField(auto_now_add=True)

class UserProfile(models.Model):
	user = models.ForeignKey(User, unique=True)
	balance = models.FloatField(default=0.0)
	image = models.ImageField(upload_to='uploads', blank=True)

# Create a new UserProfile object when we create a new User.
@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
	if created:
		UserProfile.objects.create(user=instance)
