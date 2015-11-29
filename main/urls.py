from django.conf.urls import url, patterns
from main.api.views import ProductViewSet
from main.views.stats import stats_list, stats_products_realtime, stats_products_per_user, \
    OrdersHourlyView, OrdersDailyView, OrdersMonthlyView, OrdersYearlyView
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
    # Users
    url(r'^user/create/$', create_user, name='create-user'),
    url(r'^profile/$', profile, name='profile'),
    # Reports
    url(r'^inventory/$', inventory, name='inventory'),
    url(r'^inventory/add/$', inventory_add, name='inventory-add'),
    url(r'^report$', report, name='report'),

]
# Stats
urlpatterns += [
    url(r'^stats/$', stats_list, name='stats'),
    url(r'^stats/orders/hourly/$', OrdersHourlyView.as_view(), name='stats-orders-hourly'),
    url(r'^stats/orders/daily/', OrdersDailyView.as_view(), name='stats-orders-daily'),
    url(r'^stats/orders/monthly/', OrdersMonthlyView.as_view(), name='stats-orders-monthly'),
    url(r'^stats/orders/yearly/', OrdersYearlyView.as_view(), name='stats-orders-yearly'),
    url(r'^stats/orders/products_realtime$', stats_products_realtime, name='stats-products-realtime'),
    url(r'^stats/products/by_user/(?P<user_id>[0-9]+)/$', stats_products_per_user, name='stats-products-per-user'),
]
# Root level service-worker.js
urlpatterns += patterns(
    'django.contrib.staticfiles.views',
    url(r'^service-worker\.js$', 'serve', kwargs={'path': 'dist/service-worker.js'})
)

# API
router = DefaultRouter()
router.register(r'api/products', ProductViewSet)
urlpatterns += router.urls
