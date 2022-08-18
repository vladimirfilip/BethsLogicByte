from django.conf import settings
from django.contrib.auth.models import User
from .models import Question, UserProfile
from rest_framework.authtoken.models import Token
from django.test import Client, TestCase
from rest_framework.test import APIClient, APITestCase


def create_model_instance(model_type, **kwargs):
    return model_type.objects.create(**kwargs)


class TestOperator(TestCase):
    def setUp(self):
        self.client = Client()
        super().setUp()

    def set_token(self, token):
        self.token = token

    def assert_response_and_status(self, response, expected, assert_contains: bool):
        response_data = response.json() if response.data else None
        if not assert_contains:
            self.assertEqual(response_data, expected[0])
        else:
            assert expected[0].items() <= response_data.items()
        self.assertEqual(response.status_code, expected[1])

    @staticmethod
    def eval_test_args(**kwargs):
        url, expected_data, expected_status_code = kwargs.pop('url'), kwargs.pop(
            'expected_data'), kwargs.pop('expected_status_code')
        input_data = kwargs.pop('input_data', {})
        params = kwargs.pop('params', {})
        url = url.rstrip("/") + "/"
        if params:
            url += "?"
        for k, v in params.items():
            url += f"{k}={v}"
        assert_contains = kwargs.pop('assert_contains', False)
        return url, expected_data, expected_status_code, input_data, assert_contains

    def make_request(self, func, **kwargs):
        args = list(self.eval_test_args(**kwargs))
        self.assert_response_and_status(func(args[0],
                                             data=dict(args[3]),
                                             content_type="application/json",
                                             **{"HTTP_AUTHORIZATION": "Token " + self.token.key}),
                                        [args[1], args[2]],
                                        args[4])

    def get(self, **kwargs):
        self.make_request(self.client.get, **kwargs)

    def post(self, **kwargs):
        self.make_request(self.client.post, **kwargs)

    def put(self, **kwargs):
        self.make_request(self.client.put, **kwargs)

    def delete(self, **kwargs):
        self.make_request(self.client.delete, **kwargs)


class GenericTestSuite(TestCase):
    def get(self):
        pass

    def post(self):
        pass

    def put(self):
        pass

    def delete(self):
        pass

    def test(self):
        self.post()
        self.get()
        self.put()
        self.delete()


class QuestionTestSuite(GenericTestSuite):
    def setUp(self):
        user = create_model_instance(User, username="user")
        self.token = Token.objects.get(user=user)
        self.test_operator = TestOperator()
        self.test_operator.client = Client()
        self.test_operator.set_token(self.token)
        question_data = {'question_description': 'This is a question description',
                         'creator': create_model_instance(UserProfile, user=user)}
        create_model_instance(Question, **question_data)
        self.skeleton_data = {
            "question_description": "",
            "tag_names": "",
            "exam_board": "",
            "exam_type": "",
            "difficulty": "",
            "num_points": None,
            "question_type": "",
            "official_solution": "",
            "creator": None,
            "multiple_choices": "",
            "has_images": False,
        }

        super().setUp()

    def get(self):
        expected_data = {
            "question_description": "This is a question description",
            "tag_names": "",
            "id": 1,
            "creator": 1,
            "solutions": [],
            "exam_type": '',
            "num_points": 0,
            "official_solution": '',
            "question_type": '',
            "difficulty": '',
            "exam_board": '',
            "multiple_choices": '',
            "question_images": [],
            "has_images": False,
        }
        self.test_operator.get(url="/api_questions/",
                               params={"id": "1"},
                               expected_data=expected_data,
                               expected_status_code=200)
        self.test_operator.get(url="/api_questions/",
                               params={"question_description": " "},
                               expected_data=self.skeleton_data,
                               expected_status_code=400)

    def post(self):
        input_data = {
            "creator": 1,
            "question_description": "This is a posted maths question description",
            "tag_names": "maths,challenge",
            "difficulty": "t",
            "exam_board": "t",
            "exam_type": "t",
            "num_points": 120,
            "official_solution": "t",
            "question_type": "t",
            "multiple_choices": "",
            "question_images": [],
            "has_images": False,
        }
        expected_data = dict(input_data, **{"id": 2, "solutions": []})
        self.test_operator.post(url="/api_questions/",
                                input_data=input_data,
                                expected_data=expected_data,
                                expected_status_code=201)

    def put(self):
        updated_question_data = {
            "id": 2,
            "question_description": "This is a posted maths question description",
            "tag_names": "maths",
        }
        extra_data = {
            "creator": 1,
            "solutions": [],
            "difficulty": "t",
            "exam_board": "t",
            "exam_type": "t",
            "num_points": 120,
            "official_solution": "t",
            "question_type": "t",
            "multiple_choices": "",
            "question_images": [],
            "has_images": False,
        }
        self.test_operator.put(url="/api_questions/",
                               params={"id": 2},
                               input_data=updated_question_data,
                               expected_data=dict(updated_question_data, **extra_data),
                               expected_status_code=200)
        updated_question_data['question_title'] = ""
        updated_question_data['question_description'] = ""
        updated_question_data['tag_names'] = ""
        expected_data = {
            "question_description": [
                "This field may not be blank."
            ]
        }
        self.test_operator.put(url="/api_questions/",
                               params={"id": 2},
                               input_data=updated_question_data,
                               expected_data=expected_data,
                               expected_status_code=400)

    def delete(self):
        self.test_operator.delete(url="/api_questions/",
                                  params={"tag_names": "maths"},
                                  expected_data=None,
                                  expected_status_code=204)
        self.test_operator.get(url="/api_questions/",
                               params={"id": 2},
                               expected_data=self.skeleton_data,
                               expected_status_code=400)


class UserProfileTestSuite(GenericTestSuite):
    def setUp(self):
        user = create_model_instance(User, username="user1")
        self.token = user.auth_token
        self.test_operator = TestOperator()
        self.test_operator.client = Client()
        self.test_operator.set_token(self.token)
        create_model_instance(User, username='user2')
        self.skeleton_data = {
            "num_points": None,
            "year_group": "",
            "class_name": "",
            "email_address": "",
            "user": None
        }
        super().setUp()

    def post(self):
        input_data = {
            "user": 1,
            "year_group": "10",
            "class_name": "MathsClass",
            "email_address": "this.is.a.valid.email.address@gmail.com",
        }
        expected_data = dict(input_data, **{"id": 1, "solutions": [], "created_questions": [], "saved_questions": [],
                                            "num_points": 0, "question_sessions": []})
        self.test_operator.post(url="/api_profiles/",
                                input_data=input_data,
                                expected_data=expected_data,
                                expected_status_code=201)
        input_data['email_address'] = "this_is_not_a_valid_email"
        expected_output = {
            "email_address": [
                "Enter a valid email address."
            ],
            "user": [
                "This field must be unique."
            ]
        }
        self.test_operator.post(url="/api_profiles/",
                                input_data=input_data,
                                expected_data=expected_output,
                                expected_status_code=400)

    def get(self):
        expected_data = {
            "id": 1,
            "saved_questions": [],
            "created_questions": [],
            "solutions": [],
            "user": 1,
            "num_points": 0,
            "year_group": "10",
            "class_name": "MathsClass",
            "email_address": "this.is.a.valid.email.address@gmail.com",
            "question_sessions": [],
        }
        self.test_operator.get(url="/api_profiles/",
                               params={"username": "user1"},
                               expected_data=expected_data,
                               expected_status_code=200)
        self.test_operator.get(url="/api_profiles/",
                               params={"id": 1},
                               expected_data=expected_data,
                               expected_status_code=200)
        self.test_operator.get(url="/api_profiles/",
                               params={"username": "user2"},
                               expected_data=self.skeleton_data,
                               expected_status_code=400)

    def put(self):
        updated_data = {
            "id": 1,
            "saved_questions": [],
            "user": 1,
            "num_points": 1,
            "year_group": "10",
            "class_name": "EnglishClass",
            "email_address": "this.is.a.valid.email.address@gmail.com"
        }
        self.test_operator.put(url="/api_profiles/",
                               params={"id": 1},
                               input_data=updated_data,
                               expected_data=dict(updated_data,
                                                  **{"created_questions": [],
                                                     "solutions": [],
                                                     "question_sessions": []
                                                     }),
                               expected_status_code=200)
        updated_data['year_group'] = ""
        updated_data['email_address'] = ""
        updated_data['class_name'] = ""
        expected_data = {
            "year_group": [
                "This field may not be blank."
            ],
            "email_address": [
                "This field may not be blank."
            ],
            "class_name": [
                "This field may not be blank."
            ]
        }
        self.test_operator.put(url="/api_profiles/",
                               params={"username": "user1"},
                               input_data=updated_data,
                               expected_data=expected_data,
                               expected_status_code=400)

    def delete(self):
        self.test_operator.delete(url="/api_profiles/",
                                  params={"username": "user1"},
                                  expected_data=None,
                                  expected_status_code=204)
        self.test_operator.get(url="/api_profiles/",
                               params={"id": 1},
                               expected_data=self.skeleton_data,
                               expected_status_code=400)


class SolutionTestSuite(GenericTestSuite):
    def setUp(self):
        user = create_model_instance(User, username='user')
        self.token = user.auth_token
        self.test_operator = TestOperator()
        self.test_operator.client = Client()
        self.test_operator.set_token(self.token)
        user_profile = create_model_instance(UserProfile, user=user)
        question_data = {
            'question_description': 'question_description',
            'creator': user_profile
        }
        create_model_instance(Question, **question_data)
        self.skeleton_data = {
            "creator": None,
            "solution": "",
            "question": None,
            "is_correct": False,
            "session_id": "",
            "question_num": None,
        }
        super().setUp()

    def post(self):
        valid_data = {
            "creator": 1,
            "question": 1,
            "solution": "This is a solution"
        }
        output_from_valid_data = dict(valid_data, **{"id": 1})
        erroneous_data = {
            "creator": "",
            "question": "",
            "solution": ""
        }
        output_from_erroneous_data = {
            "solution": [
                "This field may not be blank."
            ],
            "creator": [
                "This field may not be null."
            ],
            "question": [
                "This field may not be null."
            ]
        }
        self.test_operator.post(url="/api_solutions/",
                                input_data=valid_data,
                                expected_data=output_from_valid_data,
                                expected_status_code=201,
                                assert_contains=True)
        self.test_operator.post(url="/api_solutions/",
                                input_data=erroneous_data,
                                expected_data=output_from_erroneous_data,
                                expected_status_code=400)

    def get(self):
        expected_data = {
            "id": 1,
            "creator": 1,
            "question": 1,
            "solution": "This is a solution"
        }
        self.test_operator.get(url="/api_solutions/",
                               params={"creator": 1},
                               expected_data=expected_data,
                               expected_status_code=200,
                               assert_contains=True)
        self.test_operator.get(url="/api_solutions/",
                               params={"id": 1},
                               expected_data=expected_data,
                               expected_status_code=200,
                               assert_contains=True)
        self.test_operator.get(url="/api_solutions/",
                               params={"creator": 2},
                               expected_data=self.skeleton_data,
                               expected_status_code=400)

    def put(self, **kwargs):
        updated_data = {
            "id": 1,
            "creator": 1,
            "question": 1,
            "solution": "This is an updated solution"
        }
        self.test_operator.put(url="/api_solutions/",
                               params={"id": 1},
                               input_data=updated_data,
                               expected_data=updated_data,
                               expected_status_code=200,
                               assert_contains=True)
        self.test_operator.get(url="/api_solutions/",
                               params={"id": 1},
                               expected_data=updated_data,
                               expected_status_code=200,
                               assert_contains=True)
        updated_data['creator'] = ""
        updated_data['question'] = ""
        updated_data['solution'] = ""
        expected_data = {
            "creator": [
                "This field may not be null."
            ],
            "question": [
                "This field may not be null."
            ],
            "solution": [
                "This field may not be blank."
            ]
        }
        self.test_operator.put(url="/api_solutions/",
                               params={"question": 1},
                               input_data=updated_data,
                               expected_data=expected_data,
                               expected_status_code=400)

    def delete(self):
        self.test_operator.delete(url="/api_solutions/",
                                  params={"id": 1},
                                  expected_data=None,
                                  expected_status_code=204)
        self.test_operator.get(url="/api_solutions/",
                               params={"id": 1},
                               expected_data=self.skeleton_data,
                               expected_status_code=400)


class SavedQuestionTestSuite(GenericTestSuite):
    def setUp(self):
        user = create_model_instance(User, username="user")
        self.token = user.auth_token
        self.test_operator = TestOperator()
        self.test_operator.client = Client()
        self.test_operator.set_token(self.token)
        user_profile = create_model_instance(UserProfile, user=user)
        question_data = {
            'question_description': 'question_description',
            'creator': user_profile
        }
        create_model_instance(Question, **question_data)
        self.skeleton_data = {
            "user_profile": None,
            "question": None,
        }
        super().setUp()

    def post(self):
        valid_data = {
            "user_profile": 1,
            "question": 1
        }
        output_from_valid_data = dict(valid_data, **{"id": 1})
        erroneous_data = {
            "user_profile": "",
            "question": ""
        }
        output_from_erroneous_data = {
            "user_profile": [
                "This field may not be null."
            ],
            "question": [
                "This field may not be null."
            ]
        }
        self.test_operator.post(url="/api_saved_questions/",
                                input_data=valid_data,
                                expected_data=output_from_valid_data,
                                expected_status_code=201)
        self.test_operator.post(url="/api_saved_questions/",
                                input_data=erroneous_data,
                                expected_data=output_from_erroneous_data,
                                expected_status_code=400)

    def get(self):
        expected_data = {
            "id": 1,
            "user_profile": 1,
            "question": 1,
        }
        self.test_operator.get(url="/api_saved_questions/",
                               params={"user_profile": 1},
                               expected_data=expected_data,
                               expected_status_code=200)
        self.test_operator.get(url="/api_saved_questions/",
                               params={"id": 1},
                               expected_data=expected_data,
                               expected_status_code=200)
        self.test_operator.get(url="/api_saved_questions/",
                               params={"user_profile": 2},
                               expected_data=self.skeleton_data,
                               expected_status_code=400)

    def put(self):
        updated_data = {
            "id": 1,
            "user_profile": 1,
            "question": 1,
        }
        self.test_operator.put(url="/api_saved_questions/",
                               params={"id": 1},
                               input_data=updated_data,
                               expected_data=updated_data,
                               expected_status_code=200)
        self.test_operator.get(url="/api_saved_questions/",
                               params={"id": 1},
                               expected_data=updated_data,
                               expected_status_code=200)
        updated_data['user_profile'] = ""
        updated_data['question'] = ""
        expected_data = {
            "user_profile": [
                "This field may not be null."
            ],
            "question": [
                "This field may not be null."
            ],
        }
        self.test_operator.put(url="/api_saved_questions/",
                               params={"question": 1},
                               input_data=updated_data,
                               expected_data=expected_data,
                               expected_status_code=400)

    def delete(self):
        self.test_operator.delete(url="/api_saved_questions/",
                                  params={"id": 1},
                                  expected_data=None,
                                  expected_status_code=204)
        self.test_operator.get(url="/api_saved_questions/",
                                  params={"id": 1},
                                  expected_data=self.skeleton_data,
                                  expected_status_code=400)
