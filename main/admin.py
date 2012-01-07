from django.contrib import admin
from main.models import *

class ProductAdmin(admin.ModelAdmin):
    pass

admin.site.register(Product, ProductAdmin)
admin.site.register(Order)
admin.site.register(OrderLine)
admin.site.register(Transaction)
admin.site.register(UserProfile)
