from django.conf.urls import url
from django.contrib.staticfiles.views import serve
from django.urls import include, path
from rest_framework.routers import DefaultRouter

from main.api.views import ProductViewSet
from main.views.general import deposit, log, register
from main.views.reports import inventory, inventory_add, report
from main.views.stats import (
    OrdersDailyView,
    OrdersHourlyView,
    OrdersMonthlyView,
    OrdersYearlyView,
    stats_list,
    stats_products_per_user,
    stats_products_realtime,
)
from main.views.users import create_user, profile

spa_kwargs = {"path": "modern/index.html"}

legacy_patterns = [
    path("", register, name="home-legacy"),
    path("deposit", deposit, name="deposit-legacy"),
]

urlpatterns = [
    path("", serve, kwargs=spa_kwargs, name="home"),
    path("deposit", serve, kwargs=spa_kwargs, name="deposit"),
    # TODO: migrate to SPA
    url(r"^log/$", log, name="log"),
    url(r"^log/all$", log, kwargs={"limit": None}, name="log-all"),
    # Users
    url(r"^user/create/$", create_user, name="create-user"),
    url(r"^profile/$", profile, name="profile"),
    # Reports
    url(r"^inventory/$", inventory, name="inventory"),
    url(r"^inventory/add/$", inventory_add, name="inventory-add"),
    url(r"^report$", report, name="report"),
    path("legacy/", include(legacy_patterns)),
]

# Stats
urlpatterns += [
    url(r"^stats/$", stats_list, name="stats"),
    url(
        r"^stats/orders/hourly/$",
        OrdersHourlyView.as_view(),
        name="stats-orders-hourly",
    ),
    url(r"^stats/orders/daily/", OrdersDailyView.as_view(), name="stats-orders-daily"),
    url(
        r"^stats/orders/monthly/",
        OrdersMonthlyView.as_view(),
        name="stats-orders-monthly",
    ),
    url(r"^stats/orders/yearly/", OrdersYearlyView.as_view(), name="stats-orders-yearly"),
    url(
        r"^stats/orders/products_realtime$",
        stats_products_realtime,
        name="stats-products-realtime",
    ),
    url(
        r"^stats/products/by_user/(?P<user_id>[0-9]+)/$",
        stats_products_per_user,
        name="stats-products-per-user",
    ),
]
# Root level service-worker.js
urlpatterns += [url(r"^service-worker\.js$", serve, kwargs={"path": "dist/service-worker.js"})]

# API
router = DefaultRouter()
router.register(r"api/products", ProductViewSet)
urlpatterns += router.urls
