from django.contrib import admin
from .models import UserProfile, Question

# Register your models here.
admin.site.register(UserProfile)
admin.site.register(Question)
