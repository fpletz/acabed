from django.template.loader import render_to_string
from django.contrib.auth import authenticate
from django.contrib.auth import login as auth_login
from django.contrib.auth import logout as auth_logout
from dajaxice.core import dajaxice_functions as dajaxice
from dajax.core import Dajax

def login_widget(request):
    r = render_to_string('login_bar.html', {
        'authed': request.user.is_authenticated(),
        'login': request.user.username,
    })

    dajax = Dajax()
    dajax.assign('#login-widget','innerHTML', r)
    return dajax.json()
dajaxice.register(login_widget)

def login_form(request):
    r = render_to_string('login_form.html')

    dajax = Dajax()
    dajax.assign('#login-widget', 'innerHTML', r)
    return dajax.json()
dajaxice.register(login_form)

def login(request, username, password):
    dajax = Dajax()

    user = authenticate(username=username, password=password)
    if user is not None:
        if user.is_active:
            auth_login(request, user)
            dajax.script('Dajaxice.animations.login_widget("Dajax.process");')
        else:
            # TODO
            pass
    else:
        # TODO
        dajax.alert('wrooooong');

    return dajax.json()
dajaxice.register(login)

def logout(request):
    auth_logout(request)

    dajax = Dajax()
    dajax.script('Dajaxice.animations.login_widget("Dajax.process");')
    return dajax.json()
dajaxice.register(logout)

def load_editor(request):
    r = render_to_string('editor.html')

    dajax = Dajax()
    dajax.assign('#content', 'innerHTML', r)
    dajax.script('init_editor();')
    return dajax.json()
dajaxice.register(load_editor)

def load_start(request):
    r = render_to_string('start.html')

    dajax = Dajax()
    dajax.assign('#content', 'innerHTML', r)
    dajax.script('init_start();')
    return dajax.json()
dajaxice.register(load_start)

