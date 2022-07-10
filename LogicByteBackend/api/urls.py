from django.urls import path
from .views import *
from rest_framework.authtoken.views import ObtainAuthToken


app_name = "api"

url_views = {"api_profiles/": (UserProfileList, UserProfileDetails),
             "api_questions/": (QuestionList, QuestionDetails),
             "api_solutions/": (SolutionList, SolutionDetails),
             "api_saved_questions/": (SavedQuestionList, SavedQuestionDetails),
             "api_attempted_questions/": (AttemptedQuestionList, AttemptedQuestionDetails),
             "api_token_auth/": (ObtainAuthToken, ObtainAuthToken),
             "api_users/": (UserList, UserDetails)
             }


urlpatterns = []
for url, views in url_views.items():
    list_view, details_view = views
    urlpatterns.append(path(url, list_view.as_view()))
    urlpatterns.append(path(url + "<str:field_name>=<str:field_value>", details_view.as_view()))

