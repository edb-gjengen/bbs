"""Settings for the container image, from environment variables."""

import os

from bbs.settings import *  # noqa: F403
from bbs.settings import BASE_DIR, MIDDLEWARE

DEBUG = False
SECRET_KEY = os.environ["SECRET_KEY"]
ALLOWED_HOSTS = os.getenv("ALLOWED_HOSTS", "").split(",")
CSRF_TRUSTED_ORIGINS = [f"https://{host}" for host in ALLOWED_HOSTS if host]

# Django's routes live under /api/, the frontend at the root
BBS_API_PREFIX = "api/"
LOGIN_URL = "django.contrib.auth.views.login"

DATA_DIR = os.getenv("DATA_DIR", "/data")
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": os.path.join(DATA_DIR, "db.sqlite3"),  # noqa: PTH118
        # WAL lets gunicorn's workers read while one writes; IMMEDIATE makes a writer
        # wait for the lock up to `timeout` instead of failing mid-transaction.
        "OPTIONS": {
            "init_command": "PRAGMA journal_mode=WAL; PRAGMA synchronous=NORMAL;",
            "transaction_mode": "IMMEDIATE",
            "timeout": 20,
        },
    },
}
MEDIA_ROOT = os.path.join(DATA_DIR, "media")  # noqa: PTH118
STATIC_ROOT = os.path.join(BASE_DIR, "staticfiles")  # noqa: PTH118

# whitenoise serves Django's static files at STATIC_URL, and the built frontend
# (index.html, assets/) at the root
# SecurityMiddleware applies the TLS settings below
MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware",
    *MIDDLEWARE,
]
WHITENOISE_ROOT = os.path.join(BASE_DIR, "static")  # noqa: PTH118
WHITENOISE_INDEX_FILE = True
STORAGES = {
    "default": {"BACKEND": "django.core.files.storage.FileSystemStorage"},
    "staticfiles": {"BACKEND": "whitenoise.storage.CompressedManifestStaticFilesStorage"},
}

# TLS ends at the host's nginx
SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")
SECURE_SSL_REDIRECT = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True

if dsn := os.getenv("SENTRY_DSN"):
    import sentry_sdk
    from sentry_sdk.integrations.django import DjangoIntegration

    sentry_sdk.init(
        dsn=dsn,
        environment=os.getenv("SENTRY_ENVIRONMENT", "production"),
        release=os.getenv("SENTRY_RELEASE", "N/A"),
        integrations=[DjangoIntegration()],
        send_default_pii=True,
        traces_sample_rate=0,
        send_client_reports=False,
        auto_session_tracking=False,
    )
