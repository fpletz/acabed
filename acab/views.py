# acabed - webeditor for blinkenlights xml files
# Copyright (C) 2010 Raffael Mancini <raffael.mancini@hclclub.lu>
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

from django.conf import settings
from django.template import RequestContext, loader
from django.core import serializers
from django.http import HttpResponse
from django.shortcuts import render_to_response
from models import *
from forms import *
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import permission_required
from datetime import *

import json

def index(request):
    return render_to_response('index.html',
                              {'animations': Animation.objects.all()},
                              context_instance=RequestContext(request))

def list(request, fmt='json'):
    if request.is_ajax():
        if fmt == 'xml':
            mimetype = 'application/xml'
        if fmt == 'json':
            mimetype = 'application/javascript'
        data = serializers.serialize(fmt, Animation.objects.all())
        return HttpResponse(data,mimetype)

@csrf_exempt
def filereplay(request):
	#response = HttpResponse('', 'text/plain')
	response = HttpResponse('', 'application/javascript')
	#response = HttpResponse('', 'application/json')
	#fileReplay = FileReplay()
	if request.method == 'POST':
		#fileReplay.content = request.FILES['file'].read()
		for chunk in request.FILES['file'].chunks():
			response.write(chunk)
	
	#response.write(serializers.serialize('json', [fileReplay]))
	return response

def detail(request, animation_id):
    try:
        a = Animation.objects.get(pk=animation_id)
    except Animation.DoesNotExist:
        raise Http404

    return render_to_response('detail.html', {'animation': a})

def queue(request, playlist_id, token):
    if token == settings.QUEUE_TOKEN:
        try:
            for p in Playlist.objects.filter(pk=playlist_id):
                SpoolJob.objects.create(
                        playlist=p,
                        priority=0,
                        added=datetime.now(),
                )

                return HttpResponse(
                        "Happy, happy joy joy!\n",
                        mimetype="text/plain",
                )

        except Playlist.DoesNotExist:
            raise Http404
    else:
        raise Http403

def pixel(request, action, pixel):
    if request.method == 'POST' and not request.is_ajax():
        p = Pixeldonor.objects.get(pixel=pixel)
        
        if not request.user == p.donor:
            raise Http403
        else:
            form = PixeldonorForm(request.POST, request.FILES, instance=p)
            
            if form.is_valid():
                form.save()
                return render_to_response('pixel_edit.html', {
                    'pixel': p,
                    'form': form,
                    },
                    context_instance=RequestContext(request)
                )

    if action == 'edit':
        p = Pixeldonor.objects.get(pixel=pixel)
        
        if not request.user == p.donor:
            raise Http403
        else:
            form = PixeldonorForm(instance=p)
            
            return render_to_response('pixel_edit.html', {
                'pixel': p,
                'form': form,
                },
                context_instance=RequestContext(request)
            )
    
    if action == 'list':
        return render_to_response('pixel_list.html', {
            'pixel': Pixeldonor.objects.filter(donor=request.user),
            },
            context_instance=RequestContext(request)
        )
        
    if action == 'show':
        p = Pixeldonor.objects.get(pixel=pixel)
        if p.anon == True:
            if not request.user == p.donor:
                raise Http403
            else:
                return render_to_response('pixel_show.html', {
                    'pixel': p,
                    },
                    context_instance=RequestContext(request)
                )
        else:
            return render_to_response('pixel_show.html', {
                'pixel': p,
                },
                context_instance=RequestContext(request)
            )

def pixeldonor(request, action):
    if action == 'list':
        mimetype = 'application/javascript'
        data = []
        for donor in Pixeldonor.objects.all():
            t = {
                'pixel': donor.pixel,
                'anon': donor.anon,
                'color': donor.color,
            }
            if not donor.anon:
                t.update({
                    'message': donor.message,
                    'url': donor.url,
                    'name': donor.name,
                    'picture': donor.picture
                })
            data.append(t)
        
        return HttpResponse(json.dumps(data),mimetype)

    if action == 'show':
        rows = donor_iter( 4, 24 )
        return render_to_response('pixel_donors.html', {
            'rows': rows,
            },
            context_instance=RequestContext(request)
        )
        
''' printing the pixeldonor matrix the hard way '''
''' props goto irc2samus#django '''
default_data = dict(
    pixel   ='',
    color   ='ccc',
    url     ='',
    name    ='',
    message ='',
    pclass  ='anon',
)

def _get_next_donor( queryset ):
    for donor in queryset:
        yield( donor, ord( donor.pixel[0] ), int( donor.pixel[1:3] ))

def _donor_iter(rows, cols):
    queryset    = Pixeldonor.objects.order_by('pixel')
    donors      = _get_next_donor(queryset)

    try:
        donor, next_row, next_col = donors.next()
    except StopIteration:
        donor, next_row, next_col = None, None, None
    for r in xrange( rows ):
        for c in xrange( cols ):
            if r + ord( 'A' ) == next_row and c + 1 == next_col:
                t = {
                    'pixel': donor.pixel,
                    'anon': donor.anon,
                    'color': donor.color,
                }
                if not donor.anon:
                    t.update({
                        'message': donor.message,
                        'url': donor.url,
                        'name': donor.name,
                        'picture': donor.picture.thumbnail.url( )
                    })
                yield t
                try:
                    donor, next_row, next_col = donors.next()
                except StopIteration:
                    donor, next_row, next_col = None, None, None
            else:
                yield default_data

def donor_iter(rows, cols):
    iterd = _donor_iter(rows, cols)
    for r in xrange(rows):
        yield (iterd.next() for c in xrange(cols))









