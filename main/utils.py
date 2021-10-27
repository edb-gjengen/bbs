
from django.contrib.auth.models import User
from django.db.models import Q


def format_username(firstname, lastname):
    first = firstname.lower().strip().replace(" ", "")[:6].encode('ascii', 'ignore').decode('utf-8')
    last = lastname.lower().strip().replace(" ", "")[:6].encode('ascii', 'ignore').decode('utf-8')

    return "{0}{1}".format(first, last)


def users_with_perm(perm_name):
    return User.objects.filter(
        Q(is_superuser=True) |
        Q(user_permissions__codename=perm_name) |
        Q(groups__permissions__codename=perm_name)).distinct()


def users_format_js(users):
    users_js = []
    for user in users:
        users_js.append('"' + user.first_name + ' ' + user.last_name[:1] + '"')
    users_js = "[{}]".format(u",".join(users_js))
    return users_js
