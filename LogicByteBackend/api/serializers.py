from rest_framework.serializers import ModelSerializer, PrimaryKeyRelatedField
from .models import UserProfile, Solution, Question, SavedQuestion, AttemptedQuestion


class UserProfileSerializer(ModelSerializer):
    saved_questions = PrimaryKeyRelatedField(many=True, read_only=True)
    attempted_questions = PrimaryKeyRelatedField(many=True, read_only=True)

    class Meta:
        model = UserProfile
        fields = "__all__"


class QuestionSerializer(ModelSerializer):
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
