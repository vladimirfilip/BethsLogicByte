import React, { useState, useEffect } from "react";
import { asyncPOSTAPI, asyncGETAPI } from "../helpers/asyncBackend";
import PropTypes from "prop-types";
import { MathJax } from "better-react-mathjax";
import GenerateQuestion from "./GeneratedQuestion";
import "./QuestionSelect.css";
import Loading from "../helpers/loading";

function QuestionSelect(props) {
  //let [isLoaded, setLoaded] = useState(false);
  let [selected, setSelected] = useState({});
  let [filteredData, setFilteredData] = useState([]);
  let [children, setChildren] = useState([]);
  let [currentSubject, setCurrentSubject] = useState(null);

  async function start() {
    let ids = [];
    for (let i in selected) {
      if (selected[i] == true) {
        ids.push(+i);
      }
    }
    if (ids.length > 0) {
      await asyncPOSTAPI("api_filter_result", {
        question_ids: ids.join(),
        user_profile: "",
      });
      props.changePage("question");
    }
  }

  const retrieveQuestions = async (filterData) => {
    const questions = await asyncGETAPI("api_questions" + filterData, {});
    if (questions) {
      if (questions.length == undefined) {
        setFilteredData([questions]);
      } else {
        setFilteredData(questions);
      }
    } else {
      setFilteredData([]);
    }
  };

  useEffect(() => {
    let filter = `/?tag_names=${props.subject}`;
    filter = filter + props.tags.join("");
    retrieveQuestions(filter);
  }, [props.tags, props.subject]);

  useEffect(() => {
    let newSelected = Object.assign({}, selected);
    setChildren(
      filteredData.map((x) => {
        return (
          <GenerateQuestion
            key={x.id}
            id={x.id}
            updateSelected={(id) =>
              setSelected((selected) => ({
                ...selected,
                [id]: !selected[id],
              }))
            }
            selected={selected}
            question_data={x}
          />
        );
      })
    );
    for (let i in selected) {
      let found = false;
      for (let j = 0; j < filteredData.length; j++) {
        if (filteredData[j].id == i) {
          found = true;
        }
      }
      if (found == false) {
        delete newSelected[i];
      }
    }
    setSelected(newSelected);
  }, [filteredData]);

  useEffect(() => {
    setCurrentSubject(props.subject);
  }, [children]);

  if (props.subject != currentSubject) {
    return <Loading />;
  } else {
    return (
      <div className="container question-select-container">
        <button onClick={() => start()} className="btn btn-secondary start_btn">
          Start
        </button>
        <div className="generated_questions">
          <MathJax dynamic={true}>{children}</MathJax>
        </div>
      </div>
    );
  }
}

QuestionSelect.propTypes = {
  tags: PropTypes.array,
  changePage: PropTypes.func,
  subject: PropTypes.string,
};

export default QuestionSelect;
