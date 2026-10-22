# Getting started

Before starting, make sure you have Python 3.11 or newer and Node.js 20 available.

```bash
uv run manage.py migrate
cp .env-default .env
uv run manage.py seed_demo_data

# Optional: create an admin login
uv run manage.py createsuperuser

# Install frontend packages once
cd frontend && npm install
```

Start the backend and frontend in separate terminals from the project root:

```bash
uv run bin/run
```

```bash
uv run bin/run-frontend
```

Vite prints the frontend URL when it starts (normally <http://localhost:5173/>; if that port is busy, it selects another). Django runs at <http://localhost:3000/>; open the admin directly at <http://localhost:3000/admin/> or through the frontend dev proxy at the printed Vite URL followed by `/admin/`. The GraphQL API is at <http://localhost:3000/graphql/>; the frontend uses Vite's proxy for development API requests.

To test the frontend against a different backend, set `VITE_DEV_API_PROXY` when starting Vite, for example `VITE_DEV_API_PROXY=https://bbs.neuf.no uv run bin/run-frontend`. This affects the development proxy only; use caution with a live backend, since app changes and submissions may modify production data.

To create the admin during data seeding instead, set `BBS_SEED_ADMIN_PASSWORD` for that command; the command only creates a local `admin` superuser if one does not already exist.

## References

- We use JS code generation to work with queries/mutations in our graphql API: <https://github.com/dotansimha/graphql-typed-document-node>

## TODO

- Stats: Implement users tab

## TODO-old

- Larger pictures
- Compact GUI for max 768 vertical pixels
  - Search right of in title
