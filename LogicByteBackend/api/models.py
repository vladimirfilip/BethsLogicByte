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
    question_title = models.CharField(max_length = 100)
    question_description = models.TextField()
    question_tags = models.TextField()
    
    def __str__(self):
        return self.question_title


class Solution(models.Model):
    user_profile = models.OneToOneField(UserProfile, on_delete = models.SET_NULL, null = True)
    question = models.ForeignKey(Question, on_delete = models.CASCADE, null = True)
    solution = models.TextField(null = True)
    date_modified = models.DateTimeField(auto_now_add = True)

    def __str__(self):
        return f"[SOL] {self.user_profile}/{self.question}/{self.date_modified.strftime('%Y/%m/%d %H:%M:%S')}"


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
