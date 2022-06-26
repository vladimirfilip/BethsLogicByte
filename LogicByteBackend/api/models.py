from django.db import models
from django.contrib.auth.models import User

from django.conf import settings
from django.db.models.signals import post_save
from django.dispatch import receiver
from rest_framework.authtoken.models import Token


class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    num_points = models.IntegerField(default=0)
    year_group = models.CharField(max_length=10)
    class_name = models.CharField(max_length=100)
    email_address = models.EmailField(max_length=50, null=True)

    def __str__(self):
        return self.user.username


class Question(models.Model):
    question_title = models.CharField(max_length=100, unique=True)
    question_description = models.TextField()
    tag_names = models.CharField(max_length=150, blank=True)

    def __str__(self):
        return self.question_title


class Solution(models.Model):
    user_profile = models.OneToOneField(UserProfile, on_delete=models.CASCADE)
    question = models.OneToOneField(Question, on_delete=models.CASCADE)
    solution = models.TextField()
    date_modified = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"[SOL] {self.user_profile}/{self.question}/{self.date_modified.strftime('%Y/%m/%d %H:%M:%S')}"


class SavedQuestion(models.Model):
    user_profile = models.ForeignKey(UserProfile, related_name="saved_questions", on_delete=models.CASCADE)
    question = models.OneToOneField(Question, on_delete=models.CASCADE)


class AttemptedQuestion(models.Model):
    user_profile = models.ForeignKey(UserProfile, related_name="attempted_questions", on_delete=models.CASCADE)
    question = models.OneToOneField(Question, on_delete=models.CASCADE)
    num_times_attempted = models.IntegerField(default=1)


@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def create_auth_token(sender, instance=None, created=False, **kwargs):
    if created:
        Token.objects.create(user=instance)
