# Django settings for bbs project.
import os

BASE_DIR = os.path.dirname(os.path.dirname(__file__))

DEBUG = True

ADMINS = (
    # ('Your Name', 'your_email@example.com'),
)
MANAGERS = ADMINS

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": "db.sqlite3",
    },
}

TIME_ZONE = "Europe/Oslo"
LANGUAGE_CODE = "nb"
USE_I18N = True
USE_L10N = True

SITE_ID = 1

# Media and uploads
MEDIA_ROOT = os.path.join(BASE_DIR, "media")
MEDIA_URL = "/media/"

# Static files
STATIC_ROOT = os.path.join(BASE_DIR, "staticfiles")
STATIC_URL = "/static/"
STATICFILES_DIRS = (os.path.join(BASE_DIR, "static"),)

STATICFILES_FINDERS = (
    "django.contrib.staticfiles.finders.FileSystemFinder",
    "django.contrib.staticfiles.finders.AppDirectoriesFinder",
)

# Make this unique, and don't share it with anybody.
SECRET_KEY = "osv$uy-ea$*%lc)+xiwt5@2b7au%u*c!pa6hmh#vl)*+tp%fss"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [
            os.path.join(BASE_DIR, "templates"),
        ],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.contrib.auth.context_processors.auth",
                "django.template.context_processors.request",
                "django.template.context_processors.debug",
                "django.template.context_processors.i18n",
                "django.template.context_processors.media",
                "django.template.context_processors.static",
                "django.template.context_processors.tz",
                "django.contrib.messages.context_processors.messages",
            ]
        },
    },
]

MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
]

ROOT_URLCONF = "bbssite.urls"

INSTALLED_APPS = [
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.sites",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "django.contrib.admin",
    "django_extensions",
    "rest_framework",
    "easy_thumbnails",
    "corsheaders",
]
LOCAL_APPS = [
    "main",
]
INSTALLED_APPS += LOCAL_APPS

LOGIN_REDIRECT_URL = "/"

SESSION_COOKIE_AGE = 1209600  # 15 minutes
SESSION_EXPIRE_AT_BROWSER_CLOSE = True

BBS_SALDO_MAX = 600
BBS_LIMIT_DEPOSITS = False

# Thumbnails
THUMBNAIL_ALIASES = {
    "": {
        "product": {"size": (64, 64), "crop": True},
    },
}

LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "root": {
        "level": "INFO",
        "handlers": ["console"],
    },
    "formatters": {
        "verbose": {"format": "%(levelname)s %(asctime)s %(module)s %(process)d %(thread)d %(message)s"},
    },
    "handlers": {
        "console": {
            "level": "DEBUG",
            "class": "logging.StreamHandler",
            "formatter": "verbose",
        },
    },
    "loggers": {
        "django.db.backends": {
            "level": "ERROR",
            "handlers": ["console"],
            "propagate": False,
        },
    },
}

DEFAULT_AUTO_FIELD = "django.db.models.AutoField"

CORS_ALLOWED_ORIGINS = [
    "https://bbs.neuf.no",
    "http://localhost:8000",
    "http://localhost:3000",
]

try:
    from .local_settings import *
except ImportError:
    pass
