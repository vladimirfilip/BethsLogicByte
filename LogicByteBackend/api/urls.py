from django.urls import path, include
from .views import *

app_name = "api"

urlpatterns = [
    path("api_profiles/", UserProfileList.as_view()),
    path("api_profiles/<str:field_name>=<str:field_value>", UserProfileByField.as_view()),
    path("api_questions/", QuestionList.as_view()),
    path("api_questions/<int:id>/", QuestionDetails.as_view()),
    path("api_questions/<int:question_id>/solutions/", SolutionList.as_view()),
    path("api_questions/<int:question_id>/solutions/<int:solution_id>/", SolutionDetails.as_view()),
]