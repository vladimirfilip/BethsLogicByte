import axios from "axios";
import React, { useState, useEffect } from "react";
import FilterQuestionDisplay from "./src/Components/FilterQuestionDisplay";
import { getAuthInfo } from "./src/helpers/authHelper";

function FilterDisplay(props) {
  const [questionList, setQuestionList] = useState([]);

  const getQuestions = (topic) => {
    axios
      .get(`http://127.0.0.1:8000/api_questions/`, {
        headers: { Authorization: `token ${getAuthInfo().token}` },
        params: { topic: topic },
      })
      .then((response) => {
        return response.data;
      })
      .except((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    const questions = getQuestions(props.topic);
    for (const question of questions) {
      setQuestionList([
        ...questionList,
        <FilterQuestionDisplay question_data={question} />,
      ]);
    }
  }, []);

  return <>{questionList}</>;
}

export default FilterDisplay;
