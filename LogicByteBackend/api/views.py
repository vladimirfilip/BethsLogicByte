from .models import UserProfile, Solution, Question, SavedQuestion, AttemptedQuestion
from rest_framework import generics, mixins, status
from rest_framework.response import Response
from .serializers import UserProfileSerializer, QuestionSerializer, SolutionSerializer, SavedQuestionSerializer, \
    AttemptedQuestionSerializer, UserSerializer
from django.contrib.auth.models import User
from django.http import JsonResponse
from django.contrib.auth.hashers import make_password
import json


def check_password(request):
    password = request.GET.get('password', '')
    username = request.GET.get('username', '')
    user = User.objects.get(username=username)
    if user.check_password(password):
        return JsonResponse({"result": "good"})
    return JsonResponse({"result": "bad"})


class GenericView(generics.GenericAPIView, mixins.CreateModelMixin, mixins.ListModelMixin,
                  mixins.RetrieveModelMixin, mixins.UpdateModelMixin, mixins.DestroyModelMixin):
    def __init__(self, queryset, serializer_class, **kwargs):
        super().__init__(**kwargs)
        self.queryset = queryset
        self.serializer_class = serializer_class

    @staticmethod
    def get_params(request):
        return {key: value[0] for key, value in dict(request.GET).items()}

    def filter(self, request, secondary=None):
        queryset = self.queryset
        params = self.get_params(request)
        if secondary is None:
            secondary = {}
        for key in params.keys():
            if key in secondary.keys():
                primary_params = secondary[key](params[key])
                field_name, field_value = primary_params
                queryset = queryset.filter(**{field_name: field_value})
                continue
            queryset = queryset.filter(**{key: params[key]})
        return queryset

    def get(self, request):
        model_instances = self.filter(request)
        if model_instances.count() < 2:
            status_code = status.HTTP_400_BAD_REQUEST if model_instances.count() == 0 else status.HTTP_200_OK
            serialized_data = self.get_serializer(model_instances.first()).data
            return Response(serialized_data, status_code)
        return Response(self.get_serializer(model_instances, many=True).data, status.HTTP_200_OK)

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def replace_record_with_new_data(self, old_data, new_data):
        for key in new_data.keys():
            data_point = new_data[key]
            if key == 'password':
                data_point = make_password(data_point)
            old_data[key] = data_point

    def put(self, request):
        model_instances = self.filter(request)
        request_data = request.data
        if model_instances.count() > 1:
            return Response(data=None, status=status.HTTP_400_BAD_REQUEST)

        model_instance = model_instances.first()
        record = self.get_serializer(model_instance).data.copy()
        self.replace_record_with_new_data(record, request_data)

        serializer = self.get_serializer(model_instance, record)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        saved_model = serializer.save()

        return Response(self.get_serializer(saved_model).data)

    def delete(self, request):
        model_instances = self.filter(request)
        if model_instances.count() == 1:
            model_instances.first().delete()
            return Response(status=status.HTTP_204_NO_CONTENT, data=None)
        return Response(data=None, status=status.HTTP_400_BAD_REQUEST)


class UserProfileView(GenericView):
    def __init__(self):
        super().__init__(UserProfile.objects.all(), UserProfileSerializer)

    def filter_by_username(self, username) -> tuple:
        user = User.objects.filter(**{"username": username}).first()
        return "user", user

    def filter(self, request, *args):
        return super().filter(request, {'username': self.filter_by_username})


class QuestionView(GenericView):
    def __init__(self):
        super().__init__(Question.objects.all(), QuestionSerializer)

    def get_questions_with_tag_names(self, tag_names: list):
        tag_names = tag_names.lower().split(",")
        queryset = self.queryset
        tag_name = ""
        for tag_name in tag_names:
            queryset = queryset.filter(tag_names__contains=tag_name)
        return 'tag_names__contains', tag_name

    def filter(self, request, *args):
        return super().filter(request, {'tag_names': self.get_questions_with_tag_names})


class SolutionView(GenericView):
    def __init__(self):
        super().__init__(Solution.objects.all(), SolutionSerializer)

    def get_solution_by_question_id(self, question_id):
        question = Question.objects.filter(id=question_id).first()
        return 'question', question

    def filter(self, request, *args):
        return super().filter(request, {'question_id': self.get_solution_by_question_id})  #


class SavedQuestionView(GenericView):
    def __init__(self):
        super().__init__(SavedQuestion.objects.all(), SavedQuestionSerializer)


class AttemptedQuestionView(GenericView):
    def __init__(self):
        super().__init__(AttemptedQuestion.objects.all(), AttemptedQuestionSerializer)


class UserView(GenericView):
    def __init__(self):
        super().__init__(User.objects.all(), UserSerializer)
