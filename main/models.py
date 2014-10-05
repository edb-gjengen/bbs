from django.contrib.auth.models import User
from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.utils.translation import ugettext as _
from datetime import datetime


class Product(models.Model):

    def __unicode__(self):
        return self.name

    name = models.CharField(max_length=64)
    sale_price_int = models.FloatField()
    sale_price_ext = models.FloatField()
    description = models.CharField(max_length=256, blank=True)
    volume_liter = models.FloatField(null=True)
    alcohol_percent = models.FloatField(null=True)
    image = models.ImageField(upload_to='products', blank=True)
    customer_support = models.CharField(max_length=32, blank=True)
    inventory_amount = models.FloatField(default=0)
    active = models.BooleanField(default=True)
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)

    @property
    def wholesale_unit_price(self):
        """
            This is not accurate.
        """
        if self.inventory_amount <= 0:
            return 0

        unit_prices = self.transactions.order_by('created').values('amount', 'unit_price')
        sum_units = 0
        for up in unit_prices:
            sum_units += up['amount']
            if self.inventory_amount <= sum_units:
                return up['unit_price']

        return unit_prices[0]['unit_price']

    @property
    def wholesale_value(self):
        return self.wholesale_unit_price * self.inventory_amount

    class Meta:
        ordering = ['name']


class Order(models.Model):
    customer = models.ForeignKey(User, null=True, blank=True)
    order_sum = models.FloatField(db_column='sum')
    created = models.DateTimeField(auto_now_add=True)

    def is_external(self):
        return self.customer is None

    def __unicode__(self):
        return u"{0}: {1} kr".format(self.customer or u"Ekstern", self.order_sum)


class OrderLine(models.Model):
    order = models.ForeignKey('main.Order')
    product = models.ForeignKey('main.Product', related_name='orderlines')
    amount = models.IntegerField()
    unit_price = models.FloatField(verbose_name=_('Enhetspris'))

    @property
    def price(self):
        return self.amount * self.unit_price

    def __unicode__(self):
        return u"{0} {1} ({2} kr per)".format(self.amount, self.product, self.unit_price)

    class Meta:
        unique_together = ('order', 'product')


class Transaction(models.Model):
    """ Money """
    user = models.ForeignKey(User)
    amount = models.FloatField()
    created = models.DateTimeField(auto_now_add=True)

    def __unicode__(self):
        return u"{0}: {1}: {2}".format(self.id, self.user, self.amount)


class InventoryTransaction(models.Model):
    """ Goods """
    user = models.ForeignKey(User)
    product = models.ForeignKey('main.Product', related_name='transactions', verbose_name=_('Produkt'))
    amount = models.FloatField(verbose_name=_('Antall'))
    unit_price = models.FloatField(verbose_name=_('Enhetspris'))
    comment = models.TextField(verbose_name=_('Kommentar'), blank=True)
    created = models.DateTimeField(auto_now_add=True)

    @property
    def price(self):
        return self.amount * self.unit_price

    def __unicode__(self):
        return u"{0}: {1}: {2} ({3} kr per)".format(
            self.id,
            self.user,
            self.product,
            self.amount,
            self.unit_price)


class UserProfile(models.Model):
    user = models.OneToOneField(User)
    balance = models.FloatField(default=0.0)
    #image = models.ImageField(upload_to='users', blank=True)
    image = models.URLField(blank=True)

    def last_purchase(self):
        if len(self.user.order_set.all()) == 0:
            return None
        return self.user.order_set.order_by('created').reverse()[0]

    def last_purchase_date(self):
        last = self.last_purchase()
        if last:
            return last.created
        else:
            return datetime.min

    def __unicode__(self):
        return u"{0}".format(self.user)


# Create a new UserProfile object when we create a new User.
@receiver(post_save, sender=User, dispatch_uid='randomz')
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        UserProfile.objects.create(user=instance)