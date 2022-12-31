import React, { useEffect, useState } from "react";
import MathJaxRender from "../helpers/mathJaxRender";
import PropTypes from "prop-types";
import ViewQInSession from "./ViewQInSession";
import { asyncGETAPI } from "../helpers/asyncBackend";

function ViewSession(props) {
  const sessionId = props.sessionId;
  const [questionDisplays, setQuestionDisplays] = useState([]);

  const getQDescription = async (q_id) => {
    const res = await asyncGETAPI("api_questions", { id: q_id });
    return res;
  };

  const getQImage = async (img_id) => {
    const res = await asyncGETAPI("api_question_image", { id: img_id });
    return res.image;
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
    (async () => {
      let questionData = await asyncGETAPI("api_solutions", {
        user_profile: "",
        session_id: sessionId,
      });
      questionData = questionData.sort(function (a, b) {
        return a.question_num - b.question_num;
      });
      for (let i = 0; i < questionData.length; i++) {
        let question = questionData[i];
        createQView(question, i);
      }
    })();
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
