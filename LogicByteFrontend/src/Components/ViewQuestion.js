import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import MathJaxRender from "../helpers/mathJaxRender";

function ViewQuestion(props) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isCorrect, setIsCorrect] = useState(true);
  const [questionDescription, setQuestionDescription] = useState("");
  const [userAnswer, setUserAnswer] = useState("");
  const [correctAnswer, setCorrectAnswer] = useState("");

  useEffect(() => {
    if (correctAnswer == userAnswer) {
      props.showResult(true);
      setIsCorrect(true);
    } else {
      setIsCorrect(false);
      props.showResult(false);
    }
  }, [questionDescription, correctAnswer, userAnswer]);

  useEffect(() => {
    //
    // Uses stored question data to prevent excessive database requests
    //

    const current_id = props.id;
    const question_data = JSON.parse(
      localStorage.getItem(current_id.toString())
    );
    setQuestionDescription(
      <MathJaxRender text={question_data.question_description} />
    );
    setCorrectAnswer(question_data.solution);
    setUserAnswer(question_data.selected_option);

    setIsLoaded(true);
  }, [props.id]);

  if (!isLoaded) {
    return <h2>Loading...</h2>;
  } else {
    return (
      <>
        <p>{questionDescription}</p>
        <h2>Your answer: {userAnswer}</h2>
        {!isCorrect && <h2>The correct answer is {correctAnswer}</h2>}
      </>
    );
  }
}

ViewQuestion.propTypes = {
  showResult: PropTypes.func,
  id: PropTypes.number,
};

export default ViewQuestion;
