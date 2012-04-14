from django.conf.urls.defaults import patterns, include, url

urlpatterns = patterns('main.views',
    url(r'^register/$', 'register', name='register'),
    url(r'^deposit/$', 'deposit', name='deposit'),
    url(r'^log/$', 'log', name='log'),
    url(r'^log/all$', 'log', kwargs={'limit': None}, name='log-all'),
    url(r'^stats/$', 'stats', name='stats'),
    url(r'^stats/orders$', 'stats_orders', name='stats-orders'),
    url(r'^stats/products$', 'products', name='stats-products'),
)
