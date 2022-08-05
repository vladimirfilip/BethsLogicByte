from rest_framework import generics, mixins, status
from rest_framework.response import Response
from .serializers import *
from django.contrib.auth.models import User
from django.http import JsonResponse
from django.contrib.auth.hashers import make_password


def check_password(request):
    password = request.GET.get('password', '')
    username = request.GET.get('username', '')
    user = User.objects.get(username=username)
    if user.check_password(password):
        return JsonResponse({"result": "good"})
    return JsonResponse({"result": "bad"})


def get_username(request):
    token = request.GET.get('token', '')
    if not token:
        return JsonResponse({"error": "required token missing"})
    user_instance = User.objects.filter(auth_token=token)
    if not user_instance:
        return JsonResponse({"error": "token invalid"})
    user_instance = user_instance.first()
    user_data = UserSerializer(user_instance).data
    return JsonResponse({"username": user_data['username']})


def check_if_question_completed(request):
    username = request.GET.get('username', '')
    if not username:
        return JsonResponse({"error": "username missing from params"})
    question_id = request.GET.get('question_id', '')
    if not question_id:
        return JsonResponse({"error": "question id missing from params"})
    question_in_session = QuestionInSession.objects.filter(username=username, question_id=question_id)
    if not question_in_session:
        return JsonResponse({"data": "false"})
    return JsonResponse({"data": "true"})


class GenericView(generics.GenericAPIView, mixins.CreateModelMixin, mixins.ListModelMixin,
                  mixins.RetrieveModelMixin, mixins.UpdateModelMixin, mixins.DestroyModelMixin):
    def __init__(self, queryset, serializer_class, **kwargs):
        super().__init__(**kwargs)
        self.queryset = queryset
        self.serializer_class = serializer_class

    @staticmethod
    def get_params(request):
        return {key: value[0] for key, value in dict(request.GET).items()}

    @staticmethod
    def get_specific_fields_from_params(request, model_data):
        #
        # Returns all param keys that are also model fields
        #
        param_keys = [key[2:] for key in dict(request.GET).keys() if key[:2] == "s_"]
        model_keys = set(model_data.keys())
        model_keys_in_headers = list(model_keys.intersection(param_keys))
        return model_keys_in_headers

    def filter(self, request, secondary=None):
        queryset = self.queryset
        params = self.get_params(request)
        if secondary is None:
            secondary = {}
        for key in params.keys():
            if key[:2] == "s_":
                continue
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
            specific_fields = self.get_specific_fields_from_params(request, serialized_data)
            if specific_fields:
                serialized_data = {key: serialized_data[key] for key in specific_fields}
        else:
            status_code = status.HTTP_200_OK
            serialized_data = self.get_serializer(model_instances, many=True).data
            specific_fields = self.get_specific_fields_from_params(request, serialized_data[0])
            if specific_fields:
                serialized_data = [{key: fragment[key] for key in specific_fields} for fragment in serialized_data]
        return Response(serialized_data, status_code)

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @staticmethod
    def replace_record_with_new_data(old_data, new_data):
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

    @staticmethod
    def filter_by_username(username) -> tuple:
        user = User.objects.filter(**{"username": username}).first()
        return "user", user

    def filter(self, request, *args):
        return super().filter(request, {'username': self.filter_by_username})


class QuestionView(GenericView):
    def __init__(self):
        super().__init__(Question.objects.all(), QuestionSerializer)

    def get_questions_with_tag_names(self, tag_names: str):
        tag_names = [tag_name.lower() for tag_name in tag_names.split(",")]
        queryset = self.queryset
        tag_name = ""
        for tag_name in tag_names:
            queryset = queryset.filter(tag_names__contains=tag_name)
        return 'tag_names__contains', tag_name

    def filter(self, request, *args):
        return super().filter(request, {'tag_names': self.get_questions_with_tag_names})


class SolutionView(GenericView):
    def __init__(self):
        super().__init__(SolutionAttempt.objects.all(), SolutionSerializer)

    @staticmethod
    def get_solution_by_question_id(question_id):
        question = Question.objects.filter(id=question_id).first()
        return 'question', question

    def filter(self, request, *args):
        return super().filter(request, {'question_id': self.get_solution_by_question_id})  #


class SavedQuestionView(GenericView):
    def __init__(self):
        super().__init__(SavedQuestion.objects.all(), SavedQuestionSerializer)


class UserView(GenericView):
    def __init__(self):
        super().__init__(User.objects.all(), UserSerializer)


class ProfilePictureView(GenericView):
    def __init__(self):
        super().__init__(ProfilePicture.objects.all(), ProfilePictureSerializer)


class QuestionImageView(GenericView):
    def __init__(self):
        super().__init__(QuestionImage.objects.all(), QuestionImageSerializer)


class SolutionImageView(GenericView):
    def __init__(self):
        super().__init__(SolutionImage.objects.all(), SolutionImageSerializer)


class QuestionInSessionView(GenericView):
    def __init__(self):
        super().__init__(QuestionInSession.objects.all(), QuestionInSessionSerializer)
