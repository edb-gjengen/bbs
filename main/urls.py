from django.conf.urls.defaults import patterns, include, url

urlpatterns = patterns('main.views',
    url(r'^register/$', 'register', name='register'),
    url(r'^deposit/$', 'deposit', name='deposit'),
    url(r'^log/$', 'log', name='log'),
    url(r'^log/all$', 'log', kwargs={'limit': None}, name='log-all'),
)
