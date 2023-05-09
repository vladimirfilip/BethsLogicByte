import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import MathJaxRender from "../helpers/mathJaxRender";
import { asyncGETAPI } from "../helpers/asyncBackend";
import "./DoQuestion.css";

function ViewQuestion(props) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isCorrect, setIsCorrect] = useState(true);
  //
  // To store completed question data from database
  //
  const [questionDescription, setQuestionDescription] = useState("");
  const [userAnswer, setUserAnswer] = useState("");
  const [correctAnswer, setCorrectAnswer] = useState("");
  //
  // img is image in question description
  //
  const [img, setImg] = useState("");
  const [showImg, setShowImg] = useState(false);

  const getTags = async () => {
    const tagParams = {
      id: props.id,
      s_exam_board: "",
      s_difficulty: "",
      s_exam_type: "",
    };
    const tags = await asyncGETAPI("api_questions", tagParams);
    props.updateTags(tags.exam_board, tags.difficulty, tags.exam_type);
  };

  const setResult = (img_options, correct_answer, user_answer) => {
    if (img_options) {
      if (correct_answer == user_answer) {
        props.showResult(true);
        setIsCorrect(true);
      } else {
        props.showResult(false);
        setIsCorrect(false);
      }
    } else {
      if (correct_answer == user_answer) {
        props.showResult(true);
        setIsCorrect(true);
      } else {
        props.showResult(false);
        setIsCorrect(false);
      }
    }
  };

  const getPrevQData = async () => {
    let qData = await asyncGETAPI("api_questions_in_session", {
      user_profile: "",
      question_id: props.id,
    });
    return qData;
  };
  useEffect(() => {
    //
    // Uses stored question data to prevent excessive database requests
    //
    (async () => {
      const qData = await getPrevQData();
      setQuestionDescription(
        <MathJaxRender text={qData.question_description} />
      );
      if (qData.q_image != "") {
        setImg(<img src={qData.q_image} />);
        setShowImg(true);
      } else {
        setShowImg(false);
      }

      if (qData.img_options) {
        setCorrectAnswer(<img src={qData.solution} />);
        setUserAnswer(<img src={qData.selected_option} />);
      } else {
        setCorrectAnswer(<MathJaxRender text={qData.solution} />);
        setUserAnswer(<MathJaxRender text={qData.selected_option} />);
      }
      setResult(qData.img_options, qData.solution, qData.selected_option);
      setIsLoaded(true);
      getTags();
    })();
  }, [props.id]);

  if (!isLoaded) {
    return <h2>Loading...</h2>;
  } else {
    return (
      <div className="question-card">
        <p className="row question-description">{questionDescription}</p>
        <span className="row img-fluid">{showImg && img}</span>
        <h2>Your answer: {userAnswer}</h2>
        {!isCorrect && <h2>The correct answer is {correctAnswer}</h2>}
      </div>
    );
  }
}

ViewQuestion.propTypes = {
  showResult: PropTypes.func,
  id: PropTypes.string,
  updateTags: PropTypes.func,
};

export default ViewQuestion;
