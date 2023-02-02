import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import "./ProblemOfDay.css";
import { asyncGETAPI, asyncPOSTAPI } from "../helpers/asyncBackend";
import MathJaxRender from "../helpers/mathJaxRender";

function ProblemOfDay(props) {
  const [page, setPage] = useState(0);
  const [qData, setQData] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  let filledCircle = "⬤";
  let emptyCircle = "◯";

  let dataLength = 5;

  let progress = "";
  for (let i = 0; i < dataLength; i++) {
    if (i === page) {
      progress = progress + filledCircle;
    } else {
      progress = progress + emptyCircle;
    }
  }


  let baseClasses = "next-button bg-blue-3 text-white flex no-select ";
  let defaultClasses = baseClasses + "button-cursor darken";
  let disabledClasses = baseClasses + "bg-blue-4";

  let backClasses = defaultClasses;
  let nextClasses = defaultClasses;

  if (page === 0) {
    backClasses = disabledClasses;
  } else if (page === dataLength - 1) {
    nextClasses = disabledClasses;
  }

  const getQData = async () => {
    const res = await asyncGETAPI(
      "api_questions" + `/?tag_names=${props.subject}&` + "number=5",
      { s_question_description: "", s_id: "" }
    );
    setQData(res);
  };

  const start = async () => {
    await asyncPOSTAPI("api_filter_result", {
      question_ids: qData[page].id.toString(),
      user_profile: "",
    });
    props.changePage("question");
  };

  useEffect(() => {
    getQData();
  }, [props.subject]);

  useEffect(() => {
    if (qData.length == 5) {
      setIsLoaded(true);
    }
  }, [qData]);

  if (isLoaded) {
    return (
      <div className="container pt-3 p-0">
        <div className="problem-of-day-card text-white bg-blue-3 mb-3 shadow">
          <div className="row m-0">
            <div className="col-1 flex p-0">
              <span
                className={backClasses}
                onClick={() => {
                  if (page !== 0) {
                    setPage(page - 1);
                  }
                }}
              >
                {"<"}
              </span>
            </div>
            <div className="col-10 p-0_5">
              <h1 className="mb-0_75">{props.subject} Suggested Problems</h1>
              <div className="problem-of-day-card text-white bg-blue-4 p-0_5">
                <p className="truncated">
                  <MathJaxRender text={qData[page].question_description} />
                </p>
              </div>
              <p className="centre-text no-select mt-0_5 mb-0_5">{progress}</p>
              <button className="darken bg-blue-3 text-white prob-of-day-btn" onClick={start}>Attempt</button>
            </div>
            <div className="col-1 flex right p-0">
              <span
                className={nextClasses}
                onClick={() => {
                  if (page !== dataLength - 1) {
                    setPage(page + 1);
                  }
                }}
              >
                {">"}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    return <h1>Loading</h1>;
  }
}

ProblemOfDay.propTypes = {
  subject: PropTypes.string,
  changePage: PropTypes.func,
};

export default ProblemOfDay;
