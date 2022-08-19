import React, { useState, useEffect, useContext } from "react";
import PropTypes from "prop-types";
import MathJaxRender from "../helpers/mathJaxRender";
import axios from "axios";
import { getAuthInfo } from "../helpers/authHelper";
import { UserDataContext } from "../router.js";

function ViewQuestion(props) {
  const username = useContext(UserDataContext);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isCorrect, setIsCorrect] = useState(true);
  //
  // To store completed question data from database
  //
  const [questionData, setQuestionData] = useState(null);
  const [questionDescription, setQuestionDescription] = useState("");
  const [userAnswer, setUserAnswer] = useState("");
  const [correctAnswer, setCorrectAnswer] = useState("");
  //
  // img is image in question description
  //
  const [img, setImg] = useState("");
  const [showImg, setShowImg] = useState(false);

  const getTags = () => {
    axios
      .get("http://127.0.0.1:8000/api_questions/", {
        params: {
          id: props.id,
          s_exam_board: "",
          s_difficulty: "",
          s_exam_type: "",
        },
        headers: { Authorization: `token ${getAuthInfo().token}` },
      })
      .then((response) =>
        props.updateTags(
          response.data.exam_board,
          response.data.difficulty,
          response.data.exam_type
        )
      )
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    //
    // Ensures all three states are updated
    //
    if (questionDescription && correctAnswer && userAnswer) {
      if (questionData && questionData.img_options) {
        if (correctAnswer.props.src == userAnswer.props.src) {
          props.showResult(true);
          setIsCorrect(true);
        } else {
          props.showResult(false);
          setIsCorrect(false);
        }
      } else {
        if (correctAnswer.props.text == userAnswer.props.text) {
          props.showResult(true);
          setIsCorrect(true);
        } else {
          setIsCorrect(false);
          props.showResult(false);
        }
      }
    }
  }, [questionDescription, correctAnswer, userAnswer]);

  useEffect(() => {
    if (questionData) {
      setQuestionDescription(
        <MathJaxRender text={questionData.question_description} />
      );
      if (questionData.q_image != "") {
        setImg(<img src={questionData["q_image"]} />);
        setShowImg(true);
      } else {
        setShowImg(false);
      }

      if (questionData.img_options) {
        setCorrectAnswer(<img src={questionData.solution} />);
        setUserAnswer(<img src={questionData.selected_option} />);
      } else {
        setCorrectAnswer(<MathJaxRender text={questionData.solution} />);
        setUserAnswer(<MathJaxRender text={questionData.selected_option} />);
      }
      setIsLoaded(true);
    }
  }, [questionData]);

  useEffect(() => {
    //
    // Uses stored question data to prevent excessive database requests
    //
    const current_id = props.id;
    axios
      .get("http://127.0.0.1:8000/api_questions_in_session/", {
        params: { username: username, question_id: current_id },
        headers: { Authorization: `token ${getAuthInfo().token}` },
      })
      .then((response) => setQuestionData(response.data))
      .catch((error) => console.log(error));
    getTags();
  }, [props.id]);

  if (!isLoaded) {
    return <h2>Loading...</h2>;
  } else {
    return (
      <>
        <p>{questionDescription}</p>
        {showImg && img}
        <h2>Your answer: {userAnswer}</h2>
        {!isCorrect && <h2>The correct answer is {correctAnswer}</h2>}
      </>
    );
  }
}

ViewQuestion.propTypes = {
  showResult: PropTypes.func,
  id: PropTypes.number,
  updateTags: PropTypes.func,
};

export default ViewQuestion;
