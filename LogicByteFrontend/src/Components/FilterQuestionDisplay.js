import React from "react";
import MathJaxRender from "../helpers/mathJaxRender";
import PropTypes from "prop-types";

function FilterQuestionDisplay(props) {
  const exam_board = props.question_data.exam_board;
  const difficulty = props.question_data.difficulty;
  const points = props.question_data.num_points;
  const exam = props.question_data.exam;

  return (
    <div
      onClick={() => {
        props.question_loader;
      }}
    >
      <p>{`${exam_board}\tDifficulty: ${difficulty}\tPoints: ${points}\t${exam}`}</p>
      <MathJaxRender text={props.question_data.question_description} />
    </div>
  );
}

FilterQuestionDisplay.propTypes = {
  question_data: PropTypes.object,
  question_loader: PropTypes.func,
};

export default FilterQuestionDisplay;
