import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { asyncDELETEAPI } from "../helpers/asyncBackend";
import "./finishSession.css";
import "../App.css";

function FinishSession(props) {
  //
  // score is calculated as percentage and only from completed questions
  //
  const [isLoaded, setIsLoaded] = useState(false);
  let resultLevel = null;

  if (Number(props.argument) >= 75) {
    resultLevel = "good";
  } else if (Number(props.argument) >= 40) {
    resultLevel = "medium";
  } else {
    resultLevel = "poor";
  }

  useEffect(() => {
    asyncDELETEAPI("api_filter_result", { user_profile: "" });
    setIsLoaded(true);
  }, []);

  if (!isLoaded) {
    return <h2>Loading...</h2>;
  } else {
    return (
      <>
        <div className="session_header">
          <h1 className="title col-lg-11">Session complete!</h1>
          <button className="close" onClick={() => props.changePage("home")}>
            X
          </button>
        </div>
        <div className="session_results">
          <h2 className="msg_title">You got</h2>
          <h1 className={`result ${resultLevel}-text`}>
            {props.argument + "%"}
          </h1>
          <button
            onClick={() => props.changePage("home")}
            className="exit_btn btn btn-outline-secondary"
          >
            Exit
          </button>
        </div>
      </>
    );
  }
}

FinishSession.propTypes = {
  changePage: PropTypes.func,
  argument: PropTypes.string,
};

export default FinishSession;
