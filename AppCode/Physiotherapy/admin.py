# from django.contrib import admin
import xadmin

# Register your models here.
from B24DMaternityExerciseApp.models import *
xadmin.site.register(YC_UserOptDay)
xadmin.site.register(YC_UserOpt)
xadmin.site.register(YC_DataList)