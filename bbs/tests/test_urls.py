import importlib

import pytest
from django.test import Client
from django.urls import clear_url_caches

import bbs.urls


@pytest.fixture
def prod_urls(settings, tmp_path):
    """bbs.urls as the image loads it: routes under api/, uploads and frontend routes served."""
    settings.DEBUG = False
    settings.BBS_API_PREFIX = "api/"
    settings.MEDIA_ROOT = str(tmp_path)
    (tmp_path / "products").mkdir()
    (tmp_path / "products" / "beer.png").write_bytes(b"png")
    clear_url_caches()
    importlib.reload(bbs.urls)
    yield
    settings.DEBUG = True
    settings.BBS_API_PREFIX = ""
    clear_url_caches()
    importlib.reload(bbs.urls)


def test_graphql_under_api_prefix(prod_urls, client: Client, db):  # noqa: ARG001
    response = client.post("/api/graphql/", {"query": "{ allUsers { id } }"}, content_type="application/json")

    assert response.status_code == 200
    assert response.json() == {"data": {"allUsers": []}}


def test_login_page_renders(prod_urls, client: Client, db):  # noqa: ARG001
    response = client.get("/api/accounts/login/")

    assert response.status_code == 200
    assert b"csrfmiddlewaretoken" in response.content


@pytest.mark.parametrize("path", ["/deposit", "/stats/users", "/user/1"])
def test_frontend_routes_serve_the_spa_entry(prod_urls, client: Client, path: str):  # noqa: ARG001
    response = client.get(path)

    assert response.status_code == 200
    assert b'<div id="root"></div>' in b"".join(response.streaming_content)


def test_uploads_are_served(prod_urls, client: Client):  # noqa: ARG001
    response = client.get("/media/products/beer.png")

    assert response.status_code == 200
    assert b"".join(response.streaming_content) == b"png"
