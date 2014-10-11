from django.conf.urls import patterns, include, url


urlpatterns = patterns('main.views',
    url(r'^register/$', 'register', name='register'),
    url(r'^deposit/$', 'deposit', name='deposit'),
    url(r'^log/$', 'log', name='log'),
    url(r'^log/all$', 'log', kwargs={'limit': None}, name='log-all'),
    url(r'^stats/$', 'stats', name='stats'),
    url(r'^stats/orders/$', 'stats_orders', name='stats-orders'),
    url(r'^stats/orders/hourly$', 'stats_orders_hourly', name='stats-orders-hourly'),
    url(r'^stats/orders/products_realtime$', 'stats_products_realtime', name='stats-products-realtime'),
    url(r'^stats/products/$', 'stats_products', name='stats-products'),
    url(r'^stats/products/(?P<product>[0-9]+)/$', 'stats_products', name='stats-product'),
    url(r'^stats/products/by_user/(?P<user_id>[0-9]+)/$', 'stats_products_per_user', name='stats-products-per-user'),
    url(r'^products/(?P<product_id>[0-9]+)/$', 'products_json', name='json-product'),
    url(r'^products/$', 'products_json', name='json-products'),
    url(r'^user/create/$', 'create_user', name='create-user'),
    url(r'^profile/$', 'profile', name='profile'),
    url(r'^inventory/$', 'inventory', name='inventory'),
    url(r'^inventory/add/$', 'inventory_add', name='inventory-add'),
    url(r'^report$', 'report', name='report'),
    
)
