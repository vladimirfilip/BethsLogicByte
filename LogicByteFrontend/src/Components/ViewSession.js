import React, { useContext, useEffect, useState } from "react";
import { UsernameContext } from "../router";
import axios from "axios";
import { getAuthInfo } from "../helpers/authHelper";
import MathJaxRender from "../helpers/mathJaxRender";
import PropTypes from "prop-types";
import ViewQInSession from "./ViewQInSession";

function ViewSession(props) {
  const username = useContext(UsernameContext);
  const sessionId = props.sessionId;
  const [questionDisplays, setQuestionDisplays] = useState([]);

  const getQDescription = async (q_id) => {
    try {
      const res = await axios.get(`http://127.0.0.1:8000/api_questions/`, {
        params: { id: q_id },
        headers: { Authorization: `token ${getAuthInfo().token}` },
      });
      return res.data;
    } catch (error) {
      console.log(error);
    }
  };

  const getQImage = async (img_id) => {
    try {
      const res = await axios.get(`http://127.0.0.1:8000/api_question_image/`, {
        params: { id: img_id },
        headers: { Authorization: `token ${getAuthInfo().token}` },
      });
      return res.data.image;
    } catch (error) {
      console.log(error);
    }
  };

  const createQView = async (questionData) => {
    //
    // full_question contains all data related to question
    //
    let full_question = await getQDescription(questionData.question);
    let userAnswer = null;
    let correctAnswer = null;
    let question_image = {};
    if (full_question.has_images) {
      question_image = await getQImage(full_question.question_images[0]);
      question_image = <img src={question_image} />;
    }
    //
    // Checks if any answers are text or images
    //
    if (questionData.solution.toString().includes("http")) {
      userAnswer = <img src={questionData.solution} />;
      correctAnswer = <img src={full_question.official_solution} />;
    } else {
      userAnswer = <MathJaxRender text={questionData.solution} />;
      correctAnswer = <MathJaxRender text={full_question.official_solution} />;
    }
    setQuestionDisplays((b) => [
      ...b,
      <ViewQInSession
        key={questionData.id}
        question={<MathJaxRender text={full_question.question_description} />}
        result={questionData.is_correct}
        user_answer={userAnswer}
        correct_answer={correctAnswer}
        question_image={question_image}
      />,
    ]);
  };

  useEffect(() => {
    axios
      .get(`http://127.0.0.1:8000/api_solutions/`, {
        params: {
          username: username,
          session_id: sessionId,
        },
        headers: { Authorization: `token ${getAuthInfo().token}` },
      })
      .then((response) => {
        //
        // Ensures that the questions are in the correct order
        //
        let questionData = response.data.sort(function (a, b) {
          return a.question_num - b.question_num;
        });
        for (let i = 0; i < questionData.length; i++) {
          let question = questionData[i];
          createQView(question, i);
        }
      })
      .catch((error) => console.log(error));

    return () => {
      setQuestionDisplays([]);
    };
  }, [sessionId]);

  return <>{questionDisplays}</>;
}

ViewSession.propTypes = {
  sessionId: PropTypes.string,
};

export default ViewSession;
