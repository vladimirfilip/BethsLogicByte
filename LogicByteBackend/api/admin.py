from django.contrib import admin
from .models import UserProfile, Question, Solution

# Register your models here.
admin.site.register(UserProfile)
admin.site.register(Question)
admin.site.register(Solution)