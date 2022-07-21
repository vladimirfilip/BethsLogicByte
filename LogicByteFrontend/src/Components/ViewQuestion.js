import React, { useState, useEffect } from "react";
import completed_qs from "../helpers/completedQs";
import PropTypes from "prop-types";

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
    const question_data = completed_qs.get_q_data(props.id);
    setQuestionDescription(question_data[0].question_description);
    setCorrectAnswer(question_data[0].solution);
    setUserAnswer(question_data[1]);

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
