from django.urls import path
from .views import *
from rest_framework.authtoken.views import ObtainAuthToken


app_name = "api"

url_views = {
    "api_profiles/": UserProfileView.as_view(),
    "api_questions/": QuestionView.as_view(),
    "api_solutions/": SolutionView.as_view(),
    "api_saved_questions/": SavedQuestionView.as_view(),
    "api_attempted_questions/": AttemptedQuestionView.as_view(),
    "api_token_auth/": ObtainAuthToken.as_view(),
    "api_users/": UserView.as_view(),
    "api_check_password/": check_password,
}


urlpatterns = []
for url, view in url_views.items():
    urlpatterns.append(path(url, view))
