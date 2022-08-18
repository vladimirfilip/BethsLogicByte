import os
from django.db import models
from django.contrib.auth.models import User
from django.conf import settings
from django.db.models.signals import post_save, pre_save, post_delete
from django.dispatch import receiver
from rest_framework.authtoken.models import Token


def user_profile_pic_directory(instance, *args):
    return f"profile_pics/profile_pic_{instance.user_profile.id}.png"


class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    num_points = models.IntegerField(default=0)
    year_group = models.CharField(max_length=10)
    class_name = models.CharField(max_length=100)
    email_address = models.EmailField(max_length=50, null=True)

    def __str__(self):
        return self.user.username


class ProfilePicture(models.Model):
    user_profile = models.OneToOneField(UserProfile, on_delete=models.CASCADE)
    image = models.ImageField(upload_to=user_profile_pic_directory)


def question_img_directory(instance, *args):
    return f"question_images/question_img_{instance.question.id}.png"


class Question(models.Model):
    creator = models.ForeignKey(UserProfile, related_name="created_questions", on_delete=models.CASCADE)
    question_description = models.TextField()
    tag_names = models.CharField(max_length=150, blank=True)
    exam_board = models.CharField(max_length=15, blank=True)
    exam_type = models.CharField(max_length=20, blank=True)
    difficulty = models.CharField(max_length=15)
    num_points = models.IntegerField(default=0)
    question_type = models.CharField(max_length=15, blank=True)
    official_solution = models.TextField(blank=True)
    multiple_choices = models.TextField(blank=True)
    has_images = models.BooleanField(default=False)


class QuestionImage(models.Model):
    question = models.ForeignKey(Question, related_name="question_images", on_delete=models.CASCADE)
    type = models.CharField(max_length=20, blank=True)
    image = models.ImageField(upload_to=question_img_directory)


class QuestionInSession(models.Model):
    user_profile_id = models.IntegerField()
    question_id = models.IntegerField()
    question_description = models.TextField(blank=True)
    solution = models.TextField(blank=True)
    selected_option = models.TextField(blank=True)
    q_image = models.TextField(blank=True)
    img_options = models.BooleanField(default=False)


class SavedQuestion(models.Model):
    user_profile = models.ForeignKey(UserProfile, related_name="saved_questions", on_delete=models.CASCADE)
    question = models.OneToOneField(Question, on_delete=models.CASCADE)


def solution_img_directory(instance, *args):
    return f"solution_images/solution_img_{instance.solution.id}.png"


class SolutionAttempt(models.Model):
    creator = models.ForeignKey(UserProfile, related_name="solutions", on_delete=models.CASCADE)
    question = models.ForeignKey(Question, related_name="solutions", on_delete=models.CASCADE)
    solution = models.TextField()
    date_modified = models.DateTimeField(auto_now_add=True)
    is_correct = models.BooleanField(default=False)
    session_id = models.TextField(null=True)
    question_num = models.IntegerField(null=True)

    def __str__(self):
        return f"[SOL] {self.creator}/{self.question}/{self.date_modified.strftime('%Y/%m/%d %H:%M:%S')}"


class UserQuestionSession(models.Model):
    session_id = models.TextField(null=True)
    user_profile = models.ForeignKey(UserProfile, related_name="question_sessions", on_delete=models.CASCADE)
    score = models.FloatField(null=True)


@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def create_auth_token(sender, instance=None, created=False, **kwargs):
    if created:
        Token.objects.create(user=instance)


def delete_file_on_delete(file):
    if file:
        if os.path.isfile(file.path):
            os.remove(file.path)


def delete_file_on_change(new_file, old_file):
    if not old_file == new_file:
        if os.path.isfile(old_file.path):
            os.remove(old_file.path)


@receiver(post_delete, sender=ProfilePicture)
def delete_profile_pic_on_delete(sender, instance: ProfilePicture, **kwargs):
    delete_file_on_delete(instance.image)


@receiver(pre_save, sender=ProfilePicture)
def delete_profile_pic_on_change(sender, instance: ProfilePicture, **kwargs):
    if not instance.pk:
        return False

    try:
        old_file = ProfilePicture.objects.get(pk=instance.pk).image
    except ProfilePicture.DoesNotExist:
        return False

    new_file = instance.image
    delete_file_on_change(new_file, old_file)


@receiver(post_delete, sender=QuestionImage)
def delete_question_img_on_delete(sender, instance: QuestionImage, **kwargs):
    delete_file_on_delete(instance.image)


@receiver(pre_save, sender=QuestionImage)
def delete_question_img_on_change(sender, instance: QuestionImage, **kwargs):
    if not instance.pk:
        return False

    try:
        old_file = QuestionImage.objects.get(pk=instance.pk).image
    except QuestionImage.DoesNotExist:
        return False

    new_file = instance.image
    delete_file_on_change(new_file, old_file)
