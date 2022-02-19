from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.contrib.auth.views import LoginView, LogoutView
from django.urls import include, path, re_path
from strawberry.django.views import GraphQLView

from main import urls as main_urls
from main.api.schema import schema

admin.autodiscover()

urlpatterns = [
    re_path(r"", include(main_urls)),
    path("accounts/login/", LoginView.as_view(), name="django.contrib.auth.views.login"),
    path("accounts/logout/", LogoutView.as_view(), name="django.contrib.auth.views.logout"),
    path("admin/", admin.site.urls),
    path("graphql/", GraphQLView.as_view(schema=schema), name="graphql"),
]

urlpatterns += static("/media", document_root=settings.MEDIA_ROOT)
urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
