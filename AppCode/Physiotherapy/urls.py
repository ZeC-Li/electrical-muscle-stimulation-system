# coding=utf-8


from B24DMaternityExerciseApp import views
from django.conf.urls import url


urlpatterns = [
    url(r'^index', views.index),
]