import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import MathJaxRender from "../helpers/mathJaxRender";
import "../App.css";
import "./DoQuestion.css";
import { asyncGETAPI, asyncPOSTAPI } from "../helpers/asyncBackend";
import "./DoQuestion.css";

function DoQuestion(props) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isCorrect, setIsCorrect] = useState(true);
  const [showSubmit, setShowSubmit] = useState(true);
  const [questionDescription, setQuestionDescription] = useState(null);
  //
  // state related to the value of the options and inputs
  //
  const [inputs, setInputs] = useState([]);
  const [selectedOption, setSelectedOption] = useState("");
  const [correctAnswer, setCorrectAnswer] = useState("");
  //
  // Configures rendering and source of the question image
  //
  const [showQImage, setShowQImage] = useState(false);
  const [imgSrc, setImgSrc] = useState("");

  const [inputsLoaded, setInputsLoaded] = useState(false);
  const [showOptionsImages, setShowOptionsImages] = useState(false);

  const [imgDimensions, setImgDimensions] = useState("");

  const getQImage = async () => {
    const imageData = await asyncGETAPI("api_question_image", {
      question: props.id.toString(),
    });
    const img = new Image();
    img.src = imageData.image;
    if (img.height > img.width) {
      setImgDimensions("tall_img");
    } else {
      setImgDimensions("short_img");
    }
    setImgSrc(imageData.image);
    setShowQImage(true);
  };

  const getChoicesImages = async (img_ids) => {
    //
    // Ensures that images in multiple choice are displayed in the correct order
    //
    img_ids.sort(function (a, b) {
      return a - b;
    });
    let all_inputs = [];
    for (let id of img_ids) {
      console.log(id);
      let qImgData = await asyncGETAPI("api_question_image", {
        id: id.toString(),
        s_image: "",
        s_type: "",
      });
      const img = new Image();
      img.src = qImgData.image;
      if (qImgData.type == "question description") {
        if (img.height > img.width) {
          setImgDimensions("tall_img");
        } else {
          setImgDimensions("short_img");
        }
        setShowQImage(true);
        setImgSrc(qImgData.image);
      } else if (qImgData.type == "multiple choice") {
        let option_class = "";
        if (img.height > img.width) {
          option_class = "option_tall";
        } else {
          option_class = "option_short";
        }
        all_inputs.push(
          <label key={qImgData.image} className="input ">
            <input
              type="radio"
              value={qImgData.image}
              name="img_option"
              defaultChecked={qImgData.image == selectedOption}
            />
            <img src={qImgData.image} className={option_class} />
          </label>
        );
      }
    }
    setInputs(all_inputs);
    setInputsLoaded(true);
  };

  const setTextChoiceInputs = (options) => {
    setInputs(
      options.map((option) => (
        <span key={option} className={"input"}>
          <input
            type="radio"
            value={option}
            name="txt_option"
            className=""
            defaultChecked={option == selectedOption}
          />
          <span className={"txt_option"}>
            {<MathJaxRender text={"\t\t\t\t\t" + option} />}
          </span>
        </span>
      ))
    );
    setInputsLoaded(true);
  };
  const getCorrectAnswer = async () => {
    //
    // Gets only the correct solution
    //
    const correctRes = await asyncGETAPI("api_questions", {
      id: props.id.toString(),
      s_official_solution: "",
    });
    if (showOptionsImages) {
      setCorrectAnswer(<img src={correctRes.official_solution} />);
    } else {
      setCorrectAnswer(<MathJaxRender text={correctRes.official_solution} />);
    }
    handleSubmit(correctRes.official_solution);
  };

  const getTags = async () => {
    const tagParams = {
      id: props.id.toString(),
      s_exam_board: "",
      s_difficulty: "",
      s_exam_type: "",
    };
    const tags = await asyncGETAPI("api_questions", tagParams);
    props.updateTags(tags.exam_board, tags.difficulty, tags.exam_type);
  };

  const addCompletedQ = (correct_answer) => {
    //
    // Adds question attempt to session data stored in database
    //
    const completedData = {
      user_profile: "",
      question_id: props.id,
      question_description: questionDescription.props.text,
      solution: correct_answer,
      selected_option: selectedOption,
      q_image: imgSrc,
      img_options: showOptionsImages,
    };
    const res = asyncPOSTAPI("api_questions_in_session", completedData);
    return res;
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
    const userQData = {
      user_profile: "",
      question: props.id,
      solution: selectedOption,
      is_correct: selectedOption == correct_answer ? true : false,
      session_id: props.sessionID,
      question_num: parseInt(localStorage.getItem("currentIdx")) + 1,
    };
    const res = asyncPOSTAPI("api_solutions", userQData);
    addCompletedQ(correct_answer);
    setShowSubmit(false);
    return res;
  };

  const getQData = async () => {
    const qParams = {
      id: props.id.toString(),
      s_multiple_choices: "",
      s_question_description: "",
      s_question_images: "",
    };
    const qData = await asyncGETAPI("api_questions", qParams);
    return qData;
  };

  useEffect(() => {
    setInputs([]);
    //
    // Re-renders as id passed through props changes
    //
    setShowSubmit(true);
    //
    // Retrieves info on question
    // MVP includes only multiple choice questions
    //

    (async () => {
      const qData = await getQData();
      setQuestionDescription(
        <MathJaxRender text={qData.question_description} />
      );

      let qImages = qData.question_images;

      if (qImages.length == 0) {
        //
        // When there are no images in the question
        //
        setTextChoiceInputs(qData.multiple_choices.split(","));
      } else if (qImages.length == 1) {
        //
        // When there is one image in the question
        // In the question description, only one image is allowed
        //
        getQImage();
        setTextChoiceInputs(qData.multiple_choices.split(","));
      } else {
        //
        // When there are multiple image in a question
        //
        setShowOptionsImages(true);
        getChoicesImages(qData.question_images);
      }

      setSelectedOption("");
      setIsLoaded(true);
      getTags();
    })();

    return () => {
      setShowQImage(false);
      setShowOptionsImages(false);
      setSelectedOption("");
      setImgSrc("");
      setInputs([]);
      setIsLoaded(false);
    };
  }, [props.id]);

  if (!(isLoaded && inputsLoaded)) {
    return <h2>Loading...</h2>;
  } else {
    return (
      <div className="question-card">
        <span className="row question_description">{questionDescription}</span>
        {showQImage && (
          <div className="container justify-content-center justify-self-center">
            <img
              src={imgSrc}
              className={"row img-fluid question_img " + imgDimensions}
            ></img>
          </div>
        )}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            getCorrectAnswer();
          }}
          onChange={(e) => {
            setSelectedOption(e.target.value);
          }}
        >
          <span className="row inputs">{inputs}</span>
          {showSubmit && (
            <button
              data-html2canvas-ignore
              type="Submit"
              className="btn btn-outline-info"
            >
              Submit
            </button>
          )}
        </form>
        {!showSubmit && !isCorrect && (
          <h2>The correct answer is {correctAnswer}</h2>
        )}
      </div>
    );
  }
}

DoQuestion.propTypes = {
  showResult: PropTypes.func,
  id: PropTypes.string,
  updateTags: PropTypes.func,
  sessionID: PropTypes.string,
};

export default DoQuestion;
