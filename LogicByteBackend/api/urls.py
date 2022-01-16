from django.urls import path, include
from .views import *

app_name = "api"

urlpatterns = [
    path("api_profiles/", UserProfileList.as_view()),
    path("api_profiles/<str:field_name>=<str:field_value>", UserProfileDetails.as_view()),
    path("api_questions/", QuestionList.as_view()),
    path("api_questions/<str:field_name>=<str:field_value>", QuestionDetails.as_view()),
    path("api_solutions/", SolutionList.as_view()),
    path("api_solutions/<str:field_name>=<str:field_value>", SolutionDetails.as_view()),
    path("api_saved_questions/", SavedQuestionList.as_view()),
    path("api_saved_questions/<str:field_name>=<str:field_value>", SavedQuestionDetails.as_view())
]
