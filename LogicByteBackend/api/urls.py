from django.urls import path
from .views import *
from django.conf.urls.static import static
from rest_framework.authtoken.views import ObtainAuthToken


app_name = "api"

url_views = {
    "api_profiles/": UserProfileView.as_view(),
    "api_questions/": QuestionView.as_view(),
    "api_solutions/": SolutionView.as_view(),
    "api_saved_questions/": SavedQuestionView.as_view(),
    "api_token_auth/": ObtainAuthToken.as_view(),
    "api_users/": UserView.as_view(),
    "api_check_password/": check_password,
    "api_get_username/": get_username,
    "api_user_question_session/": UserQuestionSessionView.as_view(),
    "api_question_image/": QuestionImageView.as_view(),
    "api_profile_picture/": ProfilePictureView.as_view(),
    "api_questions_in_session/": QuestionInSessionView.as_view(),
    "api_check_question_completed/": check_if_question_completed,
}


urlpatterns = []
for url, view in url_views.items():
    urlpatterns.append(path(url, view))
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
