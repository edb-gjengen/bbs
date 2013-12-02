# Installation
    sudo apt-get install libmysqlclient-dev
    sudo apt-get build-dep python-imaging
    virtualenv --distribute venv
    . venv/bin/active
    pip install -r requirements
    python manage.py syncdb
    python manage.py runserver

# TODO
 * Bootstrap v3 cleanups
 * Larger pictures
 * Compact GUI for max 768 vertical pixels
     * Search right of in title
 * Light on dark colors

