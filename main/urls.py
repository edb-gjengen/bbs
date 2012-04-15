from django.conf.urls.defaults import patterns, include, url

urlpatterns = patterns('main.views',
    url(r'^register/$', 'register', name='register'),
    url(r'^deposit/$', 'deposit', name='deposit'),
    url(r'^log/$', 'log', name='log'),
    url(r'^log/all$', 'log', kwargs={'limit': None}, name='log-all'),
    url(r'^stats/$', 'stats', name='stats'),
    url(r'^stats/orders$', 'stats_orders', name='stats-orders'),
    url(r'^stats/product/(?P<product>[0-9]+)$', 'stats_product', name='stats-product'),
    url(r'^products/(?P<product_id>[0-9]+)', 'products', name='json-product'),
    url(r'^products/$', 'products', name='json-products'),
)
