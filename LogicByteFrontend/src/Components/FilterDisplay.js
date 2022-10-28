import axios from "axios";
import React, { useState, useEffect } from "react";
import FilterQuestionDisplay from "./FilterQuestionDisplay";
import questionIDs from "../helpers/questionIDs";
import { getAuthInfo } from "../helpers/authHelper";
import PropTypes from "prop-types";

function FilterDisplay(props) {
  const [questionList, setQuestionList] = useState([]);
  const [allQuestions, setAllQuestions] = useState();

  const getQuestions = (topic) => {
    axios
      .get(`http://127.0.0.1:8000/api_questions/`, {
        headers: { Authorization: `token ${getAuthInfo().token}` },
        params: { topic: topic },
      })
      .then((response) => {
        setAllQuestions(response.data);
      })
      .except((error) => {
        console.log(error);
      });
  };

  const loadQuestions = (first_q) => {
    let q_ids = [first_q.id];
    for (const question of allQuestions) {
      q_ids.push(question.id);
    }
    questionIDs.set_ids(q_ids);
  };

  useEffect(() => {
    getQuestions(props.topic);
    console.log("ok");
  }, [props.topic]);

  useEffect(() => {
    for (const question of allQuestions) {
      setQuestionList([
        ...questionList,
        <FilterQuestionDisplay
          key={question.id}
          question_data={question}
          q_loader={loadQuestions}
        />,
      ]);
    }
  }, [allQuestions]);

  return <>{questionList}</>;
}

FilterDisplay.propTypes = {
  topic: PropTypes.string,
};
export default FilterDisplay;
