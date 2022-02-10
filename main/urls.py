from django.contrib.staticfiles.views import serve
from django.urls import re_path

from main.views.reports import inventory, inventory_add, report
from main.views.users import create_user, profile

urlpatterns = [
    # TODO: migrate to SPA
    # Users
    re_path(r"^user/create/$", create_user, name="create-user"),
    re_path(r"^profile/$", profile, name="profile"),
    # Reports
    re_path(r"^inventory/$", inventory, name="inventory"),
    re_path(r"^inventory/add/$", inventory_add, name="inventory-add"),
    re_path(r"^report$", report, name="report"),
]

# Root level service-worker.js
urlpatterns += [re_path(r"^service-worker\.js$", serve, kwargs={"path": "dist/service-worker.js"})]
