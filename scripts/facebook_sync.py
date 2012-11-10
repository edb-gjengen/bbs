#!/usr/bin/env python
# coding: utf-8

"""
This script fetches the members of the KAK facebook group, matches names against the local db, and then saves the users facebook-picture in his/her user profile.

REQ:
https://github.com/iplatform/pyFaceGraph
INSTALL:
$ pip install pyfacegraph
"""

import os,sys,difflib
from facegraph import Graph

ACCESS_TOKEN = ''
PATH = '.'
KAK_GROUP_ID = '108265352570560'
if PATH not in sys.path:
    sys.path.append(PATH)

from django.core.management import setup_environ
import settings

setup_environ(settings)

from main.models import *

g = Graph(ACCESS_TOKEN)
members = g[KAK_GROUP_ID]['members']()
group_members = [(member.name,member.id) for member in members.data]
names = [] # to fuzzy search for a name
name_lookup = {} # to update the matching UserProfile object
for u in User.objects.all().order_by('id'):
    fullname = u.first_name + " " + u.last_name
    names.append(fullname)
    name_lookup[fullname] = u.id

for member in group_members:
    match = difflib.get_close_matches(member[0], names, 1) # max 1 match
    if match:
        u = UserProfile.objects.get(pk=name_lookup[match[0]])
        if str(u.image) is "":
            # Note: This is not correct, image is only kind of a textfield
            u.image = 'https://graph.facebook.com/{0}/picture'.format(member[1])
            u.save()

