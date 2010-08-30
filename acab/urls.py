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

from django.conf.urls.defaults import *

urlpatterns = patterns('acab.views',
    (r'^$', 'index'),
    (r'^filereplay/$', 'filereplay'),
    (r'^animation/list/$', 'list'),
    (r'^animation/(?P<animation_id>\d+)/$', 'detail'),
    (r'^pixel/list', 'pixel', {'action':'list', 'pixel':''}),
    (r'^pixel/(?P<pixel>.+)/(?P<action>(edit|show|list))$', 'pixel'),    
    (r'^pixeldonor/list', 'pixeldonor', {'action':'list'}),
    (r'^queue/(?P<playlist_id>\d+)/(?P<token>.+)$', 'queue'),
)