from threading import Thread
import threading
from time import time, sleep
from django.http import JsonResponse
from rest_framework.response import Response
from rest_framework import status
from .serializers import *

rank_calculation_delay = 10
UNAUTHORIZED_RESPONSE = Response(data=None, status=status.HTTP_401_UNAUTHORIZED)


def is_password_secure(password: str):
    #
    # Password is only secure if the password length is at least 8,
    # it contains at least one uppercase letter, one number and one symbol
    #
    conditions = [
        len(password) >= 8,
        len([char for char in password if char.isupper()]) >= 1,
        len([char for char in password if char.isdigit()]) >= 1,
        len([char for char in password if not char.isalnum()]) >= 1
    ]
    return conditions == [True] * len(conditions)


def start_rank_calculation():
    thread = Thread(target=calculate_ranks)
    thread.start()


def calculate_ranks():
    print("STARTED RANK CALCULATION LOOP")
    main_thread = threading.enumerate()[0]
    start_time = None
    while main_thread.is_alive():
        sleep(1)
        if start_time and time() - start_time < rank_calculation_delay:
            continue
        start_time = time()
        print("STARTED RANK CALCULATION AT {}".format(time()))
        id_to_points = {}
        for model in UserProfile.objects.all():
            id_to_points[model.id] = model.num_points
        point_order = sorted(id_to_points.keys(), key=lambda k: id_to_points[k], reverse=True)
        for i in range(1, len(point_order) + 1):
            UserProfile.objects.filter(id=point_order[i - 1]).update(rank=i)


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
    token = request.GET.get('user_profile', '')
    user_profile = get_user_profile_with_token(token)
    if not user_profile:
        return JsonResponse({"error": "user profile token is missing or invalid"})
    question_id = request.GET.get('question_id', '')
    if not question_id:
        return JsonResponse({"error": "question id missing from params"})
    question_in_session = QuestionInSession.objects.filter(user_profile=user_profile, question_id=question_id)
    if not question_in_session:
        return JsonResponse({"data": "false"})
    return JsonResponse({"data": "true"})


def get_user_with_token(token):
    valid_token = Token.objects.filter(key=token).first()
    return valid_token.user if valid_token else None


def get_user_profile_with_token(token):
    user = get_user_with_token(token)
    return UserProfile.objects.filter(user=user).first() if user else None


def filter_by_user_with_token(queryset, token):
    user = get_user_with_token(token)
    return queryset.filter(user=user) if user else UserProfile.objects.none()


def filter_by_user_profile_with_token(queryset, token):
    user_profile = get_user_profile_with_token(token)
    return queryset.filter(user_profile=user_profile) if user_profile else UserProfile.objects.none()


def filter_by_multiple_ids(queryset, value):
    ids: list[str] = value.split(",")
    model = queryset.model
    new_queryset = model.objects.none()
    for id in ids:
        new_queryset |= model.objects.filter(id=id)
    return queryset & new_queryset


def check_client_staff_or_creator(func):
    def wrapper(view, request):
        user = get_user_with_token(request.auth.key)
        user_profile = get_user_profile_with_token(request.auth.key)
        if not user:
            return UNAUTHORIZED_RESPONSE
        if not user_profile:
            return UNAUTHORIZED_RESPONSE
        if user.is_staff:
            return func(view, request)
        user_referenced = None
        user_profile_referenced = None
        user_profile_referenced_by_id = None
        if request.method != "POST":
            model_instances = view.filter(request)
            for model_instance in model_instances:
                fields = model_instance.__dict__
                if fields.get('user_profile', None):
                    user_profile_referenced = get_user_profile_with_token(fields['user_profile'])
                if fields.get('user', None):
                    user_referenced = get_user_with_token(fields['user'])
                if fields.get('user_profile_id', None):
                    user_profile_referenced_by_id = UserProfile.objects.get(id=fields['user_profile_id'])
                all_user_profiles = [p for p in [user_profile, user_profile_referenced_by_id, user_profile_referenced]
                                     if p]
                if len(set(all_user_profiles)) != 1:
                    return UNAUTHORIZED_RESPONSE
                all_users = [u for u in [user, user_referenced] if u]
                if len(set(all_users)) != 1:
                    return UNAUTHORIZED_RESPONSE
                conditions = [
                    user == model_instance,
                    user_profile == model_instance,
                    user_profile == user_profile_referenced,
                    user == user_referenced,
                    user_profile == user_profile_referenced_by_id,
                ]
                if True not in conditions:
                    return UNAUTHORIZED_RESPONSE
        else:
            fields = request.data
            if fields.get('user_profile', None):
                user_profile_referenced = get_user_profile_with_token(fields['user_profile'])
            if fields.get('user', None):
                user_referenced = get_user_with_token(fields['user'])
            if fields.get('user_profile_id', None):
                user_profile_referenced_by_id = UserProfile.objects.get(id=fields['user_profile_id'])
            conditions = [
                user_profile == user_profile_referenced,
                user == user_referenced,
                user_profile == user_profile_referenced_by_id,
            ]
            all_user_profiles = [p for p in [user_profile, user_profile_referenced_by_id, user_profile_referenced]
                                 if p]
            if len(set(all_user_profiles)) != 1:
                return UNAUTHORIZED_RESPONSE
            all_users = [u for u in [user, user_referenced] if u]
            if len(set(all_users)) != 1:
                return UNAUTHORIZED_RESPONSE
            if True not in conditions:
                return UNAUTHORIZED_RESPONSE
        return func(view, request)

    return wrapper


def block(func):
    def wrapper(*args):
        return UNAUTHORIZED_RESPONSE

    return wrapper
