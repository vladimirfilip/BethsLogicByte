from django.urls import path, include
from .views import *

app_name = "api"

urlpatterns = [
    path("api_profiles/", UserProfileList.as_view()),
    path("api_profiles/<str:field_name>=<str:field_value>", UserProfileByField.as_view()),
    path("api_questions/", QuestionList.as_view()),
    path("api_questions/<int:id>/", QuestionDetails.as_view()),
]