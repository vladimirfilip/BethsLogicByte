from .models import UserProfile, Solution, Question, SavedQuestion, AttemptedQuestion
from rest_framework import generics, mixins, status
from rest_framework.response import Response
from .serializers import UserProfileSerializer, QuestionSerializer, SolutionSerializer, SavedQuestionSerializer, \
    AttemptedQuestionSerializer, UserSerializer
from django.contrib.auth.models import User


class GenericListView(generics.GenericAPIView, mixins.ListModelMixin, mixins.CreateModelMixin):
    def __init__(self, queryset, serializer_class, **kwargs):
        super().__init__(**kwargs)
        self.queryset = queryset
        self.serializer_class = serializer_class

    def get(self, request):
        return self.list(request)

    def post(self, request):
        return self.create(request)


class GenericDetailsView(generics.GenericAPIView, mixins.RetrieveModelMixin, mixins.UpdateModelMixin,
                         mixins.DestroyModelMixin):
    def __init__(self, queryset, serializer_class, **kwargs):
        super().__init__(**kwargs)
        self.queryset = queryset
        self.serializer_class = serializer_class

    def access(self, **kwargs):
        field_name, field_value = tuple(kwargs.values())
        return self.queryset.filter(**{field_name: field_value})

    def get(self, request, **kwargs):
        model_instances = self.access(**kwargs)
        if model_instances.count() <= 1:
            serialized_data = self.get_serializer(model_instances.first()).data
            if model_instances.count() == 0:
                return Response(serialized_data, 400)
        else:
            serialized_data = self.get_serializer(model_instances, many=True).data
        return Response(serialized_data)

    def put(self, request, **kwargs):
        model_instances = self.access(**kwargs)
        if model_instances.count() <= 1:
            serializer = self.get_serializer(model_instances.first(), request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        return Response(data=None, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, **kwargs):
        model_instances = self.access(**kwargs)
        if model_instances.count() <= 1:
            model_instances.first().delete()
            return Response(status=status.HTTP_204_NO_CONTENT, data=None)
        return Response(data=None, status=status.HTTP_400_BAD_REQUEST)


class UserProfileList(GenericListView):
    def __init__(self):
        super().__init__(UserProfile.objects.all(), UserProfileSerializer)


class UserProfileDetails(GenericDetailsView):
    def __init__(self):
        super().__init__(UserProfile.objects.all(), UserProfileSerializer)

    @staticmethod
    def access(**kwargs):
        field_name, field_value = tuple(kwargs.values())
        if field_name in ["username"]:
            user = User.objects.filter(**{field_name: field_value}).first()
            field_name, field_value = "user", user
        return UserProfile.objects.filter(**{field_name: field_value})


class QuestionList(GenericListView):
    def __init__(self):
        super().__init__(Question.objects.all(), QuestionSerializer)


class QuestionDetails(GenericDetailsView):
    def __init__(self):
        super().__init__(Question.objects.all(), QuestionSerializer)

    def get_questions_with_tag_names(self, tag_names: list):
        queryset = self.queryset
        for tag_name in tag_names:
            queryset = queryset.filter(tag_names__contains=tag_name)
        return queryset

    def access(self, **kwargs):
        field_name, field_value = tuple(kwargs.values())
        if field_name == 'tag_names':
            tag_names = field_value.lower().split(",")
            return self.get_questions_with_tag_names(tag_names)
        else:
            return self.queryset.filter(**{field_name: field_value})


class SolutionList(GenericListView):
    def __init__(self):
        super().__init__(Solution.objects.all(), SolutionSerializer)


class SolutionDetails(GenericDetailsView):
    def __init__(self):
        super().__init__(Solution.objects.all(), SolutionSerializer)

    @staticmethod
    def access(**kwargs):
        field_name, field_value = tuple(kwargs.values())
        if field_name == "question_id":
            question = Question.objects.filter(id=field_value).first()
            field_name, field_value = 'question', question
        return Solution.objects.filter(**{field_name: field_value})


class SavedQuestionList(GenericListView):
    def __init__(self):
        super().__init__(SavedQuestion.objects.all(), SavedQuestionSerializer)


class SavedQuestionDetails(GenericDetailsView):
    def __init__(self):
        super().__init__(SavedQuestion.objects.all(), SavedQuestionSerializer)


class AttemptedQuestionList(GenericListView):
    def __init__(self):
        super().__init__(AttemptedQuestion.objects.all(), AttemptedQuestionSerializer)


class AttemptedQuestionDetails(GenericDetailsView):
    def __init__(self):
        super().__init__(AttemptedQuestion.objects.all(), AttemptedQuestionSerializer)


class UserList(GenericListView):
    def __init__(self):
        super().__init__(User.objects.all(), UserSerializer)


class UserDetails(GenericDetailsView):
    def __init__(self):
        super().__init__(User.objects.all(), UserSerializer)