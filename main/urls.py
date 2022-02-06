from django.contrib.staticfiles.views import serve
from django.urls import include, path, re_path

from main.views.general import deposit, register
from main.views.reports import inventory, inventory_add, report
from main.views.stats import stats_products_per_user, stats_products_realtime
from main.views.users import create_user, profile

spa_kwargs = {"path": "modern/index.html"}

legacy_patterns = [
    path("", register, name="home-legacy"),
    path("deposit", deposit, name="deposit-legacy"),
]

urlpatterns = [
    path("", serve, kwargs=spa_kwargs, name="home"),
    path("deposit", serve, kwargs=spa_kwargs, name="deposit"),
    path("log", serve, kwargs=spa_kwargs, name="log"),
    path("stats", serve, kwargs=spa_kwargs, name="stats"),
    # TODO: migrate to SPA
    # Users
    re_path(r"^user/create/$", create_user, name="create-user"),
    re_path(r"^profile/$", profile, name="profile"),
    # Reports
    re_path(r"^inventory/$", inventory, name="inventory"),
    re_path(r"^inventory/add/$", inventory_add, name="inventory-add"),
    re_path(r"^report$", report, name="report"),
    path("legacy/", include(legacy_patterns)),
]

# Stats
urlpatterns += [
    re_path(
        r"^stats/orders/products_realtime$",
        stats_products_realtime,
        name="stats-products-realtime",
    ),
    re_path(
        r"^stats/products/by_user/(?P<user_id>[0-9]+)/$",
        stats_products_per_user,
        name="stats-products-per-user",
    ),
]
# Root level service-worker.js
urlpatterns += [re_path(r"^service-worker\.js$", serve, kwargs={"path": "dist/service-worker.js"})]
