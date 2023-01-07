import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { asyncDELETEAPI } from "../helpers/asyncBackend";

function FinishSession(props) {
  //
  // score is calculated as percentage and only from completed questions
  //
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    asyncDELETEAPI("api_filter_result", { user_profile: "" });
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
