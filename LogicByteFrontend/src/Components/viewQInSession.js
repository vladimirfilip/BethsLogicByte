import React, { useContext, useEffect, useState } from "react";
import { UserDataContext } from "../router";
import axios from "axios";
import { getAuthInfo } from "../helpers/authHelper";
import MathJaxRender from "../helpers/mathJaxRender";
import PropTypes from "prop-types";

function ViewQInSession(props) {
  const username = useContext(UserDataContext);
  const sessionId = props.sessionId;
  const [questions, setQuestions] = useState([]);
  const [showDisplays, setShowDisplays] = useState({});

  const createQView = (questionData, i) => {
    let userAnswer = null;
    let correctAnswer = null;

    if ("http" in questionData.solution) {
      userAnswer = <img src={questionData.solution} />;
      correctAnswer = <img src={questionData.question.official_solution} />;
    } else {
      userAnswer = questionData.solution;
      correctAnswer = questionData.question.official_solution;
    }

    return (
      <div>
        <button
          onClick={() => {
            if (showDisplays[i] == 0) {
              setShowDisplays((showDisplays) => ({ ...showDisplays, [i]: 1 }));
            } else {
              setShowDisplays((showDisplays) => ({ ...showDisplays, [i]: 0 }));
            }
          }}
        >
          {`${questionData.question_description.slice(0, 20)}\t${
            questionData.is_correct ? "Correct!" : "Incorrect"
          }`}
        </button>
        <div style={`display:${showDisplays[i] == 1 ? "block" : "none"}`}>
          <MathJaxRender text={questionData.question_description} />
          <p>Your answer:</p>
          {userAnswer}
          {!questionData.is_correct && <p>The correct answer is:</p> &&
            correctAnswer}
        </div>
      </div>
    );
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
        let questionData = response.data.sort(function (a, b) {
          return a.question_num - b.question_num;
        });
        for (let i = 0; i < questionData.length; i++) {
          let question = questionData.data[i];
          setShowDisplays((b) => [...b, 0]);

          setQuestions((a) => [...a, createQView(question, i)]);
        }
      })
      .catch((error) => console.log(error));
  }, []);

  return <>{questions}</>;
}

ViewQInSession.propTypes = {
  sessionId: PropTypes.string,
};

export default ViewQInSession;
