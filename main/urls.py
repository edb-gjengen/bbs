from django.conf.urls.defaults import patterns, include, url

urlpatterns = patterns('',
    url(r'^$', 'bbs.main.views.home', name='home'),
    url(r'^register/$', 'bbs.main.views.register', name='register'),
)
