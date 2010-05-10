from django.conf.urls.defaults import *

urlpatterns = patterns('animations.views',
    (r'^$', 'index'),
    (r'^animation/list/$', 'list'),
    (r'^animation/(?P<animation_id>\d+)/$', 'detail'),
)
