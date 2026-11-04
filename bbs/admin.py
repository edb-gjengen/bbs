from django.contrib import admin

from bbs.models import (
    InventoryTransaction,
    Order,
    OrderLine,
    Product,
    Transaction,
    UserProfile,
)


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ["name", "active", "inventory_amount"]
    list_filter = ["active"]


admin.site.register(InventoryTransaction)
admin.site.register(Order)
admin.site.register(OrderLine)
admin.site.register(Transaction)
admin.site.register(UserProfile)
