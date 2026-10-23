from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.contrib.auth.views import LoginView, LogoutView
from django.urls import include, path, re_path
from django.views.decorators.csrf import csrf_exempt
from django.views.static import serve
from strawberry.django.views import GraphQLView

from bbs.api.schema import schema
from bbs.views.spa import spa_index

admin.autodiscover()

api_patterns = [
    # bbs has no login template of its own; the admin's works for any user
    path(
        "accounts/login/",
        LoginView.as_view(template_name="admin/login.html", extra_context={"site_header": "BBS"}),
        name="django.contrib.auth.views.login",
    ),
    path(
        "accounts/logout/",
        LogoutView.as_view(),
        name="django.contrib.auth.views.logout",
    ),
    path("admin/", admin.site.urls),
    path("graphql/", csrf_exempt(GraphQLView.as_view(schema=schema)), name="graphql"),
]

urlpatterns = [
    path("inventory", spa_index, name="inventory"),
    path("inventory/", spa_index),
    path("inventory/add", spa_index, name="inventory-add"),
    path("inventory/add/", spa_index),
    path("report", spa_index, name="report"),
    path("report/", spa_index),
    path(settings.BBS_API_PREFIX, include(api_patterns)),
]

if settings.DEBUG:
    urlpatterns += static("/media", document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
else:
    # The container has no web server of its own for uploads, and there are few of them.
    # Any other path is a frontend route, which index.html renders.
    urlpatterns += [
        re_path(r"^media/(?P<path>.*)$", serve, {"document_root": settings.MEDIA_ROOT}),
        re_path(r"^(?!media/|static/).*$", spa_index),
    ]
