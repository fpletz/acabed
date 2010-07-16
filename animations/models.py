# acabed - webeditor for blinkenlights xml files
# Copyright (C) 2010 Raffael Mancini <raffael.mancini@hcl-club.lu>
#                    Franz Pletz <fpletz@fnordicwalking.de>
#
# This file is part of acabed.
#
# acabed is free software: you can redistribute it and/or modify
# it under the terms of the GNU Affero General Public License as
# published by the Free Software Foundation, either version 3 of the
# License, or (at your option) any later version.
#
# acabed is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU Affero General Public License for more details.
#
# You should have received a copy of the GNU Affero General Public License
# along with this program.  If not, see <http://www.gnu.org/licenses/>.

from django.db import models
from django.contrib.auth.models import User

import json

def get_colors(self, height, width, depth, channels):
    def nsplit(l, i):
        return (l[:i], l[i:])

    colors = []

    i = j = 0
    while self.data != '':
        l,self.data = nsplit(self.data, depth/16*channels)
        colors.append(((i, j), l))
        i += 1
        if i == height:
            j += 1
            height = 0

    return colors

class Animation(models.Model):
    type = models.CharField(max_length=1, choices=(('m', 'MOVIE'),('e', 'EXTERNAL')))
    title = models.CharField(max_length=128)
    description = models.TextField()
    author = models.CharField(max_length=512)
    email = models.CharField(max_length=512)
    creator = models.CharField(max_length=64)
    user = models.ForeignKey(User)
    height = models.IntegerField()
    width = models.IntegerField()
    depth = models.IntegerField()
    channels = models.IntegerField()
    max_duration = models.IntegerField()
    data = models.TextField()
    playlists = models.ManyToManyField('Playlist', through='AnimationInstance')

    def __unicode__(self):
        return '%s(%i,%i,%i)' % (self.title, self.height, self.width, self.depth)

    def get_data(self):
        return json.loads(self.data)

    def set_data(self, data):
        self.data = json.dumps(data)

class AnimationInstance(models.Model):
    playlist = models.ForeignKey('Playlist')
    animation = models.ForeignKey('Animation')
    order = models.IntegerField()
    playing = models.BooleanField()

# This is an alternative, but more complex and currently not used. Change
# views.py and add an decoder in the javerscripts.
class FileReplay(models.Model):
    content = models.TextField()
    code = models.IntegerField()
	
class Playlist(models.Model):
    title = models.CharField(max_length=128)
    animations = models.ManyToManyField(Animation, through=AnimationInstance)
    user = models.ForeignKey(User)

    def __unicode__(self):
        return self.title

class SpoolJob(models.Model):
    playlist = models.ForeignKey('Playlist')
    priority = models.IntegerField()
    added = models.DateTimeField()

    def __unicode__(self):
        return '[' + self.playlist.title + '@' + str(self.priority) + '@' + str(self.added) + ']'

    @staticmethod
    def current():
        try:
            return SpoolJob.objects.order_by('priority', 'added')[0]
        except IndexError:
            return None

