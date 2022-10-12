from django.contrib import admin

from bbs.models import *


class ProductAdmin(admin.ModelAdmin):
    pass


class CardAdmin(admin.ModelAdmin):
    list_display = ("name", "user", "card_id", "disabled")
    list_filter = ("disabled",)
    search_fields = ("user__username", "name")

    def get_search_results(self, request, queryset, search_term):
        return super().get_search_results(request, queryset, search_term)


admin.site.register(Product, ProductAdmin)
admin.site.register(InventoryTransaction)
admin.site.register(Order)
admin.site.register(OrderLine)
admin.site.register(Transaction)
admin.site.register(UserProfile)
admin.site.register(Card, CardAdmin)
