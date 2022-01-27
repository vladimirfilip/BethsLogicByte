from django.test import TestCase
from django.test import Client
from .models import Question
from django.contrib.auth.models import User


class GenericTestSuite(TestCase):
    def setUp(self, *args, **kwargs):
        if 'required_objects' in kwargs.keys():
            required_objects, skeleton_data = kwargs.pop('required_objects'), kwargs.pop('skeleton_data')
            required_model_type = required_objects[0]
            del required_objects[0]
            for data in required_objects:
                required_model_type.objects.create(**data)
            self.test_client = Client()
            self.skeleton_data = skeleton_data

    def assert_response_and_status(self, response, expected):
        response_data = response.json() if response.data else None
        self.assertEqual(response_data, expected[0])
        self.assertEqual(response.status_code, expected[1])

    @staticmethod
    def eval_test_args(test_args):
        if not test_args:
            return []
        return test_args

    def get(self, test_args=None):
        for url, expected_data, expected_status_code in self.eval_test_args(test_args):
            self.assert_response_and_status(self.client.get(url), [expected_data, expected_status_code])

    def post(self, test_args=None):
        for url, input_data, expected_data, expected_status_code in self.eval_test_args(test_args):
            self.assert_response_and_status(self.client.post(url,
                                                             data=input_data,
                                                             content_type="application/json"),
                                            [expected_data, expected_status_code])

    def put(self, test_args=None):
        for url, input_data, expected_data, expected_status_code in self.eval_test_args(test_args):
            self.assert_response_and_status(self.client.put(url,
                                                            data=input_data,
                                                            content_type="application/json"),
                                            [expected_data, expected_status_code])

    def delete(self, test_args=None):
        for url, expected_data, expected_status_code in self.eval_test_args(test_args):
            self.assert_response_and_status(self.client.delete(url), [expected_data, expected_status_code])

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
        required_objects = [Question,
                            {'question_title': 'This is a test question',
                             'question_description': 'This is a question description'}]
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
        required_objects = [User, {"username": "user1"}, {"username": "user2"}]
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
            "num_points": 1,
            "year_group": "10",
            "class_name": "MathsClass",
            "email_address": "this.is.a.valid.email.address@gmail.com"
        }
        expected_data = dict(input_data, **{"id": 1, "saved_questions": []})
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
            "user": 1,
            "num_points": 1,
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
