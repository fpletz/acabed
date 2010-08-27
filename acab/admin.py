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

from models import * 
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
admin.site.register(Pixeldonor)
admin.site.register(CronJob)
