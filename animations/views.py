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

from django.template import RequestContext, loader
from django.core import serializers
from django.http import HttpResponse
from django.shortcuts import render_to_response
from animations.models import *
from django.views.decorators.csrf import csrf_exempt

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
