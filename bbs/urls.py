from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.contrib.auth.views import LoginView, LogoutView
from django.views.decorators.csrf import csrf_exempt
from django.urls import path
from strawberry.django.views import GraphQLView

from bbs.api.schema import schema
from bbs.views.reports import inventory, inventory_add, report

admin.autodiscover()

urlpatterns = [
    # TODO: migrate reports to SPA
    path("inventory/", inventory, name="inventory"),
    path("inventory/add/", inventory_add, name="inventory-add"),
    path("report", report, name="report"),
    path("accounts/login/", LoginView.as_view(), name="django.contrib.auth.views.login"),
    path(
        "accounts/logout/",
        LogoutView.as_view(),
        name="django.contrib.auth.views.logout",
    ),
    path("admin/", admin.site.urls),
    path("graphql/", csrf_exempt(GraphQLView.as_view(schema=schema)), name="graphql"),
]

urlpatterns += static("/media", document_root=settings.MEDIA_ROOT)
urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
