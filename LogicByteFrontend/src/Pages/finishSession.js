import React, { useEffect, useState } from "react";
import completed_qs from "../helpers/completedQs";
import questionIDs from "../helpers/questionIDs";
import PropTypes from "prop-types";

function FinishSession(props) {
  //
  // score is calculated as percentage and only from completed questions
  //
  const [score, setScore] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    let total_correct = 0;
    const question_data = completed_qs.completed_qs;
    for (const id of completed_qs.get_ids) {
      //
      // Checks if answer was correct
      //
      if (question_data[id][0].solution == question_data[id][1]) {
        total_correct++;
      }
    }
    if (completed_qs.get_ids.length == 0) {
      setScore(0);
    } else {
      let percent = (total_correct / completed_qs.get_ids.length) * 100;
      setScore(Math.round(percent * 10) / 10);
    }

    completed_qs.clear_data();
    questionIDs.clear_data();

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
        <h2>You got {score.toString() + "%"}</h2>
        <button onClick={() => props.changePage("home")}>Exit</button>
      </>
    );
  }
}

FinishSession.propTypes = {
  changePage: PropTypes.func,
};

export default FinishSession;
