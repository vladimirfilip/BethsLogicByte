import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { getAuthInfo } from "../helpers/authHelper";
import PropTypes from "prop-types";
import MathJaxRender from "../helpers/mathJaxRender";
import { UsernameContext } from "../router";

function DoQuestion(props) {
  const username = useContext(UsernameContext);
  const [selectedOption, setSelectedOption] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);
  const [isCorrect, setIsCorrect] = useState(true);
  //
  // When user submits their answer submit button is hidden
  //
  const [showSubmit, setShowSubmit] = useState(true);
  //
  // Stores mathjax component
  //
  const [questionDescription, setQuestionDescription] = useState(null);
  //
  // options repesents the choice for multiple choice
  //
  const [options, setOptions] = useState([]);
  //
  // correctAnswer is for official solution
  //
  const [correctAnswer, setCorrectAnswer] = useState("");
  //
  // inputs stores all input tags for each option
  //
  const [inputs, setInputs] = useState([]);

  const getCorrectAnswer = () => {
    axios
      .get("http://127.0.0.1:8000/api_questions/", {
        params: { id: props.id.toString(), s_official_solution: "" },
        headers: { Authorization: `token ${getAuthInfo().token}` },
      })
      .then((response) => {
        setCorrectAnswer(response.data.official_solution);
        handleSubmit(response.data.official_solution);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleSubmit = (correct_answer) => {
    //
    // Marks user's answer
    //
    if (selectedOption == correct_answer) {
      props.showResult(true);
      setIsCorrect(true);
    } else {
      props.showResult(false);
      setIsCorrect(false);
    }
    //
    // Retrieves user id to pass to post request
    // Adds user's attempt to attempted questions
    //
    axios
      .get("http://127.0.0.1:8000/api_profiles/", {
        params: { username: username },
        headers: { Authorization: `token ${getAuthInfo().token}` },
      })
      .then((response) => {
        axios
          .post(
            "http://127.0.0.1:8000/api_solutions/",
            {
              creator: parseInt(response.data.id),
              question: props.id,
              solution: selectedOption,
              is_correct: selectedOption == correct_answer ? true : false,
            },
            { headers: { Authorization: `token ${getAuthInfo().token}` } }
          )
          .catch((error) => {
            console.error(error.response.data);
          });
      })
      .catch((error) => {
        console.log(error);
      });
    //
    // Adds to completed_qs DTO for future use
    //
    localStorage.setItem(
      `${props.id}`,
      JSON.stringify({
        question_description: questionDescription.props.text,
        solution: correct_answer,
        selected_option: selectedOption,
      })
    );
    setShowSubmit(false);
  };

  useEffect(() => {
    setIsCorrect(true);
    setInputs(
      options.map((option) => (
        <label key={option}>
          <input
            type="radio"
            value={option}
            name="option"
            defaultChecked={option == selectedOption}
          />
          {option}
        </label>
      ))
    );
  }, [options]);

  useEffect(() => {
    //
    // Re-renders as id passed through props changes
    //
    setShowSubmit(true);
    //
    // Retrieves info on question
    // MVP includes only multiple choice que  stions
    //
    axios
      .get("http://127.0.0.1:8000/api_questions/", {
        params: {
          id: props.id.toString(),
          s_multiple_choices: "",
          s_question_description: "",
        },
        headers: { Authorization: `token ${getAuthInfo().token}` },
      })
      .then((response) => {
        setOptions(response.data.multiple_choices.split(","));

        setQuestionDescription(
          <MathJaxRender text={response.data.question_description} />
        );
      })
      .catch((error) => {
        console.log(error);
      });
    setIsLoaded(true);
  }, [props.id]);

  if (!isLoaded) {
    return <h2>Loading...</h2>;
  } else {
    return (
      <>
        {questionDescription}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            getCorrectAnswer();
          }}
          onChange={(e) => {
            setSelectedOption(e.target.value);
          }}
        >
          {inputs}
          {showSubmit && <button type="Submit">Submit</button>}
        </form>
        {!isCorrect && <h2>The correct answer is {correctAnswer}</h2>}
      </>
    );
  }
}

DoQuestion.propTypes = {
  showResult: PropTypes.func,
  id: PropTypes.number,
};

export default DoQuestion;
