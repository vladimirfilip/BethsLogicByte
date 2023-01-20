import React, { useState } from "react";
import PropTypes from "prop-types";

function ViewQInSession(props) {
  const { question, result, user_answer, correct_answer, question_image } =
    props;

  const [showQuestion, setShowQuestion] = useState(false);

  const toggleQuestion = (current) => {
    setShowQuestion(current ? false : true);
  };

  return (
    <div>
      <button onClick={() => toggleQuestion(showQuestion)}>
        {question.props.text.slice(0, 50) +
          "\t" +
          (result ? "Correct!" : "Incorrect")}
      </button>
      {showQuestion && (
        <div>
          {question}
          {Object.keys(question_image).length != 0 && question_image}
          <p>Your answer: {user_answer}</p>
          {!result && <p>The correct answer is {correct_answer}</p>}
        </div>
      )}
    </div>
  );
}

ViewQInSession.propTypes = {
  question: PropTypes.object,
  result: PropTypes.bool,
  user_answer: PropTypes.object,
  correct_answer: PropTypes.object,
  question_image: PropTypes.object,
};

export default ViewQInSession;
