from rest_framework.serializers import ModelSerializer, PrimaryKeyRelatedField, ImageField
from .models import *
from django.contrib.auth.models import User
import os


class Base64ImageField(ImageField):
    """
    A Django REST framework field for handling image-uploads through raw post data.
    It uses base64 for encoding and decoding the contents of the file.

    Heavily based on
    https://github.com/tomchristie/django-rest-framework/pull/1268

    Updated for Django REST framework 3.
    """

    def to_internal_value(self, data):
        from django.core.files.base import ContentFile
        from urllib.parse import urlparse
        import base64
        import six
        import uuid

        # Check if this is a base64 string
        if isinstance(data, six.string_types):
            print(data)
            # Check if the base64 string is in the "data:" format
            if 'data:' in data and ';base64,' in data:
                # Break out the header from the base64 content
                header, data = data.split(';base64,')

            # Try to decode the file. Return validation error if it fails.
            try:
                decoded_file = base64.b64decode(data)
            except TypeError:
                print("INVALID IMAGE")
                self.fail('invalid_image')

            # Generate file name:
            file_name = str(uuid.uuid4())[:12] # 12 characters are more than enough.
            # Get the file name extension:
            file_extension = self.get_file_extension(file_name, decoded_file)

            complete_file_name = "%s.%s" % (file_name, file_extension )

            data = ContentFile(decoded_file, name=complete_file_name)

        return super(Base64ImageField, self).to_internal_value(data)

    def get_file_extension(self, file_name, decoded_file):
        import imghdr

        extension = imghdr.what(file_name, decoded_file)
        extension = "jpg" if extension == "jpeg" else extension

        return extension


class UserProfileSerializer(ModelSerializer):
    saved_questions = PrimaryKeyRelatedField(many=True, read_only=True)
    created_questions = PrimaryKeyRelatedField(many=True, read_only=True)
    question_sessions = PrimaryKeyRelatedField(many=True, read_only=True)

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
    image = Base64ImageField(required=True, use_url=True, max_length=None)

    class Meta:
        model = ProfilePicture
        fields = "__all__"


class QuestionImageSerializer(ModelSerializer):
    class Meta:
        model = QuestionImage
        fields = "__all__"


class QuestionInSessionSerializer(ModelSerializer):
    class Meta:
        model = QuestionInSession
        fields = "__all__"


class UserQuestionSessionSerializer(ModelSerializer):
    class Meta:
        model = UserQuestionSession
        fields = "__all__"


class FilterResultSerializer(ModelSerializer):
    class Meta:
        model = QuestionFilterResult
        fields = "__all__"
