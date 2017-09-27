from django.conf import settings
from django.conf.urls import include, url
from django.contrib import admin
from django.contrib.auth.views import LoginView, LogoutView
from django.contrib.staticfiles.urls import staticfiles_urlpatterns
from django.contrib.staticfiles.views import serve

from main import urls as main_urls


admin.autodiscover()

urlpatterns = [
    url(r'', include(main_urls)),
    url(r'^accounts/login/$', LoginView.as_view(), name='django.contrib.auth.views.login'),
    url(r'^accounts/logout/$', LogoutView.as_view(), name='django.contrib.auth.views.logout'),

    url(r'^admin/', include(admin.site.urls)),
]
urlpatterns += staticfiles_urlpatterns()

if settings.DEBUG:
    urlpatterns += [
        url(r'^media/(?P<path>.*)$', serve, {
            'document_root': settings.MEDIA_ROOT,
        })
    ]
