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

  let backClasses = "next-button flex no-select button-cursor darken";
  let nextClasses = "next-button flex no-select button-cursor darken";

  if (page === 0) {
    backClasses = "next-button flex no-select disabled";
  } else if (page === dataLength - 1) {
    nextClasses = "next-button flex no-select disabled";
  } else {
    backClasses = "next-button flex no-select button-cursor darken";
    nextClasses = "next-button flex no-select button-cursor darken";
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
      <div className="container pt-3">
        <div className="card text-white light_blue mb-3 shadow">
          <div className="row">
            <div className="col-1 flex">
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
            <div className="col-10">
              <h1>{props.subject} Suggested Problems</h1>
              <div className="card text-white dark_blue">
                <p className="truncated">
                  <MathJaxRender text={qData[page].question_description} />
                </p>
              </div>
              <p className="center no-select">{progress}</p>
              <button onClick={start}>Attempt</button>
            </div>
            <div className="col-1 flex right">
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
