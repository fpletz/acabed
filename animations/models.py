from django.db import models
from django.contrib.auth.models import User

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

class AnimationInstance(models.Model):
    playlist = models.ForeignKey('Playlist')
    animation = models.ForeignKey('Animation')
    order = models.IntegerField()
    playing = models.BooleanField()

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

