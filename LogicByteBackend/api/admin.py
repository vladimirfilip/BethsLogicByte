from django.contrib import admin
from .models import UserProfile, Question, SolutionAttempt, SavedQuestion, SolutionImage, QuestionImage, ProfilePicture

# Register your models here.
admin.site.register(UserProfile)
admin.site.register(Question)
admin.site.register(SolutionAttempt)
admin.site.register(SavedQuestion)
admin.site.register(SolutionImage)
admin.site.register(QuestionImage)
admin.site.register(ProfilePicture)
