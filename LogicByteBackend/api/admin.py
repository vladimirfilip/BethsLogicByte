from django.contrib import admin
from .models import *

# Register your models here.
admin.site.register(UserProfile)
admin.site.register(Question)
admin.site.register(SolutionAttempt)
admin.site.register(SavedQuestion)
admin.site.register(QuestionImage)
admin.site.register(ProfilePicture)
admin.site.register(QuestionInSession)
admin.site.register(UserQuestionSession)
admin.site.register(QuestionFilterResult)
