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
from django.core import exceptions
from django import forms

import json
import types

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

class JsonFormField(forms.Field):
    pass

class JsonField(models.Field):
    description = 'JSON data'

    def __init__(self, *args, **kwargs):
        kwargs['blank'] = {}
        if 'default' not in kwargs and not kwargs.get('null'):
            kwargs['default'] = {}
        super(JsonField, self).__init__(*args, **kwargs)

    def db_type(self, connection):
        return 'text'

    def get_internal_type(self):
        return 'JsonField'

    def to_python(self, value):
        try:
            if type(value) == types.UnicodeType:
                return json.loads(value)
            return value
        except ValueError:
            raise exceptions.ValidationError('No JSON')

    def get_prep_value(self, value):
        try:
            if type(value) != types.UnicodeType:
                return json.dumps(value)
            return value
        except ValueError:
            raise exceptions.ValidationError('No JSON')

    def value_to_string(self, obj):
        value = self._get_val_from_obj(obj)
        return self.to_python(value)

    def formfield(self, **kwargs):
        kwargs.update({'form_class': JsonFormField})
        return super(JsonField, self).formfield(**kwargs)

class Animation(models.Model):
    type = models.CharField(max_length=1, choices=(('m', 'MOVIE'),('e', 'EXTERNAL')))
    title = models.CharField(max_length=128)
    description = models.TextField()
    author = models.CharField(max_length=512)
    email = models.CharField(max_length=512)
    creator = models.CharField(max_length=64)
    user = models.ForeignKey(User, null=True, blank=True)
    height = models.IntegerField()
    width = models.IntegerField()
    depth = models.IntegerField()
    channels = models.IntegerField()
    max_duration = models.IntegerField()
    data = JsonField()
    playlists = models.ManyToManyField('Playlist', through='AnimationInstance', blank=True)

    def __unicode__(self):
        return '%s(%i,%i,%i)' % (self.title, self.height, self.width, self.depth)

class AnimationInstance(models.Model):
    playlist = models.ForeignKey('Playlist')
    animation = models.ForeignKey('Animation')
    order = models.IntegerField(default=0)
    playing = models.BooleanField(default=False)

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

