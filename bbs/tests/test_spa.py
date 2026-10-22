import pytest  # noqa: INP001
from django.test import Client


@pytest.mark.parametrize("path", ["/inventory", "/inventory/add", "/report"])
def test_inventory_pages_serve_the_spa_entry(client: Client, path: str):
    response = client.get(path)

    assert response.status_code == 200
    assert b'<div id="root"></div>' in b"".join(response.streaming_content)
