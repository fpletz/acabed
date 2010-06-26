from django.db import models

class Frame(models.Model):
    nr = models.IntegerField()
    duration = models.IntegerField()
    data = models.TextField()

    def __unicode__(self):
        return '%i(%i): %s' % (self.nr, self.duration, self.data)

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
    title = models.CharField(max_length=128)
    description = models.TextField()
    author = models.CharField(max_length=64)
    height = models.IntegerField()
    width = models.IntegerField()
    depth = models.IntegerField()
    channels = models.IntegerField()
    frames = models.ManyToManyField('Frame')

    def __unicode__(self):
        return '%s(%i,%i,%i)' % (self.name, self.height, self.width, self.depth)

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

