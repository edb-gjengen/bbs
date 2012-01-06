from django.contrib import admin
from bbs.main.models import Product

class ProductAdmin(admin.ModelAdmin):
    pass

admin.site.register(Product, ProductAdmin)
