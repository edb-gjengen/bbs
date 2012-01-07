from django.conf.urls.defaults import patterns, include, url

urlpatterns = patterns('bbs.main.views',
    url(r'^register/$', 'register', name='register'),
)
