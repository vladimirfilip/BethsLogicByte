from rest_framework.serializers import ModelSerializer, PrimaryKeyRelatedField
from .models import *
from django.contrib.auth.models import User


class UserProfileSerializer(ModelSerializer):
    saved_questions = PrimaryKeyRelatedField(many=True, read_only=True)
    solutions = PrimaryKeyRelatedField(many=True, read_only=True)
    created_questions = PrimaryKeyRelatedField(many=True, read_only=True)

    class Meta:
        model = UserProfile
        fields = "__all__"


class QuestionSerializer(ModelSerializer):
    solutions = PrimaryKeyRelatedField(many=True, read_only=True)
    question_images = PrimaryKeyRelatedField(many=True, read_only=True)

    class Meta:
        model = Question
        fields = "__all__"


class SolutionSerializer(ModelSerializer):
    class Meta:
        model = SolutionAttempt
        fields = "__all__"


class SavedQuestionSerializer(ModelSerializer):
    class Meta:
        model = SavedQuestion
        fields = "__all__"


class UserSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = "__all__"


class ProfilePictureSerializer(ModelSerializer):
    class Meta:
        model = ProfilePicture
        fields = "__all__"


class QuestionImageSerializer(ModelSerializer):
    class Meta:
        model = QuestionImage
        fields = "__all__"


class SolutionImageSerializer(ModelSerializer):
    class Meta:
        model = SolutionImage
        fields = "__all__"
