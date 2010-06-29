from animations.models import Animation, AnimationInstance, Playlist, SpoolJob
from django.contrib import admin

class AnimationInstanceInline(admin.TabularInline):
    model = AnimationInstance
    extra = 1

class AnimationAdmin(admin.ModelAdmin):
    inlines = (AnimationInstanceInline,)

class PlaylistAdmin(admin.ModelAdmin):
    inlines = (AnimationInstanceInline,)

admin.site.register(Animation, AnimationAdmin)
admin.site.register(Playlist, PlaylistAdmin)
admin.site.register(SpoolJob)

