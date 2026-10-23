FROM node:26-trixie-slim AS frontend
WORKDIR /src/frontend
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci
COPY frontend/ ./
# Django serves its routes under /api/ in the image (BBS_API_PREFIX in settings_prod.py)
ENV VITE_API_URL=/api
RUN npm run build

FROM python:3.14-slim-trixie AS build
COPY --from=ghcr.io/astral-sh/uv:0.13.4 /uv /bin/uv
# mysqlclient ships no wheels; it stays until no database is copied from MySQL
RUN apt-get update \
    && apt-get install -y --no-install-recommends build-essential pkg-config default-libmysqlclient-dev \
    && rm -rf /var/lib/apt/lists/*
# The venv lives outside /app so the final stage copies it as a layer of its own, which
# only a dependency change replaces.
ENV UV_COMPILE_BYTECODE=1 UV_LINK_MODE=copy UV_PYTHON_DOWNLOADS=never UV_PROJECT_ENVIRONMENT=/venv
WORKDIR /app
COPY pyproject.toml uv.lock ./
RUN uv sync --locked --no-dev --no-install-project
COPY . .
# Vite writes into static/, beside the files already tracked there
COPY --from=frontend /src/static/ static/
RUN DJANGO_SETTINGS_MODULE=bbs.settings_prod SECRET_KEY=collectstatic /venv/bin/python manage.py collectstatic --noinput

FROM python:3.14-slim-trixie
RUN apt-get update \
    && apt-get install -y --no-install-recommends libmariadb3 \
    && rm -rf /var/lib/apt/lists/* \
    && useradd --system --uid 932 --home-dir /app --no-create-home bbs \
    && mkdir /data && chown bbs:bbs /data
COPY --from=build /venv /venv
COPY --from=build /app /app
WORKDIR /app
ARG SENTRY_RELEASE=N/A
ENV PATH=/venv/bin:$PATH \
    DJANGO_SETTINGS_MODULE=bbs.settings_prod \
    PYTHONUNBUFFERED=1 \
    SENTRY_RELEASE=$SENTRY_RELEASE
USER bbs
VOLUME /data
EXPOSE 8000
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "--workers", "2", "--no-control-socket", "--access-logfile", "-", "bbs.wsgi"]
