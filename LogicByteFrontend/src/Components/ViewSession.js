import React, { useEffect, useState, useRef } from "react";
import MathJaxRender from "../helpers/mathJaxRender";
import PropTypes from "prop-types";
import ViewQInSession from "./ViewQInSession";
import { asyncGETAPI } from "../helpers/asyncBackend";

function ViewSession(props) {
  const sessionId = props.sessionId;
  const [questionDisplays, setQuestionDisplays] = useState([]);
  const [loadMore, setLoadMore] = useState(false);
  const questionData = useRef();

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
      question_image = <img className="q-in-session-img" src={question_image} />;
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

  const showNextQ = () => {
    let nextIdx = questionDisplays.length;
    let numLeft = questionData.current.length - questionDisplays.length;
    if (numLeft < 10) {
      setLoadMore(false);
      for (let i = nextIdx; i < questionData.current.length; i++) {
        createQView(questionData.current[i]);
      }
    } else {
      for (let i = nextIdx; i < nextIdx + 10; i++) {
        createQView(questionData.current[i]);
      }
    }
  };

  useEffect(() => {
    (async () => {
      questionData.current = await asyncGETAPI("api_solutions", {
        user_profile: "",
        session_id: sessionId,
      });
      if (questionData.current.length > 1) {
        questionData.current = questionData.current.sort(function (a, b) {
          return a.question_num - b.question_num;
        });
      } else {
        questionData.current = [questionData.current];
      }
      if (questionData.current.length > 10) {
        setLoadMore(true);
        for (let i = 0; i < 10; i++) {
          createQView(questionData.current[i]);
        }
      } else {
        for (let i = 0; i < questionData.current.length; i++) {
          createQView(questionData.current[i]);
        }
      }
    })();
    return () => {
      setQuestionDisplays([]);
      setLoadMore(false);
    };
  }, [sessionId]);

  return (
    <>
      {questionDisplays}
      {loadMore && <button onClick={showNextQ}>Show more questions</button>}
    </>
  );
}

ViewSession.propTypes = {
  sessionId: PropTypes.string,
};

export default ViewSession;
