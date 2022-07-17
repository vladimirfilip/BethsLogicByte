from django.contrib import admin
from .models import UserProfile, Question, SolutionAttempt, SavedQuestion

# Register your models here.
admin.site.register(UserProfile)
admin.site.register(Question)
admin.site.register(SolutionAttempt)
admin.site.register(SavedQuestion)
