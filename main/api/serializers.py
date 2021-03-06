from django.db.models import Sum, Count
from rest_framework import serializers
from rest_framework.serializers import ModelSerializer

from main.models import Product, OrderLine, Order


class ProductSerializer(ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'


class ProductStatSerializer(ModelSerializer):
    EXTERNAL_USER = 'Ekstern'
    counts = serializers.SerializerMethodField()

    def _format_counts(self, per_user):
        per_user = list(per_user)
        for row in per_user:
            first = row.pop('order__customer__first_name')
            last = row.pop('order__customer__last_name')
            if first is None:
                who = self.EXTERNAL_USER
            else:
                who = '{} {}'.format(first, last)
            row['full_name'] = who

        return per_user

    def get_counts(self, obj):
        name_fields = ['order__customer__first_name', 'order__customer__last_name']
        per_user = OrderLine.objects.filter(product=obj)
        per_user = per_user.values(*name_fields).annotate(amount_total=Sum('amount')).order_by('-amount_total')

        return self._format_counts(per_user)

    class Meta:
        model = Product
        fields = ['id', 'name', 'description', 'image', 'inventory_amount', 'active', 'created', 'counts']
