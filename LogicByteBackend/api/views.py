from django.http.response import Http404
from .models import UserProfile, Solution, Question
from rest_framework import generics, mixins, serializers, status
from rest_framework.response import Response
from django.http import JsonResponse
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

    def get_user_profile(self, field_name, field_value):
        kwargs = {field_name: field_value}
        if field_name in ["username"]:
            user = User.objects.filter(**kwargs).first()
            kwargs = {'user': user}
        return UserProfile.objects.filter(**kwargs)

    def get(self, request, field_name, field_value):
        user_profile = self.get_user_profile(field_name, field_value)
        if user_profile.count() <= 1:
            user_profile = user_profile.first()
            serialized_data = self.get_serializer(user_profile).data
        else:
            serialized_data = self.get_serializer(user_profile, many=True).data
        return JsonResponse(serialized_data)

    def put(self, request, field_name, field_value):
        user_profile = self.get_user_profile(field_name, field_value)
        if user_profile.count() <= 1:
            user_profile = user_profile.first()
            serializer = UserProfileSerializer(user_profile, request.data)
            if serializer.is_valid():
                serializer.save()
                return JsonResponse(serializer.data)
            return JsonResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        return JsonResponse(data=None, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, field_name, field_value):
        user_profile = self.get_user_profile(field_name, field_value)
        if user_profile.count() <= 1:
            user_profile = user_profile.first()
            user_profile.delete()
            return JsonResponse(status=status.HTTP_204_NO_CONTENT, data=None)
        return JsonResponse(data=None, status=status.HTTP_400_BAD_REQUEST)

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

    lookup_field = 'id'

    def get_question(self, id):
        try:
            return Question.objects.get(id = id)
        except Question.DoesNotExist:
            raise Http404

    def get(self, request, id):
        question = self.get_question(id)
        serializer = QuestionSerializer(question)
        return Response(serializer.data, status.HTTP_200_OK)

    def put(self, request, id):
        question = self.get_question(id)
        serializer = QuestionSerializer(question, data = request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status = status.HTTP_201_CREATED)
        return Response(serializer.errors, status = status.HTTP_400_BAD_REQUEST)

    def delete(self, request, id):
        question = self.get_object(id)
        question.delete()
        return Response(status = status.HTTP_204_NO_CONTENT)

class SolutionList(generics.GenericAPIView, mixins.ListModelMixin, mixins.CreateModelMixin):
    
    # Not yet working properly. Shows solutions for all questions rather than the particular question and you can only post to a 
    # specific question from the admin page
    
    queryset = Solution.objects.all()
    serializer_class = SolutionSerializer

    def get(self, request, question_id, solution_id = None):
        return self.list(request)

    def post(self, request, question_id, solution_id = None):
        return self.create(request)

    # def get_solution(self, question_id, solution_id):
    #     kwargs = {question_id: solution_id}
    #     return Solution.objects.filter(**kwargs)

    # def get(self, request, question_id, solution_id):
    #     question = self.get_solution(question_id, solution_id)
    #     if user_profile.count() <= 1:
    #         user_profile = user_profile.first()
    #         serialized_data = self.get_serializer(user_profile).data
    #     else:
    #         serialized_data = self.get_serializer(user_profile, many=True).data
    #     return JsonResponse(serialized_data)       

class SolutionDetails(generics.GenericAPIView, mixins.RetrieveModelMixin, mixins.UpdateModelMixin,
                      mixins.DestroyModelMixin):

    queryset = Solution.objects.all()
    serializer_class = SolutionSerializer

    lookup_field = 'id'

    def get_solution(self, question_id, solution_id):
        kwargs = {"question_id": question_id}
        try:
            question_queryset = Solution.objects.all().filter(**kwargs) 
            print(question_queryset)
        except Solution.DoesNotExist:
            raise Http404
        
        # It gets the id of the solution but not how I want it to. Don't know how to do it yet

        try:
            solution_queryset = Solution.objects.get(id = solution_id)
            print(solution_queryset)
            return solution_queryset
        except Solution.DoesNotExist:
            raise Http404

    # Not yet working 

    def get(self, request, question_id, solution_id):
        solution = self.get_solution(question_id, solution_id)
        if solution.count() <= 1:
            solution = solution.first()
            serialized_data = self.get_serializer(solution).data
        else:
            serialized_data = self.get_serializer(solution, many=True).data
        return JsonResponse(serialized_data)

    def put(self, request, question_id, solution_id):
        solution = self.get_solution(question_id, solution_id)
        if solution.count() <= 1:
            solution = solution.first()
            serializer = UserProfileSerializer(solution, request.data)
            if serializer.is_valid():
                serializer.save()
                return JsonResponse(serializer.data)
            return JsonResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        return JsonResponse(data=None, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, question_id, solution_id):
        solution = self.get_user_profile(question_id, solution_id)
        if solution.count() <= 1:
            solution = solution.first()
            solution.delete()
            return JsonResponse(status=status.HTTP_204_NO_CONTENT, data=None)
        return JsonResponse(data=None, status=status.HTTP_400_BAD_REQUEST)                               