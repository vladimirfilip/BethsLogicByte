import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { getAuthInfo } from "../helpers/authHelper";
import PropTypes from "prop-types";
import MathJaxRender from "../helpers/mathJaxRender";
import { UsernameContext } from "../router.js";

function DoQuestion(props) {
  const username = useContext(UsernameContext);
  const [isLoaded, setIsLoaded] = useState(false);

  const [isCorrect, setIsCorrect] = useState(true);
  const [showSubmit, setShowSubmit] = useState(true);
  const [questionDescription, setQuestionDescription] = useState(null);
  //
  // state related to the value of the options and inputs
  //
  const [inputs, setInputs] = useState([]);
  const [options, setOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState("");
  const [correctAnswer, setCorrectAnswer] = useState("");
  //
  // Configures rendering and source of the question image
  //
  const [showQImage, setShowQImage] = useState(false);
  const [imgSrc, setImgSrc] = useState("");
  const [imgLoaded, setImgLoaded] = useState(false);
  //
  // Configures the synchronous sourcing, loading and rendering of images as multiple choice options
  //
  const [optionsLoaded, setOptionsLoaded] = useState(false);
  const [showOptionsImages, setShowOptionsImages] = useState(false);
  const [choiceImgIdx, setChoiceImgIdx] = useState(null);
  const [imgIds, setImgIds] = useState(null);
  const [choiceImgSrc, setChoiceImgSrc] = useState([]);

  const getQImage = () => {
    axios
      .get("http://127.0.0.1:8000/api_question_image/", {
        params: { question: props.id.toString() },
        headers: { Authorization: `token ${getAuthInfo().token}` },
      })
      .then((response) => {
        if (response.data.image) {
          setImgSrc(response.data.image);
          setImgLoaded(true);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getChoicesImages = (img_ids) => {
    //
    // Ensures that images in multiple choice are displayed in the correct order
    //
    img_ids.sort(function (a, b) {
      return a - b;
    });
    setImgIds(img_ids);
    setChoiceImgIdx(0);
  };

  const getCorrectAnswer = () => {
    //
    // Gets only the correct solution
    //
    axios
      .get("http://127.0.0.1:8000/api_questions/", {
        params: { id: props.id.toString(), s_official_solution: "" },
        headers: { Authorization: `token ${getAuthInfo().token}` },
      })
      .then((response) => {
        if (showOptionsImages) {
          setCorrectAnswer(<img src={response.data.official_solution} />);
        } else {
          setCorrectAnswer(
            <MathJaxRender text={response.data.official_solution} />
          );
        }
        handleSubmit(response.data.official_solution);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getTags = () => {
    axios
      .get("http://127.0.0.1:8000/api_questions/", {
        params: {
          id: props.id.toString(),
          s_exam_board: "",
          s_difficulty: "",
          s_exam_type: "",
        },
        headers: { Authorization: `token ${getAuthInfo().token}` },
      })
      .then((response) => {
        props.updateTags(
          response.data.exam_board,
          response.data.difficulty,
          response.data.exam_type
        );
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const addCompletedQ = (correct_answer) => {
    //
    // Adds question attempt to session data stored in database
    //
    axios
      .post(
        "http://127.0.0.1:8000/api_questions_in_session/",
        {
          username: username,
          question_id: props.id,
          question_description: questionDescription.props.text,
          solution: correct_answer,
          selected_option: selectedOption,
          q_image: imgSrc,
          img_options: showOptionsImages,
        },
        { headers: { Authorization: `token ${getAuthInfo().token}` } }
      )
      .catch((error) => console.log(error));
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
    console.log(props.sessionID);

    axios
      .post(
        "http://127.0.0.1:8000/api_solutions/",
        {
          username: username,
          question: props.id,
          solution: selectedOption,
          is_correct: selectedOption == correct_answer ? true : false,
          session_id: props.sessionID,
          question_num: parseInt(localStorage.getItem("currentIdx")) + 1,
        },
        { headers: { Authorization: `token ${getAuthInfo().token}` } }
      )
      .catch((error) => {
        console.error(error.response.data);
      });

    //
    // Adds to completed_qs DTO for future use
    //
    addCompletedQ(correct_answer);

    setShowSubmit(false);
  };

  useEffect(() => {
    if (choiceImgIdx != null) {
      axios
        .get("http://127.0.0.1:8000/api_question_image/", {
          params: {
            id: imgIds[choiceImgIdx].toString(),
            s_image: "",
            s_type: "",
          },
          headers: { Authorization: `token ${getAuthInfo().token}` },
        })
        .then((response) => {
          //
          // question description image must be added first to database
          // then multiple choice images should be added sequentially
          //
          if (response.data.type == "question description") {
            setShowQImage(true);
            setImgSrc(response.data.image);
            setImgLoaded(true);
          } else if (response.data.type == "multiple choice") {
            setChoiceImgSrc((prevSrc) => [...prevSrc, response.data.image]);
          }
          if (choiceImgIdx != imgIds.length - 1) {
            setChoiceImgIdx(choiceImgIdx + 1);
          }
        });
    }
  }, [choiceImgIdx]);

  useEffect(() => {
    if (choiceImgSrc.length > 0) {
      //
      // imgIds includes the id of the image in the question description
      // So the sources for the multiple choice images are one less than the length of imgIds
      //
      if (showQImage) {
        if (choiceImgSrc.length == imgIds.length - 1) {
          setOptions(choiceImgSrc);
        }
      } else {
        if (choiceImgSrc.length == imgIds.length) {
          setOptions(choiceImgSrc);
        }
      }
    }
  }, [choiceImgSrc]);

  useEffect(() => {
    setIsCorrect(true);
    if (showOptionsImages) {
      setInputs(
        options.map((option) => (
          <label key={option}>
            <input
              type="radio"
              value={option}
              name="img_option"
              defaultChecked={option == selectedOption}
            />
            <img src={option} />
          </label>
        ))
      );
    } else {
      setInputs(
        options.map((option) => (
          <label key={option}>
            <input
              type="radio"
              value={option}
              name="txt_option"
              defaultChecked={option == selectedOption}
            />
            {<MathJaxRender text={option} />}
          </label>
        ))
      );
    }
    setOptionsLoaded(true);
  }, [options]);

  useEffect(() => {
    //
    // Re-renders as id passed through props changes
    //
    setShowSubmit(true);
    //
    // Retrieves info on question
    // MVP includes only multiple choice questions
    //
    axios
      .get("http://127.0.0.1:8000/api_questions/", {
        params: {
          id: props.id.toString(),
          s_multiple_choices: "",
          s_question_description: "",
          s_question_images: "",
        },
        headers: { Authorization: `token ${getAuthInfo().token}` },
      })
      .then((response) => {
        setQuestionDescription(
          <MathJaxRender text={response.data.question_description} />
        );
        setShowQImage(false);
        setShowOptionsImages(false);
        if (response.data.question_images.length == 1) {
          setShowQImage(true);
          getQImage();
          setOptions(response.data.multiple_choices.split(","));
        } else if (response.data.question_images.length > 1) {
          setShowOptionsImages(true);
          getChoicesImages(response.data.question_images);
        } else if (response.data.question_images.length == 0) {
          setOptions(response.data.multiple_choices.split(","));
        }
      })
      .catch((error) => {
        console.log(error);
      });

    setSelectedOption("");
    setIsLoaded(true);
    getTags();

    return () => {
      setChoiceImgSrc([]);
      setOptionsLoaded(false);
      setImgLoaded(false);
      setImgSrc("");
    };
  }, [props.id]);

  if (!(isLoaded && optionsLoaded)) {
    return <h2>Loading...</h2>;
  } else {
    return (
      <>
        {questionDescription}
        {showQImage && imgLoaded && <img src={imgSrc}></img>}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            getCorrectAnswer();
          }}
          onChange={(e) => {
            setSelectedOption(e.target.value);
          }}
        >
          {optionsLoaded && inputs}
          {showSubmit && (
            <button data-html2canvas-ignore type="Submit">
              Submit
            </button>
          )}
        </form>
        {!isCorrect && <h2>The correct answer is {correctAnswer}</h2>}
      </>
    );
  }
}

DoQuestion.propTypes = {
  showResult: PropTypes.func,
  id: PropTypes.number,
  updateTags: PropTypes.func,
  sessionID: PropTypes.string,
};

export default DoQuestion;
