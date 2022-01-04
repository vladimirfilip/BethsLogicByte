from .models import UserProfile, Solution, Question
from rest_framework import generics, mixins, status
from rest_framework.response import Response
from .serializers import *
from django.contrib.auth.models import User


class UserProfileList(generics.GenericAPIView, mixins.ListModelMixin, mixins.CreateModelMixin):
    #
    # Used for accessing all user profiles and adding one
    #
    queryset = UserProfile.objects.all()
    serializer_class = UserProfileSerializer

    def get(self, request, field_name=None, field_value=None):
        return self.list(request)

    def post(self, request):
        return self.create(request)


class UserProfileByField(generics.GenericAPIView, mixins.RetrieveModelMixin, mixins.UpdateModelMixin,
                         mixins.DestroyModelMixin):
    #
    # Used for accessing, editing or deleting a UserProfileModel based on the value of one of its fields,
    # allowing the client to access user profiles based on class name, year group, username etc.
    #
    queryset = UserProfile.objects.all()
    serializer_class = UserProfileSerializer

    @staticmethod
    def get_user_profile(**kwargs):
        field_name, field_value = tuple(kwargs.values())
        if field_name in ["username"]:
            user = User.objects.filter(**{field_name: field_value}).first()
            field_name, field_value = "user", user
        return UserProfile.objects.filter(**{field_name: field_value})

    def get(self, request, **kwargs):
        user_profile = self.get_user_profile(**kwargs)
        if user_profile.count() <= 1:
            user_profile = user_profile.first()
            serialized_data = self.get_serializer(user_profile).data
        else:
            serialized_data = self.get_serializer(user_profile, many=True).data
        return Response(serialized_data)

    def put(self, request, **kwargs):
        user_profile = self.get_user_profile(**kwargs)
        if user_profile.count() <= 1:
            user_profile = user_profile.first()
            serializer = UserProfileSerializer(user_profile, request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        return Response(data=None, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, **kwargs):
        user_profile = self.get_user_profile(**kwargs)
        if user_profile.count() <= 1:
            user_profile = user_profile.first()
            user_profile.delete()
            return Response(status=status.HTTP_204_NO_CONTENT, data=None)
        return Response(data=None, status=status.HTTP_400_BAD_REQUEST)


class QuestionList(generics.GenericAPIView, mixins.ListModelMixin, mixins.CreateModelMixin):
    # Used to access all questions and adding one
    queryset = Question.objects.all()
    serializer_class = QuestionSerializer

    def get(self, request):
        return self.list(request)

    def post(self, request):
        return self.create(request)


class QuestionDetails(generics.GenericAPIView, mixins.RetrieveModelMixin, mixins.UpdateModelMixin,
                      mixins.DestroyModelMixin):
    queryset = Question.objects.all()
    serializer_class = QuestionSerializer

    @staticmethod
    def get_questions(**kwargs):
        field_name, field_value = tuple(kwargs.values())
        return Question.objects.filter(**{field_name: field_value})

    def get(self, request, **kwargs):
        question = self.get_questions(**kwargs).first()
        serialized_data = self.get_serializer(question).data
        return Response(serialized_data)

    def put(self, request, **kwargs):
        questions = self.get_questions(**kwargs)
        if questions.count() <= 1:
            question = questions.first()
            serializer = QuestionSerializer(question, data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        return Response(data=None, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, **kwargs):
        questions = self.get_questions(**kwargs)
        if questions.count() <= 1:
            question = questions.first()
            question.delete()
            return Response(status=status.HTTP_204_NO_CONTENT, data=None)
        return Response(status=status.HTTP_204_NO_CONTENT)


class SolutionList(generics.GenericAPIView, mixins.ListModelMixin, mixins.CreateModelMixin):
    # Not yet working properly. Shows solutions for all questions rather than the particular question and you can only
    # post to a specific question from the admin page

    queryset = Solution.objects.all()
    serializer_class = SolutionSerializer

    def get(self, request):
        return self.list(request)

    def post(self, request):
        return self.create(request)


class SolutionDetails(generics.GenericAPIView, mixins.RetrieveModelMixin, mixins.UpdateModelMixin,
                      mixins.DestroyModelMixin):
    queryset = Solution.objects.all()
    serializer_class = SolutionSerializer

    @staticmethod
    def get_solutions(**kwargs):
        field_name, field_value = tuple(kwargs.values())
        if field_name == "question_id":
            question = Question.objects.filter(id=field_value).first()
            field_name, field_value = 'question', question
        return Solution.objects.filter(**{field_name: field_value})

    def get(self, request, **kwargs):
        solutions = self.get_solutions(**kwargs)
        if solutions.count() <= 1:
            solution = solutions.first()
            serialized_data = self.get_serializer(solution).data
        else:
            serialized_data = self.get_serializer(solutions, many=True).data
        return Response(serialized_data)

    def put(self, request, **kwargs):
        solution = self.get_solutions(**kwargs)
        if solution.count() <= 1:
            solution = solution.first()
            serializer = SolutionSerializer(solution, request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        return Response(data=None, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, **kwargs):
        solution = self.get_solutions(**kwargs)
        if solution.count() <= 1:
            solution = solution.first()
            solution.delete()
            return Response(status=status.HTTP_204_NO_CONTENT, data=None)
        return Response(data=None, status=status.HTTP_400_BAD_REQUEST)
