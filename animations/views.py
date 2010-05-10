from django.template import Context, loader
from django.core import serializers
from django.http import HttpResponse
from django.shortcuts import render_to_response
from animations.models import *

def index(request):
    return render_to_response('index.html',
            {'animations': Animation.objects.all()})

def list(request, fmt='json'):
    #if request.is_ajax():
        if fmt == 'xml':
            mimetype = 'application/xml'
        if fmt == 'json':
            mimetype = 'application/javascript'
        data = serializers.serialize(fmt, Animation.objects.all())
        return HttpResponse(data,mimetype)

def detail(request, animation_id):
    try:
        a = Animation.objects.get(pk=animation_id)
    except Animation.DoesNotExist:
        raise Http404

    return render_to_response('detail.html', {'animation': a})
