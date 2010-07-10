from django.template.loader import render_to_string
from dajaxice.core import dajaxice_functions
from dajax.core import Dajax

def login_widget(request):
    r = render_to_string('login_bar.html', {
        'authed': request.user.is_authenticated(),
        'login': request.user.username,
    })

    dajax = Dajax()
    dajax.assign('#login-widget','innerHTML', r)
    return dajax.json()
dajaxice_functions.register(login_widget)

def load_editor(request):
    r = render_to_string('editor.html')

    dajax = Dajax()
    dajax.assign('#content', 'innerHTML', r)
    dajax.script('init_editor();')
    return dajax.json()
dajaxice_functions.register(load_editor)
