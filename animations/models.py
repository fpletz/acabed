from django.db import models

class Frame(models.Model):
    duration = models.IntegerField()
    data = models.TextField()

class Animation(models.Model):
    x = models.IntegerField()
    y = models.IntegerField()
    depth = models.IntegerField()
    frames = models.ManyToManyField('Frame')

class Playlist(models.Model):
    animations = models.ManyToManyField('Animation')

class Spool(models.Model):
    playlists = models.ManyToManyField('Playlist')
    added = models.DateTimeField()

