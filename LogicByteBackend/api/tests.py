from django.test import TestCase
from django.test import Client
from .models import Question, UserProfile
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token


class GenericTestSuite(TestCase):
    def setUp(self, *args, **kwargs):
        if 'required_objects' in kwargs.keys():
            required_objects = kwargs.pop('required_objects')
            required_model_type = required_objects.pop()
            for data in required_objects:
                new_object = required_model_type.objects.create(**data)
                if required_model_type == User:
                    self.token = Token.objects.get(user=new_object).key

        if 'skeleton_data' in kwargs.keys():
            self.skeleton_data = kwargs.pop('skeleton_data')
        self.test_client = Client()

    def assert_response_and_status(self, response, expected, assert_contains: bool):
        response_data = response.json() if response.data else None
        if not assert_contains:
            self.assertEqual(response_data, expected[0])
        else:
            assert expected[0].items() <= response_data.items()
        self.assertEqual(response.status_code, expected[1])

    @staticmethod
    def eval_test_args(test_args):
        if not test_args:
            return []
        return test_args

    @staticmethod
    def add_token(input_data, token):
        if token:
            return input_data + {"Authorization": "Token " + token}
        return input_data

    def get(self, token=None, test_args=None, assert_contains=False):
        for url, expected_data, expected_status_code in self.eval_test_args(test_args):
            self.assert_response_and_status(self.client.get(url,
                                                            data=self.add_token({}, token)),
                                            [expected_data, expected_status_code],
                                            assert_contains)

    def post(self, token=None, test_args=None, assert_contains=False):
        for url, input_data, expected_data, expected_status_code in self.eval_test_args(test_args):
            self.assert_response_and_status(self.client.post(url,
                                                             data=self.add_token(input_data, token),
                                                             content_type="application/json"),
                                            [expected_data, expected_status_code],
                                            assert_contains)

    def put(self, token=None, test_args=None, assert_contains=False):
        for url, input_data, expected_data, expected_status_code in self.eval_test_args(test_args):
            self.assert_response_and_status(self.client.put(url,
                                                            data=self.add_token(input_data, token),
                                                            content_type="application/json"),
                                            [expected_data, expected_status_code],
                                            assert_contains)

    def delete(self, token=None, test_args=None, assert_contains=False):
        for url, expected_data, expected_status_code in self.eval_test_args(test_args):
            self.assert_response_and_status(self.client.delete(url,
                                                               data=self.add_token({}, token)),
                                            [expected_data, expected_status_code],
                                            assert_contains)

    def test(self):
        self.post()
        self.get()
        self.put()
        self.delete()


#
# Each test class will test a single model, simulating CRUD requests to the views class of that model
#
class QuestionTestSuite(GenericTestSuite):
    def setUp(self, *args):
        required_objects = [{'question_title': 'This is a test question',
                             'question_description': 'This is a question description'},
                            Question]
        skeleton_data = {
            "question_title": '',
            "question_description": '',
            "tag_names": ''
        }
        super().setUp(required_objects=required_objects, skeleton_data=skeleton_data)

    def get(self, **kwargs):
        expected_data = {
            "question_title": "This is a test question",
            "question_description": "This is a question description",
            "tag_names": "",
            "id": 1
        }
        super().get([("/api_questions/question_title=This is a test question", expected_data, 200),
                     ("/api_questions/question_title= ", self.skeleton_data, 400)])

    def post(self, **kwargs):
        input_data = {
            "question_title": "This is a posted maths question",
            "question_description": "This is a posted maths question description",
            "tag_names": "maths,challenge"
        }
        expected_data = dict(input_data, **{"id": 2})
        super().post([("/api_questions/", input_data, expected_data, 201)])

    def put(self, **kwargs):
        updated_question_data = {
            "id": 2,
            "question_title": "This is an updated posted maths question",
            "question_description": "This is a posted maths question description",
            "tag_names": "maths"
        }
        super().put([("/api_questions/id=2", updated_question_data, updated_question_data, 200)])
        updated_question_data['question_title'] = ""
        updated_question_data['question_description'] = ""
        updated_question_data['tag_names'] = ""
        expected_data = {
            "question_title": [
                "This field may not be blank."
            ],
            "question_description": [
                "This field may not be blank."
            ]
        }
        super().put([("/api_questions/question_title=This is an updated posted maths question",
                      updated_question_data,
                      expected_data,
                      400)])

    def delete(self, **kwargs):
        super().delete([("/api_questions/tag_names=maths", None, 204)])
        super().get([("/api_questions/id=2", self.skeleton_data, 400)])


class UserProfileTestSuite(GenericTestSuite):
    def setUp(self):
        required_objects = [{"username": "user1"}, {"username": "user2"}, User]
        skeleton_data = {
            "num_points": None,
            "year_group": "",
            "class_name": "",
            "email_address": "",
            "user": None
        }
        super().setUp(required_objects=required_objects, skeleton_data=skeleton_data)

    def post(self, **kwargs):
        input_data = {
            "user": 1,
            "year_group": "10",
            "class_name": "MathsClass",
            "email_address": "this.is.a.valid.email.address@gmail.com"
        }
        expected_data = dict(input_data, **{"id": 1, "saved_questions": [], "attempted_questions": [], "num_points": 0})
        super().post([("/api_profiles/", input_data, expected_data, 201)])
        input_data['email_address'] = "this_is_not_a_valid_email"
        expected_output = {
            "email_address": [
                "Enter a valid email address."
            ],
            "user": [
                "This field must be unique."
            ]
        }
        super().post([("/api_profiles/", input_data, expected_output, 400)])

    def get(self, **kwargs):
        expected_data = {
            "id": 1,
            "saved_questions": [],
            "attempted_questions": [],
            "user": 1,
            "num_points": 0,
            "year_group": "10",
            "class_name": "MathsClass",
            "email_address": "this.is.a.valid.email.address@gmail.com"
        }
        super().get([("/api_profiles/username=user1", expected_data, 200),
                     ("/api_profiles/id=1", expected_data, 200),
                     ("/api_profiles/username=user2", self.skeleton_data, 400)])

    def put(self, **kwargs):
        updated_data = {
            "id": 1,
            "saved_questions": [],
            "attempted_questions": [],
            "user": 1,
            "num_points": 1,
            "year_group": "10",
            "class_name": "EnglishClass",
            "email_address": "this.is.a.valid.email.address@gmail.com"
        }
        super().put([("/api_profiles/id=1", updated_data, updated_data, 200)])
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
        super().put([("/api_profiles/username=user1", updated_data, expected_data, 400)])

    def delete(self, **kwargs):
        super().delete([("/api_profiles/username=user1", None, 204)])
        super().get([("/api_profiles/id=1", self.skeleton_data, 400)])


class SolutionTestSuite(GenericTestSuite):
    def setUp(self):
        user = User.objects.create(username="user")
        UserProfile.objects.create(user=user)
        Question.objects.create(question_title="question", question_description="question_description")
        self.skeleton_data = {
            "user_profile": None,
            "question": None,
            "solution": ""
        }

    def post(self, **kwargs):
        valid_data = {
            "user_profile": 1,
            "question": 1,
            "solution": "This is a solution"
        }
        output_from_valid_data = dict(valid_data, **{"id": 1})
        erroneous_data = {
            "user_profile": "",
            "question": "",
            "solution": ""
        }
        output_from_erroneous_data = {
            "solution": [
                "This field may not be blank."
            ],
            "user_profile": [
                "This field may not be null."
            ],
            "question": [
                "This field may not be null."
            ]
        }
        super().post([("/api_solutions/", valid_data, output_from_valid_data, 201),
                      ("/api_solutions/", erroneous_data, output_from_erroneous_data, 400)],
                     assert_contains=True)

    def get(self, **kwargs):
        expected_data = {
            "id": 1,
            "user_profile": 1,
            "question": 1,
            "solution": "This is a solution"
        }
        super().get([("/api_solutions/user_profile=1", expected_data, 200),
                     ("/api_solutions/id=1", expected_data, 200)],
                    assert_contains=True)
        super().get([("/api_solutions/user_profile=2", self.skeleton_data, 400)])

    def put(self, **kwargs):
        updated_data = {
            "id": 1,
            "user_profile": 1,
            "question": 1,
            "solution": "This is an updated solution"
        }
        super().put([("/api_solutions/id=1", updated_data, updated_data, 200)], assert_contains=True)
        super().get([("/api_solutions/id=1", updated_data, 200)], assert_contains=True)
        updated_data['user_profile'] = ""
        updated_data['question'] = ""
        updated_data['solution'] = ""
        expected_data = {
            "user_profile": [
                "This field may not be null."
            ],
            "question": [
                "This field may not be null."
            ],
            "solution": [
                "This field may not be blank."
            ]
        }
        super().put([("/api_solutions/question=1", updated_data, expected_data, 400)])

    def delete(self, **kwargs):
        super().delete([("/api_solutions/id=1", None, 204)])
        super().get([("/api_solutions/id=1", self.skeleton_data, 400)])

    def test(self):
        self.post()
        self.get()
        self.put()
        self.delete()


class SavedQuestionTestSuite(GenericTestSuite):
    def setUp(self):
        user = User.objects.create(username="user")
        UserProfile.objects.create(user=user)
        Question.objects.create(question_title="question", question_description="question_description")
        self.skeleton_data = {
            "user_profile": None,
            "question": None,
        }

    def post(self, **kwargs):
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
        super().post([("/api_saved_questions/", valid_data, output_from_valid_data, 201),
                      ("/api_saved_questions/", erroneous_data, output_from_erroneous_data, 400)])

    def get(self, **kwargs):
        expected_data = {
            "id": 1,
            "user_profile": 1,
            "question": 1,
        }
        super().get([("/api_saved_questions/user_profile=1", expected_data, 200),
                     ("/api_saved_questions/id=1", expected_data, 200),
                     ("/api_saved_questions/user_profile=2", self.skeleton_data, 400)])

    def put(self, **kwargs):
        updated_data = {
            "id": 1,
            "user_profile": 1,
            "question": 1,
        }
        super().put([("/api_saved_questions/id=1", updated_data, updated_data, 200)])
        super().get([("/api_saved_questions/id=1", updated_data, 200)])
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
        super().put([("/api_saved_questions/question=1", updated_data, expected_data, 400)])

    def delete(self, **kwargs):
        super().delete([("/api_saved_questions/id=1", None, 204)])
        super().get([("/api_saved_questions/id=1", self.skeleton_data, 400)])

    def test(self):
        self.post()
        self.get()
        self.put()
        self.delete()


class AttemptedQuestionTestSuite(GenericTestSuite):
    def setUp(self):
        user = User.objects.create(username="user")
        UserProfile.objects.create(user=user)
        Question.objects.create(question_title="question", question_description="question_description")
        self.skeleton_data = {
            "user_profile": None,
            "question": None,
            "num_times_attempted": None,
        }

    def post(self, **kwargs):
        valid_data = {
            "user_profile": 1,
            "question": 1,
            'num_times_attempted': 1
        }
        output_from_valid_data = dict(valid_data, **{"id": 1})
        erroneous_data = {
            "user_profile": "",
            "question": "",
            'num_times_attempted': 0
        }
        output_from_erroneous_data = {
            "user_profile": [
                "This field may not be null."
            ],
            "question": [
                "This field may not be null."
            ]
        }
        super().post([("/api_attempted_questions/", valid_data, output_from_valid_data, 201),
                      ("/api_attempted_questions/", erroneous_data, output_from_erroneous_data, 400)])

    def get(self, **kwargs):
        expected_data = {
            "id": 1,
            "user_profile": 1,
            "question": 1,
            'num_times_attempted': 1
        }
        super().get([("/api_attempted_questions/user_profile=1", expected_data, 200),
                     ("/api_attempted_questions/id=1", expected_data, 200),
                     ("/api_attempted_questions/user_profile=2", self.skeleton_data, 400)])

    def put(self, **kwargs):
        updated_data = {
            "id": 1,
            "user_profile": 1,
            "question": 1,
            'num_times_attempted': 1
        }
        super().put([("/api_attempted_questions/id=1", updated_data, updated_data, 200)])
        super().get([("/api_attempted_questions/id=1", updated_data, 200)])
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
        super().put([("/api_attempted_questions/question=1", updated_data, expected_data, 400)])

    def delete(self, **kwargs):
        super().delete([("/api_attempted_questions/id=1", None, 204)])
        super().get([("/api_attempted_questions/id=1", self.skeleton_data, 400)])

    def test(self):
        self.post()
        self.get()
        self.put()
        self.delete()
