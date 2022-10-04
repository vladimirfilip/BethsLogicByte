import React, { useEffect, useState } from "react";
import "./ProblemOfDay.css";
import axios from "axios";
import { getAuthInfo } from "../helpers/authHelper";
import MathJaxRender from "../helpers/mathJaxRender";

function ProblemOfDay() {
  let [page, setPage] = useState(0);
  const [content, setContent] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  let filledCircle = "⬤";
  let emptyCircle = "◯";

  let dataLength = 3;

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

  const getRandQIdx = (upper_limit) => {
    let idcs = [];

    while (idcs.length < 3) {
      let rand_num = Math.floor(Math.random() * upper_limit);
      if (!idcs.includes(rand_num)) {
        idcs.push(rand_num);
      }
    }
    return idcs;
  };

  useEffect(() => {
    console.log("good");
    axios
      .get(`http://127.0.0.1:8000/api_questions/`, {
        headers: { Authorization: `token ${getAuthInfo().token}` },
      })
      .then((response) => {
        console.log(getRandQIdx(response.data.length));
        for (let num of getRandQIdx(response.data.length)) {
          setContent((prevArray) => [
            ...prevArray,
            [
              <MathJaxRender
                text={response.data[num].question_description}
                key={num}
              />,
              response.data[num].tags,
            ],
          ]);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    if (content.length == 2) {
      setIsLoaded(true);
    }
  }, [content]);
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
                    setPage((page -= 1));
                  }
                }}
              >
                {"<"}
              </span>
            </div>
            <div className="col-10">
              <h1 className="center">Suggested problems</h1>
              <div className="card text-white dark_blue">
                <p className="truncated">{content[page][0]}</p>
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
  } else {
    return <h2>Loading...</h2>;
  }
}

export default ProblemOfDay;
