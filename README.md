# Getting started

Before starting, make sure you have a working python and nodejs setup with pyenv and nvm.

```bash
apt-get install libmysqlclient-dev
poetry install
poetry shell
pre-commit install
python manage.py migrate
bin/run

# in another terminal
cd frontend
npm install
npm start
```

## References

- We use JS code generation to work with queries/mutations in our graphql API: https://github.com/dotansimha/graphql-typed-document-node

## TODO

- update emails
- Stats: products over time
- Light on dark colors
- inventory views


## TODO-old

- Larger pictures
- Compact GUI for max 768 vertical pixels
  - Search right of in title

