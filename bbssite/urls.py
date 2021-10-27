from django.conf import settings
from django.contrib import admin
from django.contrib.auth.views import LoginView, LogoutView
from django.contrib.staticfiles.urls import staticfiles_urlpatterns
from django.contrib.staticfiles.views import serve
from django.urls import path, re_path, include

from main import urls as main_urls


admin.autodiscover()

urlpatterns = [
    re_path(r"", include(main_urls)),
    path("accounts/login/", LoginView.as_view(), name="django.contrib.auth.views.login"),
    path(
        "accounts/logout/",
        LogoutView.as_view(),
        name="django.contrib.auth.views.logout",
    ),
    path("admin/", admin.site.urls),
]
urlpatterns += staticfiles_urlpatterns()

if settings.DEBUG:
    urlpatterns += [
        re_path(
            r"^media/(?P<path>.*)$",
            serve,
            {
                "document_root": settings.MEDIA_ROOT,
            },
        )
    ]
