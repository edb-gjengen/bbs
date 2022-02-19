from django.urls import re_path

from main.views.reports import inventory, inventory_add, report

urlpatterns = [
    # TODO: migrate to SPA
    # Reports
    re_path(r"^inventory/$", inventory, name="inventory"),
    re_path(r"^inventory/add/$", inventory_add, name="inventory-add"),
    re_path(r"^report$", report, name="report"),
]
