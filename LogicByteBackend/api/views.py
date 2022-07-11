from .models import UserProfile, Solution, Question, SavedQuestion, AttemptedQuestion
from rest_framework import generics, mixins, status
from rest_framework.response import Response
from .serializers import UserProfileSerializer, QuestionSerializer, SolutionSerializer, SavedQuestionSerializer, \
    AttemptedQuestionSerializer, UserSerializer
from django.contrib.auth.models import User
from django.http import JsonResponse


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
        for key in params.keys():
            if key in secondary:
                primary_params = secondary[key](params[key])
                field_name, field_value = primary_params
                queryset = queryset.filter(**{field_name: field_value})
                continue
            queryset = queryset.filter(**{key: params[key]})
        return queryset

    def get(self, request):
        model_instances = self.filter(request)
        print(model_instances)
        if model_instances.count() < 2:
            status_code = status.HTTP_400_BAD_REQUEST if model_instances.count() == 0 else status.HTTP_200_OK
            serialized_data = self.get_serializer(model_instances.first()).data
            return Response(serialized_data, status_code)
        return Response(self.get_serializer(model_instances, many=True).data, status.HTTP_200_OK)

    def post(self, request):
        return self.create(request)

    def replace_record_with_new_data(self, old_data, new_data):
        for key in new_data.keys():
            old_data[key] = new_data[key]

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
        if 'password' in request_data.keys() and type(saved_model) == User:
            saved_model.set_password(request_data['password'])

        return Response(self.get_serializer(saved_model).data)
        
    def delete(self, request, **kwargs):
        model_instances = self.access(**kwargs)
        if model_instances.count > 1:
            return Response(data=None, status=status.HTTP_400_BAD_REQUEST)
        model_instances.first().delete()
        return Response(status=status.HTTP_204_NO_CONTENT, data=None)


class UserProfileView(GenericView):
    def __init__(self):
        super().__init__(UserProfile.objects.all(), UserProfileSerializer)

    def filter_by_username(queryset, username) -> tuple:
        user = User.objects.filter(**{"username": username}).first()
        return "user", user

    def filter(self, request):
        return super().filter(request, {'username': self.filter_by_username})


class QuestionView(GenericView):
    def __init__(self):
        super().__init__(Question.objects.all(), QuestionSerializer)

    def get_questions_with_tag_names(self, tag_names: list):
        tag_names = tag_names.lower().split(",")
        queryset = self.queryset
        for tag_name in tag_names:
            queryset = queryset.filter(tag_names__contains=tag_name)
        return 'tag_names__contains', tag_name

    def filter(self, request):
        return super().filter(request, {'tag_names': self.get_questions_with_tag_names})


class SolutionView(GenericView):
    def __init__(self):
        super().__init__(Solution.objects.all(), SolutionSerializer)

    def get_solution_by_question_id(self, question_id):
        question = Question.objects.filter(id=question_id).first()
        return 'question', question

    def filter(self, request):
        return super().filter(request, {'question_id': self.get_solution_by_question_id})#


class SavedQuestionView(GenericView):
    def __init__(self):
        super().__init__(SavedQuestion.objects.all(), SavedQuestionSerializer)


class AttemptedQuestionView(GenericView):
    def __init__(self):
        super().__init__(AttemptedQuestion.objects.all(), AttemptedQuestionSerializer)


class UserView(GenericView):
    def __init__(self):
        super().__init__(User.objects.all(), UserSerializer)
