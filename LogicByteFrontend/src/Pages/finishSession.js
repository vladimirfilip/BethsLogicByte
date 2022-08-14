import React, { useContext, useEffect, useState } from "react";
import questionIDs from "../helpers/questionIDs";
import PropTypes from "prop-types";
import { UsernameContext } from "../router";
import axios from "axios";
import { getAuthInfo } from "../helpers/authHelper";

function FinishSession(props) {
  const username = useContext(UsernameContext);
  //
  // score is calculated as percentage and only from completed questions
  //
  const [isLoaded, setIsLoaded] = useState(false);

  const clearSessionData = () => {
    axios
      .delete("http://127.0.0.1:8000/api_questions_in_session/", {
        params: { username: username },
        headers: { Authorization: `token ${getAuthInfo().token}` },
      })
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    questionIDs.clear_data();
    clearSessionData();
    setIsLoaded(true);
  }, []);

  if (!isLoaded) {
    return <h2>Loading...</h2>;
  } else {
    return (
      <>
        <div>
          <h1>Session complete</h1>
          <button onClick={() => props.changePage("home")}>X</button>
        </div>
        <h2>You got {props.argument + "%"}</h2>
        <button onClick={() => props.changePage("home")}>Exit</button>
      </>
    );
  }
}

FinishSession.propTypes = {
  changePage: PropTypes.func,
  argument: PropTypes.string,
};

export default FinishSession;
