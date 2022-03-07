from django.urls import path
from .views import *

app_name = "api"

"""
url_views = {"api_profiles/": (UserProfileList, UserProfileDetails),
             "api_questions/": (QuestionList, QuestionDetails),
             "api_solutions/": (SolutionList, SolutionDetails),
             "api_saved_questions/": (SavedQuestionList, SavedQuestionDetails),
             "api_attempted_questions/": (AttemptedQuestionList, AttemptedQuestionDetails)}

urlpatterns = []
for url, views in url_views.items():
    list_view, details_view = views
    urlpatterns.append(path(url, list_view.as_view()))
    urlpatterns.append(path(url + "<str:field_name>=<str:field_value>", details_view.as_view()))
"""

urlpatterns = [
    path("api_profiles/", UserProfileList.as_view()),
    path("api_profiles/<str:field_name>=<str:field_value>", UserProfileDetails.as_view()),
    path("api_questions/", QuestionList.as_view()),
    path("api_questions/<str:field_name>=<str:field_value>", QuestionDetails.as_view()),
    path("api_solutions/", SolutionList.as_view()),
    path("api_solutions/<str:field_name>=<str:field_value>", SolutionDetails.as_view()),
    path("api_saved_questions/", SavedQuestionList.as_view()),
    path("api_saved_questions/<str:field_name>=<str:field_value>", SavedQuestionDetails.as_view()),
    path("api_attempted_questions/", AttemptedQuestionList.as_view()),
    path("api_attempted_questions/<str:field_name>=<str:field_value>", AttemptedQuestionDetails.as_view())
]
