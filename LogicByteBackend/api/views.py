from rest_framework import generics, mixins
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser, FileUploadParser
from django.db.models.query import QuerySet
from random import shuffle
from .utility import *

rank_calculation_started = False

PASSWORD_INSECURE_RESPONSE = {"error": "Password sent is not secure"}


class GenericView(generics.GenericAPIView, mixins.CreateModelMixin, mixins.ListModelMixin,
                  mixins.RetrieveModelMixin, mixins.UpdateModelMixin, mixins.DestroyModelMixin):
    parser_classes = [MultiPartParser, FormParser, JSONParser, FileUploadParser]

    def __init__(self, queryset, serializer_class, **kwargs):
        super().__init__(**kwargs)
        self.queryset = queryset
        self.serializer_class = serializer_class

    @staticmethod
    def get_params(request):
        return {key: value[0] for key, value in dict(request.GET).items()}

    def get_specific_fields_from_params(self, request):
        #
        # Returns all param keys with prefix "s_"
        #
        param_keys = [key[2:] for key in dict(request.GET).keys() if key[:2] == "s_"]
        return param_keys

    def filter(self, request, **kwargs):
        queryset = self.queryset
        params = self.get_params(request)
        secondary = kwargs.pop('secondary', {})
        custom_filter = kwargs.pop('custom_filter', {})
        default_custom_filter = {"user": filter_by_user_with_token,
                                 "user_profile": filter_by_user_profile_with_token}
        arguments = kwargs.pop('arguments', {})
        for k, v in default_custom_filter.items():
            custom_filter[k] = v
        final_alterations = []
        for key in params.keys():
            value = params.get(key)
            if key[:2] == "s_":
                continue
            if key in arguments.keys():
                final_alterations.append(key)
                continue
            if secondary.get(key, None):
                primary_params = secondary[key](value)
                field_name, field_value = primary_params
                queryset = queryset.filter(**{field_name: field_value})
                continue
            if custom_filter.get(key, None):
                queryset = custom_filter[key](queryset, value)
                continue
            queryset = queryset.filter(**{key: value})
        for key in final_alterations:
            value = params.get(key)
            queryset = arguments[key](queryset, value)
        return queryset

    @staticmethod
    def replace_tokens_with_ids(request_data):
        if request_data.get("user_profile", None):
            user_profile_token = request_data["user_profile"]
            user_profile = get_user_profile_with_token(user_profile_token)
            request_data['user_profile'] = user_profile.id if user_profile else None
        if request_data.get("user", None):
            user_token = request_data["user"]
            user = get_user_with_token(user_token)
            request_data['user'] = user.id if user else None

    def get(self, request):
        model_instances = self.filter(request)
        if model_instances.count() == 0:
            return Response(data=None, status=status.HTTP_404_NOT_FOUND)
        data = model_instances.first() if model_instances.count() == 1 else model_instances
        many = model_instances.count() > 1
        serialized_data = self.get_serializer(data, many=many).data
        specific_fields = self.get_specific_fields_from_params(request)
        if many:
            specific_fields = list(set(serialized_data[0].keys()).intersection(set(specific_fields)))
        else:
            specific_fields = list(set(serialized_data.keys()).intersection(set(specific_fields)))
        if specific_fields:
            if many:
                serialized_data = [{key: fragment[key] for key in specific_fields} for fragment in serialized_data]
            else:
                serialized_data = {key: serialized_data[key] for key in specific_fields}
        return Response(serialized_data, status=status.HTTP_200_OK)

    @check_client_staff_or_creator
    def post(self, request):
        request_data = request.data
        self.replace_tokens_with_ids(request_data)
        password = request_data.get("password", None)
        if password and not is_password_secure(password):
            return Response(data=PASSWORD_INSECURE_RESPONSE)
        serializer = self.get_serializer(data=request_data)
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

    @check_client_staff_or_creator
    def put(self, request):
        model_instances = self.filter(request)
        request_data = request.data
        self.replace_tokens_with_ids(request_data)
        if model_instances.count() > 1:
            return Response(data=None, status=status.HTTP_400_BAD_REQUEST)
        model_instance = model_instances.first()
        record = self.get_serializer(model_instance).data.copy()
        self.replace_record_with_new_data(record, request_data)
        password = request_data.get("password", None)
        if password and not is_password_secure(password):
            return Response(data=PASSWORD_INSECURE_RESPONSE, status=status.HTTP_400_BAD_REQUEST)
        serializer = self.get_serializer(model_instance, record)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        saved_model = serializer.save()

        return Response(self.get_serializer(saved_model).data)

    @check_client_staff_or_creator
    def delete(self, request):
        model_instances = self.filter(request)
        if model_instances.count() == 1:
            model_instances.first().delete()
        else:
            for model_instance in model_instances:
                model_instance.delete()
        return Response(status=status.HTTP_204_NO_CONTENT, data=None)


class UserProfileView(GenericView):
    def __init__(self):
        global rank_calculation_started
        super().__init__(UserProfile.objects.all(), UserProfileSerializer)
        if not rank_calculation_started:
            rank_calculation_started = True
            start_rank_calculation()

    @staticmethod
    def filter_by_username(username) -> tuple:
        user = User.objects.filter(**{"username": username}).first()
        return "user", user

    def filter(self, request, *args):
        return super().filter(request, secondary={'username': self.filter_by_username})

    @block
    def delete(self, request):
        return


class QuestionView(GenericView):
    def __init__(self):
        super().__init__(Question.objects.all(), QuestionSerializer)

    @staticmethod
    def get_questions_with_tag_names(queryset, tag_names: str):
        queries = [query.split("|") for query in tag_names.split(",")]
        new_queryset = QuerySet(Question)
        for query in queries:
            temp_queryset = Question.objects.none()
            for tag_name in query:
                filtered = queryset.filter(tag_names__contains=tag_name.rstrip("/"))
                temp_queryset = temp_queryset | filtered
            new_queryset = new_queryset & temp_queryset
        return new_queryset

    @staticmethod
    def choose_randomly(queryset, n: int):
        n = int(n)
        ids = [model.id for model in queryset]
        shuffle(ids)
        new_queryset = Question.objects.none()
        for model_id in ids[:n]:
            new_queryset = new_queryset | Question.objects.filter(id=model_id)
        return new_queryset

    def filter(self, request, *args):
        return super().filter(request, custom_filter={'tag_names': self.get_questions_with_tag_names},
                              arguments={'number': self.choose_randomly})


class SolutionView(GenericView):
    def __init__(self):
        super().__init__(SolutionAttempt.objects.all(), SolutionSerializer)

    @staticmethod
    def get_solution_by_question_id(question_id):
        question = Question.objects.filter(id=question_id).first()
        return 'question', question

    def filter(self, request, *args):
        return super().filter(request, secondary={'question_id': self.get_solution_by_question_id})

    @block
    def delete(self, request):
        return


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


class QuestionInSessionView(GenericView):
    def __init__(self):
        super().__init__(QuestionInSession.objects.all(), QuestionInSessionSerializer)


class UserQuestionSessionView(GenericView):
    def __init__(self):
        super().__init__(UserQuestionSession.objects.all(), UserQuestionSessionSerializer)

    @block
    def delete(self, request):
        return


class FilterResultView(GenericView):
    def __init__(self):
        super().__init__(QuestionFilterResult.objects.all(), FilterResultSerializer)
