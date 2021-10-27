xfrom django.contrib.auth.models import User

import difflib
from django.core.management.base import BaseCommand, CommandError
import facebook

from main.models import UserProfile


class Command(BaseCommand):
    """
    - Fetches members of KAK Facebook group
    - Matches names against the local DB
    - Saves the users Facebook picture in his/her user profile.
    """
    KAK_GROUP_ID = '108265352570560'
    graph = None

    def get_kak_members(self):
        members = self.graph.get_connections(id=self.KAK_GROUP_ID, connection_name='members')
        return [(member['name'], member['id']) for member in members['data']]

    def handle(self, *args, **options):
        if len(args) != 1:
            raise CommandError('Missing access token')

        access_token = args[0]
        self.graph = facebook.GraphAPI(access_token=access_token)

        group_members = self.get_kak_members()

        names = []  # to fuzzy search for a name
        name_lookup = {}  # to update the matching UserProfile object
        for u in User.objects.all().order_by('id'):
            fullname = u'{} {}'.format(u.first_name, u.last_name)
            names.append(fullname)
            name_lookup[fullname] = u.id

        for member in group_members:
            match = difflib.get_close_matches(member[0], names, 1)  # max 1 match
            if match:
                u = UserProfile.objects.get(pk=name_lookup[match[0]])
                if str(u.image) is "":
                    u.image = 'https://graph.facebook.com/{0}/picture'.format(member[1])
                    u.save()

