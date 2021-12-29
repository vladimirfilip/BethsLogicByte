from rest_framework.serializers import ModelSerializer, PrimaryKeyRelatedField
from .models import UserProfile


class UserProfileSerializer(ModelSerializer):
    created_questions = PrimaryKeyRelatedField(many=True, read_only=True)
    saved_questions = PrimaryKeyRelatedField(many=True, read_only=True)

    class Meta:
        model = UserProfile
        fields = ['user', 'num_points', 'year_group', 'class_name', 'created_questions', 'saved_questions']
