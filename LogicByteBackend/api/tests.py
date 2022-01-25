from django.test import TestCase
from django.test import Client
from .models import Question


#
# Each test class will test a single model, simulating CRUD requests to the views class of that model
#
class QuestionTestSuite(TestCase):
    def setUp(self):
        Question.objects.create(question_title="This is a test question",
                                question_description="This is a question description")
        self.client = Client()
        self.skeleton_data = {
            "question_title": '',
            "question_description": '',
            "tag_names": '',
        }

    @staticmethod
    def get_response_info(response):
        return response.json(), response.status_code

    def get(self):
        expected_data = {
            "question_title": "This is a test question",
            "question_description": "This is a question description",
            "tag_names": "",
            "id": 1
        }
        expected_status_code = 200
        response = self.client.get("/api_questions/question_title=This is a test question")
        self.assertEqual(response.json(), expected_data)
        self.assertEqual(response.status_code, expected_status_code)

        expected_data, expected_status_code = self.skeleton_data, 400
        response = self.client.get("/api_questions/question_title= ")
        self.assertEqual(response.json(), expected_data)
        self.assertEqual(response.status_code, expected_status_code)

    def post(self):
        input_data = {
            "question_title": "This is a posted maths question",
            "question_description": "This is a posted maths question description",
            "tag_names": "maths,challenge"
        }
        expected_data = dict(input_data, **{"id": 2})
        response = self.client.post("/api_questions/", input_data)
        self.assertEqual(response.json(), expected_data)
        self.assertEqual(response.status_code, 201)

    def put(self):
        updated_question_data = {
            "id": 2,
            "question_title": "This is an updated posted maths question",
            "question_description": "This is a posted maths question description",
            "tag_names": "maths"
        }
        response = self.client.put("/api_questions/id=2",
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
        response = self.client.put("/api_questions/id=2",
                                   data=updated_question_data,
                                   content_type="application/json")
        self.assertEqual(response.json(), expected_data)
        self.assertEqual(response.status_code, 400)

    def delete(self):
        response = self.client.delete("/api_questions/tag_names=maths")
        self.assertEqual(response.status_code, 204)
        response = self.client.get("/api_questions/id=2")
        self.assertEqual(response.json(), self.skeleton_data)
        self.assertEqual(response.status_code, 400)

    def test(self):
        self.post()
        self.get()
        self.put()
        self.delete()
