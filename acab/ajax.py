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

from django.template.loader import render_to_string
from django.contrib.auth import authenticate
from django.contrib.auth import login as auth_login
from django.contrib.auth import logout as auth_logout
from dajaxice.core import dajaxice_functions as dajaxice
from dajax.core import Dajax
from django.core import serializers

import json

from models import Playlist, User, AnimationInstance, Animation, Pixeldonor
from forms import AnimationForm
import views

def dajaxicyfy(func):
    dajaxice.register(func)
    return func

@dajaxicyfy
def login_widget(request):
    pixel = False
    if request.user.is_authenticated() and \
            request.user.has_perm('acab.edit_pixel') and \
            len(Pixeldonor.objects.filter(donor=request.user)) > 0:
        pixel = True

    r = render_to_string('login_bar.html', {
        'authed': request.user.is_authenticated(),
        'login': request.user.username,
        'pixel': pixel,
    })

    dajax = Dajax()
    dajax.assign('#login-widget','innerHTML', r)
    return dajax.json()

@dajaxicyfy
def login_form(request):
    r = render_to_string('login_form.html')

    dajax = Dajax()
    dajax.assign('#login-widget', 'innerHTML', r)
    return dajax.json()

@dajaxicyfy
def login(request, username, password):
    dajax = Dajax()

    user = authenticate(username=username, password=password)
    if user is not None:
        if user.is_active:
            auth_login(request, user)
            dajax.script('Dajaxice.acab.login_widget("Dajax.process");')
        else:
            dajax.script('MessageWidget.msg("Dein Benutzeraccount wurde deaktiviert! Bitte wende dich an unser Team (pixel@muc.ccc.de)!")')
    else:
        dajax.script('MessageWidget.msg("Falsche Benutzername/Passwort-Kombination! Bitte erneut versuchen!")')

    return dajax.json()

@dajaxicyfy
def logout(request):
    auth_logout(request)

    dajax = Dajax()
    dajax.script('Dajaxice.acab.login_widget("Dajax.process");')
    return dajax.json()

@dajaxicyfy
def load_editor(request, pk=None):
    r = render_to_string('editor.html')

    dajax = Dajax()
    dajax.assign('#content', 'innerHTML', r)

    if pk is not None:
        a = Animation.objects.get(pk=pk)
        a.email = ''
        a.author = ''
        dajax.add_data(serializers.serialize('json', [a]), 'init_editor')
    else:
        dajax.script('init_editor();')

    return dajax.json()

def load_start(request):
    r = render_to_string('start.html')

    dajax = Dajax()
    dajax.assign('#content', 'innerHTML', r)
    dajax.script('init_start();')
    return dajax.json()

@dajaxicyfy
def list(request):
    animations = Animation.objects.filter(type='m').order_by('title')

    return json.dumps([
        {
            'pk': a.pk,
            'title': a.title,
            'author': a.author,
            'max_duration': a.max_duration,
        }
        for a in animations
    ])

@dajaxicyfy
def add(request, animation):
    dajax = Dajax()

    animation = json.loads(animation)
    animation.update({
        'type': 'm',
        'user': request.user is None and '' or request.user.id,
    })

    if int(animation['max_duration']) > 60:
        animation['max_duration'] = 60

    movie_duration = 0
    for frame in animation['data']:
        frame['duration'] = int(frame['duration'])
        if frame['duration'] > 2000:
            frame['duration'] = 2000
        movie_duration += frame['duration']

    if movie_duration > 60000:
        dajax.script('MessageWidget.msg("Animation darf insgesamt nicht laenger als 60 Sekunden sein! Bitte Frames loeschen oder kuerzer anzeigen lassen!")')
        return dajax.json()
    
    form = AnimationForm(animation)

    if form.is_valid():
        a = form.save()

        p = Playlist(
            title = 'stub \'%s\' playlist' % form.cleaned_data['title'],
            user = User.objects.all()[0]
        )
        p.save()
        
        ai = AnimationInstance(
            playlist = p,
            animation = a
        )
        ai.save()
        dajax.script('MessageWidget.msg("Great success! Animootion gespeichert!")')
    else:
        dajax.remove_css_class('#movie-inspector label', 'error')
        for error in form.errors:
            dajax.add_css_class('#movie-inspector label[for="%s"]' % error, 'error')
        dajax.script('MessageWidget.msg("Bitte fehlende Felder ausfuellen.")')

    return dajax.json()

@dajaxicyfy
def pixel_list(request):
    dajax = Dajax()

    r = views.pixel(request, 'list', None)
    dajax.assign('#content', 'innerHTML', r)
    return dajax.json()

@dajaxicyfy
def pixel_show(request, pixel):
    dajax = Dajax()

    r = views.pixel(request, 'show', pixel)
    dajax.assign('#content', 'innerHTML', r)
    return dajax.json()
