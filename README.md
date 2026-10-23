# Getting started

Before starting, make sure you have [mise](https://mise.jdx.dev) installed. It manages Python, Node, uv and prek.

```bash
mise install
prek install
uv run manage.py migrate
cp .env-default .env
uv run manage.py seed_demo_data

# Optional: create an admin login
uv run manage.py createsuperuser
```

Start the backend and frontend in separate terminals from the project root:

```bash
mise run server
```

```bash
mise run frontend-run
```

Vite prints the frontend URL when it starts (normally <http://localhost:5173/>; if that port is busy, it selects another). Django runs at <http://localhost:3000/>; open the admin directly at <http://localhost:3000/admin/> or through the frontend dev proxy at the printed Vite URL followed by `/admin/`. The GraphQL API is at <http://localhost:3000/graphql/>; the frontend uses Vite's proxy for development API requests.

To test the frontend against a different backend, set `VITE_DEV_API_PROXY` when starting Vite, for example `VITE_DEV_API_PROXY=https://bbs.neuf.no mise run frontend-run`. This affects the development proxy only; use caution with a live backend, since app changes and submissions may modify production data.

For more realistic statistics, `uv run manage.py seed_demo_data --size medium` also generates random users, orders and deposits spread over time (`small`, `medium` or `large`; add `--seed N` for reproducible output). It adds more data on every run.

To create the admin during data seeding instead, set `BBS_SEED_ADMIN_PASSWORD` for that command; the command only creates a local `admin` superuser if one does not already exist.

## Testing

```bash
mise run test
```

## Deployment

Every push to main that passes the tests is built into `git.neuf.no/edb/bbs:<sha>` and deployed to amiga by `.gitea/workflows/deploy.yml`, while the repository variable `DEPLOY_AMIGA` is `true`. The image runs with `bbs.settings_prod`: SQLite and uploads in `/data`, Django under `/api/` and the frontend at the root. The stacks on amiga, one per tenant, are the `bbs` role in [edb-infra](https://git.neuf.no/edb/edb-infra).

## References

- We use JS code generation to work with queries/mutations in our graphql API: <https://github.com/dotansimha/graphql-typed-document-node>

## TODO-old

- Larger pictures
- Compact GUI for max 768 vertical pixels
  - Search right of in title
