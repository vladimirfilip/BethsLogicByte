from django.db import models
from django.contrib.auth.models import User


#
# If adding any new fields remember to declare it in UserProfileSerializer
#
class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    num_points = models.IntegerField(default=0)
    year_group = models.CharField(max_length=10)
    class_name = models.CharField(max_length=100)

    def __str__(self):
        return self.user.username


class Question(models.Model):
    pass
    #
    # Define Question model here
    #


class Solution(models.Model):
    pass
    #
    # Define Solution model here
    #


#
# These are needed to allow the api to distinguish between created questions and saved questions
# that are stored in the UserProfile model
#
class CreatedQuestion(models.Model):
    creator = models.ForeignKey(UserProfile, related_name="created_questions", on_delete=models.CASCADE)
    question = models.OneToOneField(Question, on_delete=models.CASCADE)


class SavedQuestion(models.Model):
    user = models.ForeignKey(UserProfile, related_name="saved_questions", on_delete=models.CASCADE)
    question = models.OneToOneField(Question, on_delete=models.CASCADE)
