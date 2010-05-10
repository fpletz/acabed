from django.conf.urls.defaults import *

urlpatterns = patterns('animations.views',
    (r'^$', 'index'),
    (r'^(?P<animation_id>\d+)/$', 'detail'),
)
