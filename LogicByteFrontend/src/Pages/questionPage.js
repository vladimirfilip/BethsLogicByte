import React, { useState, useEffect, useContext } from "react";
import DoQuestion from "../Components/DoQuestion";
import ViewQuestion from "../Components/ViewQuestion";
import questionIDs from "../helpers/questionIDs";
import PropTypes from "prop-types";
import axios from "axios";
import { getAuthInfo } from "../helpers/authHelper";
import { UsernameContext } from "../router.js";

function QuestionPage(props) {
  const username = useContext(UsernameContext);
  const [isLoaded, setIsLoaded] = useState(false);
  const [buttonCounter, setButtonCounter] = useState(0);
  //
  // Whether question submitted
  //
  const [qCompleted, setQCompleted] = useState(false);
  //
  // result used to display Correct! or Incorrect in Result header
  //
  const [result, setResult] = useState("");
  //
  // result head is header which shows incorrect or correct
  //
  const [showResultHead, setShowResultHead] = useState(false);
  //
  // QuestionComponent is either to do question or view previous completed question
  //
  const [QuestionComponent, setQuestionComponent] = useState(null);
  const [tags, setTags] = useState({
    exam_board: "",
    difficulty: "",
    exam_type: "",
  });
  const q_ids = questionIDs.get_ids;
  //
  // Prevents user from by passing filter component
  //
  if (q_ids.length == 0) {
    props.changePage("home");
  }

  const checkCompleted = (question_id) => {
    //
    // Checks whether the question has already been completed in this particular session
    //
    axios
      .get("http://127.0.0.1:8000/api_check_question_completed/", {
        params: { username: username, question_id: question_id },
        headers: { Authorization: `token ${getAuthInfo().token}` },
      })
      .then((response) => {
        displayQuestionComponent(response.data.data == "true" ? true : false);
      })
      .catch((error) => console.log(error));
  };

  const displayQuestionComponent = (completed) => {
    console.log(completed);
    if (completed) {
      setQuestionComponent(
        <ViewQuestion
          id={q_ids[parseInt(localStorage.getItem("currentIdx"))]}
          showResult={showResult}
          updateTags={updateTags}
        ></ViewQuestion>
      );
    } else {
      setQCompleted(false);
      setQuestionComponent(
        <DoQuestion
          id={q_ids[parseInt(localStorage.getItem("currentIdx"))]}
          showResult={showResult}
          updateTags={updateTags}
        ></DoQuestion>
      );
    }
    setIsLoaded(true);
  };

  const calculateScore = () => {
    //
    // Gets completed question data
    //
    axios
      .get("http://127.0.0.1:8000/api_questions_in_session/", {
        params: {
          username: username,
          s_solution: "",
          s_selected_option: "",
        },
        headers: { Authorization: `token ${getAuthInfo().token}` },
      })
      .then((response) => {
        try {
          let total_correct = 0;
          let total = 0;
          let score = 0;
          for (const entry of response.data) {
            if (entry.solution == entry.selected_option) {
              total_correct += 1;
            }
            total += 1;
          }
          if (total == 0) {
            score = 0;
          } else {
            let percent = (total_correct / total) * 100;
            score = Math.round(percent * 10) / 10;
          }
          props.changePage(`finish/${score}`);
        } catch (err) {
          if (
            response.data.solution &&
            response.data.solution == response.data.selected_option
          ) {
            props.changePage(`finish/${100}`);
          } else {
            props.changePage(`finish/${0}`);
          }
        }
      })
      .catch((error) => console.log(error));
  };

  const showResult = (isCorrect) => {
    if (isCorrect) {
      setResult("Correct!");
    } else {
      setResult("Incorrect");
    }
    //
    // To display the result
    //
    setShowResultHead(true);
    setQCompleted(true);
  };

  const updateTags = (exam_board, difficulty, exam_type) => {
    let new_tags = {
      exam_board: exam_board,
      difficulty: difficulty,
      exam_type: exam_type,
    };
    setTags(new_tags);
  };

  const handle_next = (event) => {
    //
    // Moves to next generated question
    //
    event.preventDefault();
    if (parseInt(localStorage.currentIdx) == q_ids.length - 1) {
      calculateScore();
      localStorage.removeItem("currentIdx");
    } else {
      setButtonCounter(buttonCounter == 0 ? 1 : 0);
      localStorage.currentIdx = parseInt(localStorage.currentIdx) + 1;
    }
  };

  const handle_previous = (event) => {
    //
    // Moves to previous generated question
    //
    event.preventDefault();
    localStorage.currentIdx = parseInt(localStorage.currentIdx) - 1;
    setButtonCounter(buttonCounter == 0 ? 1 : 0);
  };

  const clearSessionData = () => {
    //
    // Deletes all completed question from current session of user
    //
    axios
      .delete("http://127.0.0.1:8000/api_questions_in_session/", {
        params: { username: username },
        headers: { Authorization: `token ${getAuthInfo().token}` },
      })
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    //
    // currentIdx used to keep track of which question in q_ids is being completed
    //
    if (username) {
      if (!localStorage.getItem("currentIdx")) {
        let id = parseInt(props.argument);
        localStorage.setItem("currentIdx", q_ids.indexOf(id).toString());
      }
      let currentIdx = localStorage.getItem("currentIdx");
      setShowResultHead(false);
      //
      // checks whether question is completed and then displays question completed
      //
      checkCompleted(q_ids[currentIdx]);
    }
  }, [buttonCounter, username]);

  if (!isLoaded) {
    return <h2>Loading...</h2>;
  } else {
    return (
      <>
        {/*-Header-*/}
        <div>
          <h1>
            {"Question " +
              (parseInt(localStorage.getItem("currentIdx")) + 1).toString()}
          </h1>
          <button
            onClick={() => {
              localStorage.removeItem("currentIdx");
              clearSessionData();
              props.changePage("home");
            }}
          >
            X
          </button>
        </div>
        <div>
          <p>{tags.exam_board}</p>
          <p>{tags.difficulty}</p>
          <p>{tags.exam_type}</p>
        </div>
        {/*--------*/}
        {showResultHead && <h2>{result}</h2>}
        {/*-DoQuestion or ViewQuestion-*/}
        {QuestionComponent}
        {/*----------------------------*/}
        {/*-Displayed when not the last question and when question completed-*/}
        {!qCompleted &&
          parseInt(localStorage.getItem("currentIdx")) < q_ids.length - 1 && (
            <button
              onClick={() => {
                calculateScore();
                localStorage.removeItem("currentIdx");
              }}
            >
              Finish
            </button>
          )}
        {/*------------------------------------------------------------------*/}
        <div>
          <button
            onClick={handle_previous}
            disabled={parseInt(localStorage.getItem("currentIdx")) == 0}
          >
            Previous
          </button>
          <button onClick={handle_next}>
            {parseInt(localStorage.getItem("currentIdx")) == q_ids.length - 1
              ? "Finish"
              : "Next"}
          </button>
        </div>
      </>
    );
  }
}

QuestionPage.propTypes = {
  changePage: PropTypes.func,
  username: PropTypes.string,
  argument: PropTypes.string,
};

export default QuestionPage;
