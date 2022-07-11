from rest_framework.serializers import ModelSerializer, PrimaryKeyRelatedField
from .models import UserProfile, Solution, Question, SavedQuestion, AttemptedQuestion
from django.contrib.auth.models import User


class UserProfileSerializer(ModelSerializer):
    saved_questions = PrimaryKeyRelatedField(many=True, read_only=True)
    attempted_questions = PrimaryKeyRelatedField(many=True, read_only=True)
    solutions = PrimaryKeyRelatedField(many=True, read_only=True)
    created_questions = PrimaryKeyRelatedField(many=True, read_only=True)

    class Meta:
        model = UserProfile
        fields = "__all__"


class QuestionSerializer(ModelSerializer):
    solutions = PrimaryKeyRelatedField(many=True, read_only=True)

    class Meta:
        model = Question
        fields = "__all__"


class SolutionSerializer(ModelSerializer):
    class Meta:
        model = Solution
        fields = "__all__"


class SavedQuestionSerializer(ModelSerializer):
    class Meta:
        model = SavedQuestion
        fields = "__all__"


class AttemptedQuestionSerializer(ModelSerializer):
    class Meta:
        model = AttemptedQuestion
        fields = "__all__"

class UserSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = "__all__"