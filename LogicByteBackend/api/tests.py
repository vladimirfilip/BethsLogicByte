from django.test import TestCase
from django.test import Client
from .models import Question
from django.contrib.auth.models import User


class GenericTestSuite(TestCase):
    def setUp(self, *args, **kwargs):
        print(args)
        required_objects, skeleton_data = kwargs['required_objects'], kwargs['skeleton_data']
        kwargs.pop('required_objects')
        kwargs.pop('skeleton_data')
        required_model_type = required_objects[0]
        del required_objects[0]
        for data in required_objects:
            required_model_type.objects.create(**data)
        self.test_client = Client()
        self.skeleton_data = skeleton_data

    def assert_response_and_status(self, response, expected):
        self.assertEqual(response.json(), expected[0])
        self.assertEqual(response.status_code, expected[1])

    def get(self, test_args=None):
        for url, expected_data, expected_status_code in test_args:
            self.assert_response_and_status(self.client.get(url), [expected_data, expected_status_code])

    def post(self, test_args=None):
        for url, input_data, expected_data, expected_status_code in test_args:
            self.assert_response_and_status(self.client.post(url, input_data), [expected_data, expected_status_code])

    def put(self, test_args=None):
        for url, input_data, expected_data, expected_status_code in test_args:
            self.assert_response_and_status(self.client.put(url,
                                                            data=input_data,
                                                            content_type="application/json"),
                                            [expected_data, expected_status_code])

    def delete(self, test_args=None):
        for url, expected_data, expected_status_code in test_args:
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
        response = self.test_client.post("/api_questions/", input_data)
        self.assertEqual(response.json(), expected_data)
        self.assertEqual(response.status_code, 201)

    def put(self, **kwargs):
        updated_question_data = {
            "id": 2,
            "question_title": "This is an updated posted maths question",
            "question_description": "This is a posted maths question description",
            "tag_names": "maths"
        }
        response = self.test_client.put("/api_questions/id=2",
                                        data=updated_question_data,
                                        content_type="application/json")
        self.assertEqual(response.json(), updated_question_data)
        self.assertEqual(response.status_code, 200)

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
        response = self.test_client.put("/api_questions/id=2",
                                        data=updated_question_data,
                                        content_type="application/json")
        self.assertEqual(response.json(), expected_data)
        self.assertEqual(response.status_code, 400)

    def delete(self, **kwargs):
        response = self.test_client.delete("/api_questions/tag_names=maths")
        self.assertEqual(response.status_code, 204)
        response = self.test_client.get("/api_questions/id=2")
        self.assertEqual(response.json(), self.skeleton_data)
        self.assertEqual(response.status_code, 400)

    def test(self):
        self.post()
        self.get()
        self.put()
        self.delete()


class UserProfileTestSuite(TestCase):
    def setUp(self):
        self.user1 = User.objects.create(username="user1")
        self.user2 = User.objects.create(username="user2")
        self.test_client = Client()
        self.skeleton_data = {
            "num_points": None,
            "year_group": "",
            "class_name": "",
            "email_address": "",
            "user": None
        }

    def post(self):
        input_data = {
            "user": 1,
            "num_points": 1,
            "year_group": "10",
            "class_name": "MathsClass",
            "email_address": "this.is.a.valid.email.address@gmail.com"
        }
        expected_data = dict(input_data, **{"id": 1, "saved_questions": []})
        response = self.test_client.post("/api_profiles/", input_data)
        self.assertEqual(response.json(), expected_data)
        self.assertEqual(response.status_code, 201)
        input_data['email_address'] = "this_is_not_a_valid_email"
        expected_output = {
            "email_address": [
                "Enter a valid email address."
            ],
            "user": [
                "This field must be unique."
            ]
        }
        response = self.test_client.post("/api_profiles/", input_data)
        self.assertEqual(response.json(), expected_output)
        self.assertEqual(response.status_code, 400)

    def get(self):
        expected_data = {
            "id": 1,
            "saved_questions": [],
            "user": 1,
            "num_points": 1,
            "year_group": "10",
            "class_name": "MathsClass",
            "email_address": "this.is.a.valid.email.address@gmail.com"
        }
        response = self.client.get("/api_profiles/username=user1")
        self.assertEqual(response.json(), expected_data)
        self.assertEqual(response.status_code, 200)
        response = self.client.get("/api_profiles/id=1")
        self.assertEqual(response.json(), expected_data)
        self.assertEqual(response.status_code, 200)
        response = self.client.get("/api_profiles/username=user2")
        self.assertEqual(response.json(), self.skeleton_data)
        self.assertEqual(response.status_code, 400)

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
        response = self.test_client.put("/api_profiles/id=1",
                                        data=updated_data,
                                        content_type="application/json")
        self.assertEqual(response.json(), updated_data)
        self.assertEqual(response.status_code, 200)

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
        response = self.test_client.put("/api_profiles/username=user1",
                                        data=updated_data,
                                        content_type="application/json")
        self.assertEqual(response.json(), expected_data)
        self.assertEqual(response.status_code, 400)

    def delete(self):
        response = self.test_client.delete("/api_profiles/username=user1")
        self.assertEqual(response.status_code, 204)
        response = self.test_client.get("/api_profiles/id=1")
        self.assertEqual(response.json(), self.skeleton_data)
        self.assertEqual(response.status_code, 400)

    def test(self):
        self.post()
        self.get()
        self.put()
        self.delete()
