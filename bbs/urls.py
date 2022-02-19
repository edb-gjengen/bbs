from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.contrib.auth.views import LoginView, LogoutView
from django.urls import path, re_path
from strawberry.django.views import GraphQLView

from bbs.api.schema import schema
from bbs.views.reports import inventory, inventory_add, report

admin.autodiscover()

urlpatterns = [
    # TODO: migrate reports to SPA
    re_path(r"^inventory/$", inventory, name="inventory"),
    re_path(r"^inventory/add/$", inventory_add, name="inventory-add"),
    re_path(r"^report$", report, name="report"),
    path("accounts/login/", LoginView.as_view(), name="django.contrib.auth.views.login"),
    path("accounts/logout/", LogoutView.as_view(), name="django.contrib.auth.views.logout"),
    path("admin/", admin.site.urls),
    path("graphql/", GraphQLView.as_view(schema=schema), name="graphql"),
]

urlpatterns += static("/media", document_root=settings.MEDIA_ROOT)
urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
