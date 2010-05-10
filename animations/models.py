from django.db import models

class Frame(models.Model):
    nr = models.IntegerField()
    duration = models.IntegerField()
    data = models.TextField()

    def __unicode__(self):
        return 'F<%i>' % (self.nr)

class Animation(models.Model):
    name = models.CharField(max_length=128)
    author = models.CharField(max_length=64)
    x = models.IntegerField()
    y = models.IntegerField()
    depth = models.IntegerField()
    frames = models.ManyToManyField('Frame')

    def __unicode__(self):
        return 'A<%i/%i,%i>' % (self.x, self.y, self.depth)

    def get_frames(self):
        return self.frames.all().order_by('nr')

class Playlist(models.Model):
    animations = models.ManyToManyField('Animation')

    def __unicode__(self):
        return 'P<%s>' % (self.__hash__())

class Spool(models.Model):
    playlists = models.ManyToManyField('Playlist')
    added = models.DateTimeField()

    def __unicode__(self):
        return 'S<%s>' % (self.__hash__())

