from pathlib import Path

from django.contrib.staticfiles import finders
from django.http import FileResponse, Http404


def spa_index(_request):
    index_path = finders.find("index.html")
    if not index_path:
        raise Http404("The frontend has not been built.")
    return FileResponse(Path(index_path).open("rb"), content_type="text/html")
