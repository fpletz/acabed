from django.db import models

class Frame(models.Model):
    nr = models.IntegerField()
    duration = models.IntegerField()
    data = models.TextField()

    def __unicode__(self):
        return '%i(%i): %s' % (self.nr, self.duration, self.data)

class Animation(models.Model):
    name = models.CharField(max_length=128)
    author = models.CharField(max_length=64)
    x = models.IntegerField()
    y = models.IntegerField()
    depth = models.IntegerField()
    frames = models.ManyToManyField('Frame')

    def __unicode__(self):
        return '%s(%i,%i,%i)' % (self.name, self.x, self.y, self.depth)

    def get_frames(self):
        return self.frames.all().order_by('nr')

class Playlist(models.Model):
    name = models.CharField(max_length=128)
    animations = models.ManyToManyField('Animation')

    def __unicode__(self):
        return self.name

class Spool(models.Model):
    playlists = models.ManyToManyField('Playlist')
    added = models.DateTimeField()

