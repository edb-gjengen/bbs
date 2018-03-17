import os
from contextlib import contextmanager as _contextmanager
from fabric.api import run, sudo, env, cd, prefix

env.use_ssh_config = True
env.hosts = ['dreamcast.neuf.no']
env.user = 'gitdeploy'


BASE_PATH = '/var/www/neuf.no/'

PROJECTS = {
    'bbs': {
        'path': os.path.join(BASE_PATH, 'bbs'),
        'process_name': 'bbs.neuf.no'
    },
    'fantastene': {
        'path': os.path.join(BASE_PATH, 'bbs_fantastene'),
        'process_name': 'fantastene-bbs.neuf.no'
    },
    'arrut': {
        'path': os.path.join(BASE_PATH, 'bbs_arrut'),
        'process_name': 'arrut-bbs.neuf.no'
    }
}


@_contextmanager
def virtualenv(project):
    activate = 'source {}/venv/bin/activate'.format(project['path'])
    with cd(project['path']), prefix(activate):
        yield


def deploy(project_name='bbs'):
    if project_name not in PROJECTS:
        print("'{}' not in valid projects({})".format(project_name, ', '.join(sorted(PROJECTS.keys()))))
        exit(1)

    project = PROJECTS[project_name]
    with virtualenv(project):
        run('git pull')  # Get source
        run('pip install -r requirements.txt')  # install deps in virtualenv
        run('umask 022; python manage.py collectstatic --noinput')  # Collect static
        run('python manage.py migrate')  # Run DB migrations

    # Reload
    sudo('/usr/bin/supervisorctl pid {process_name} | xargs kill -HUP'.format(process_name=project['process_name']),
         shell=False)
