from django.conf.urls import url
from main.api.views import ProductViewSet
from main.views.stats import stats_list, stats_orders, stats_orders_hourly, stats_products_realtime, stats_products_per_user
from main.views.general import register, deposit, log
from main.views.reports import inventory, inventory_add, report
from main.views.users import create_user, profile
from rest_framework.routers import DefaultRouter

urlpatterns = [
    url(r'^$', register, name='home'),
    url(r'^register/$', register, name='register'),
    url(r'^deposit/$', deposit, name='deposit'),
    url(r'^log/$', log, name='log'),
    url(r'^log/all$', log, kwargs={'limit': None}, name='log-all'),
    # Stats
    url(r'^stats/$', stats_list, name='stats'),
    url(r'^stats/orders/$', stats_orders, name='stats-orders'),
    url(r'^stats/orders/hourly$', stats_orders_hourly, name='stats-orders-hourly'),
    url(r'^stats/orders/products_realtime$', stats_products_realtime, name='stats-products-realtime'),
    url(r'^stats/products/by_user/(?P<user_id>[0-9]+)/$', stats_products_per_user, name='stats-products-per-user'),
    # Users
    url(r'^user/create/$', create_user, name='create-user'),
    url(r'^profile/$', profile, name='profile'),
    # Reports
    url(r'^inventory/$', inventory, name='inventory'),
    url(r'^inventory/add/$', inventory_add, name='inventory-add'),
    url(r'^report$', report, name='report'),
]

# API
router = DefaultRouter()
router.register(r'api/products', ProductViewSet)
urlpatterns += router.urls
