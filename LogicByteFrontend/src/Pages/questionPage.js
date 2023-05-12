import React, { useState, useEffect, useRef } from "react";
import DoQuestion from "../Components/DoQuestion";
import ViewQuestion from "../Components/ViewQuestion";
import PropTypes from "prop-types";
import moment from "moment";
import Canvas from "../Components/canvas";
import {
  asyncGETAPI,
  asyncDELETEAPI,
  asyncPOSTAPI,
} from "../helpers/asyncBackend";
import "./questionPage.css";
import "../Components/canvas.css";

function QuestionPage(props) {
  const questionIDs = useRef(null);
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
  const [canvasSvg, setCanvasSvg] = useState(null);
  //
  // Prevents user from by passing filter component
  //
  let session_id = useRef(moment().format("YYYYMMDDHHmmss"));

  const checkCompleted = async (question_id) => {
    //
    // Checks whether the question has already been completed in this particular session
    //
    const completedRes = await asyncGETAPI("api_check_question_completed", {
      user_profile: "",
      question_id: question_id,
    });
    displayQuestionComponent(completedRes.data == "true" ? true : false);
  };

  const addSessionID = (score) => {
    const res = asyncPOSTAPI("api_user_question_session", {
      session_id: session_id.current,
      score: score,
      user_profile: "",
    });
    return res;
  };

  const displayQuestionComponent = (completed) => {
    if (completed) {
      setQuestionComponent(
        <ViewQuestion
          id={questionIDs.current[parseInt(localStorage.getItem("currentIdx"))]}
          showResult={showResult}
          updateTags={updateTags}
          className="question-component"
        ></ViewQuestion>
      );
    } else {
      setQCompleted(false);

      setQuestionComponent(
        <DoQuestion
          id={questionIDs.current[parseInt(localStorage.getItem("currentIdx"))]}
          showResult={showResult}
          updateTags={updateTags}
          sessionID={session_id.current}
          className="question-component"
          canvas={canvasSvg}
        ></DoQuestion>
      );
    }
    setIsLoaded(true);
  };

  const calculateScore = async () => {
    //
    // Gets completed question data
    //
    const sessionData = await asyncGETAPI("api_questions_in_session", {
      user_profile: "",
      s_solution: "",
      s_selected_option: "",
    });
    if (!sessionData) {
      props.changePage("finish/0");
    } else {
      let score = 0;
      clearSessionData();
      try {
        let total_correct = 0;
        let total = 0;
        for (const entry of sessionData) {
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
      } catch (err) {
        if (
          sessionData.solution &&
          sessionData.solution == sessionData.selected_option
        ) {
          score = 100;
        } else {
          score = 0;
        }
      }
      addSessionID(score);
      props.changePage(`finish/${score}`);
    }
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
    if (parseInt(localStorage.currentIdx) == questionIDs.current.length - 1) {
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

  const clearSessionData = async () => {
    //
    // Deletes all completed question from current session of user
    //
    await asyncDELETEAPI("api_questions_in_session", {
      user_profile: "",
    });
  };

  const getQuestionIDS = async () => {
    const res = await asyncGETAPI("api_filter_result", { user_profile: "" });
    return res.question_ids.split(",");
  };

  useEffect(() => {
    //
    // currentIdx used to keep track of which question in q_ids is being completed
    //
    (async () => {
      if (!questionIDs.current) {
        questionIDs.current = await getQuestionIDS();
      }
      if (!localStorage.getItem("currentIdx")) {
        localStorage.setItem("currentIdx", 0);
      }
      let currentIdx = localStorage.getItem("currentIdx");
      setShowResultHead(false);
      //
      // checks whether question is completed and then displays question completed
      //
      checkCompleted(questionIDs.current[currentIdx]);
    })();
    return () => {
      setQCompleted(false);
      setResult("");
      setShowResultHead(false);
    };
  }, [buttonCounter]);

  if (!isLoaded) {
    return <h2>Loading...</h2>;
  } else {
    return (
      <div className="question_page">
        {/*-Header-*/}

        <nav className="navbar justify-content-center question_navbar">
          <div className="col-xs-1"></div>
          <h1 className="col-xs-10 question_num">
            {"Question " +
              (parseInt(localStorage.getItem("currentIdx")) + 1).toString()}
          </h1>
          <button
            className="col-xs-1 close_btn"
            data-html2canvas-ignore
            onClick={() => {
              localStorage.removeItem("currentIdx");
              calculateScore();
            }}
          >
            X
          </button>
        </nav>
        {showResultHead &&
          (result == "Correct!" ? (
            <h2 className="correct">{result}</h2>
          ) : (
            <h2 className="incorrect">{result}</h2>
          ))}
        <div className="tag_header">
          <p className="col-lg-4 q_tag">{tags.exam_board}</p>
          <p className="col-lg-4 q_tag">{tags.difficulty}</p>
          <p className="col-lg-4 q_tag">{tags.exam_type}</p>
        </div>
        {/*--------*/}
        {/*-DoQuestion or ViewQuestion-*/}
        <Canvas
          questionComponent={QuestionComponent}
          setCanvasSvg={setCanvasSvg}
        />
        {/*----------------------------*/}
        {/*-Displayed when not the last question and when question completed-*/}
        <div className="control_btns">
          {!qCompleted &&
            parseInt(localStorage.getItem("currentIdx")) <
              questionIDs.current.length - 1 && (
              <button
                data-html2canvas-ignore
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
              data-html2canvas-ignore
              onClick={handle_previous}
              disabled={parseInt(localStorage.getItem("currentIdx")) == 0}
            >
              Previous
            </button>
            <button data-html2canvas-ignore onClick={handle_next}>
              {parseInt(localStorage.getItem("currentIdx")) ==
              questionIDs.current.length - 1
                ? "Finish"
                : "Next"}
            </button>
          </div>
        </div>
      </div>
    );
  }
}

QuestionPage.propTypes = {
  changePage: PropTypes.func,
  argument: PropTypes.string,
};

export default QuestionPage;
