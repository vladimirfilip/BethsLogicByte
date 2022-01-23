import React, { useState } from "react";
import PropTypes from "prop-types";
import "./ProblemOfDay.css";

function ProblemOfDay(props) {
  let [page, setPage] = useState(0);
  let filledCircle = "⬤";
  let emptyCircle = "◯";

  let dataLength = Object.keys(props.data).length;

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

  return (
    <div className="container pt-3">
      <div className="card text-white light_blue mb-3 shadow">
        <div className="row">
          <div className="col-1 flex">
            <span
              className={backClasses}
              onClick={() => {
                if (page !== 0) {
                  setPage((page -= 1));
                }
              }}
            >
              {"<"}
            </span>
          </div>
          <div className="col-10">
            <h1 className="center">{props.data[page].title}</h1>
            <div className="card text-white dark_blue">
              <p className="truncated">{props.data[page].description}</p>
            </div>
            <p className="center no-select">{progress}</p>
          </div>
          <div className="col-1 flex right">
            <span
              className={nextClasses}
              onClick={() => {
                if (page !== dataLength - 1) {
                  setPage((page += 1));
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
}

ProblemOfDay.propTypes = {
  data: PropTypes.object,
};

export default ProblemOfDay;
