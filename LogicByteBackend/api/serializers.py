from rest_framework.serializers import ModelSerializer, PrimaryKeyRelatedField
from .models import UserProfile, Solution, Question, SavedQuestion


class UserProfileSerializer(ModelSerializer):
    saved_questions = PrimaryKeyRelatedField(many=True, read_only=True)

    class Meta:
        model = UserProfile
        fields = ['id', 'user', 'num_points', 'year_group', 'class_name', 'saved_questions',
                  'email_address']


class QuestionSerializer(ModelSerializer):
    class Meta:
        model = Question
        fields = ['id', 'question_title', 'question_description', 'question_tags']


class SolutionSerializer(ModelSerializer):
    class Meta:
        model = Solution
        fields = ['id', 'user_profile', 'solution', 'date_modified', 'question']


class SavedQuestionSerializer(ModelSerializer):
    class Meta:
        model = SavedQuestion
        fields = ['question', 'user']
