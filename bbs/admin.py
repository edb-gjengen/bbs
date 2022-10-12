from django.contrib import admin

from bbs.models import *


class ProductAdmin(admin.ModelAdmin):
    pass


class CardAdmin(admin.ModelAdmin):
    list_display = ("name", "user", "card_id", "active")
    list_filter = ("active",)
    search_fields = ("user__username", "name")


admin.site.register(Product, ProductAdmin)
admin.site.register(InventoryTransaction)
admin.site.register(Order)
admin.site.register(OrderLine)
admin.site.register(Transaction)
admin.site.register(UserProfile)
admin.site.register(Card, CardAdmin)
