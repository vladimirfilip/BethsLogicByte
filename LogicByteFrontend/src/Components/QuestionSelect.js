import React, { useState, useEffect } from "react";
import { asyncPOSTAPI, asyncGETAPI } from "../helpers/asyncBackend";
import PropTypes from "prop-types";
import { MathJax } from "better-react-mathjax";

function QuestionSelect(props) {
  let [isLoaded, setLoaded] = useState(false);
  let [selected, setSelected] = useState({});
  let [filteredData, setFilteredData] = useState([]);

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
    setLoaded(true);
    if (questions.length == undefined) {
      setFilteredData([questions]);
    } else {
      setFilteredData(questions);
    }
  };

  useEffect(() => {
    let filter = "/?tag_names=";
    if (props.tags.length == 0) {
      filter = "";
    } else {
      filter = filter + props.tags.join("|");
    }
    retrieveQuestions(filter);
  }, [props.tags]);

  useEffect(() => {
    let newSelected = Object.assign({}, selected);
    setFilteredData(filteredData);
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

  if (!isLoaded) {
    return <p>Loading</p>;
  } else {
    let children = filteredData.map((x) => {
      return (
        <div key={x.id}>
          <input
            type={"checkbox"}
            onChange={() => {
              setSelected({ ...selected, [x.id]: !selected[x.id] });
            }}
            checked={selected[x.id] != undefined ? selected[x.id] : false}
          ></input>
          {x.question_description}
        </div>
      );
    });
    return (
      <>
        <MathJax dynamic={true}>{children}</MathJax>
        <button onClick={() => start()}>Start</button>
      </>
    );
  }
}

QuestionSelect.propTypes = {
  tags: PropTypes.array,
  changePage: PropTypes.func,
};

export default QuestionSelect;
