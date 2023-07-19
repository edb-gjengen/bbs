# Getting started

Before starting, make sure you have a working python and nodejs setup with pyenv and nvm.

```bash
apt-get install libmysqlclient-dev
poetry install
poetry shell
pre-commit install
python manage.py migrate
bin/run
cp .env-default .env

# in another terminal
cd frontend
npm install
npm start
```

## References

- We use JS code generation to work with queries/mutations in our graphql API: https://github.com/dotansimha/graphql-typed-document-node

## TODO

- improve product listing (light purple background)
- Stats: products over time
- inventory views
- Stats: Implement users tab


## TODO-old

- Larger pictures
- Compact GUI for max 768 vertical pixels
  - Search right of in title

