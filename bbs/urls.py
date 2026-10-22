from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.contrib.auth.views import LoginView, LogoutView
from django.urls import path
from django.views.decorators.csrf import csrf_exempt
from strawberry.django.views import GraphQLView

from bbs.api.schema import schema
from bbs.views.spa import spa_index

admin.autodiscover()

urlpatterns = [
    path("inventory", spa_index, name="inventory"),
    path("inventory/", spa_index),
    path("inventory/add", spa_index, name="inventory-add"),
    path("inventory/add/", spa_index),
    path("report", spa_index, name="report"),
    path("report/", spa_index),
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
