import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import "./GeneratedQuestion.css";

function GenerateQuestion(props) {
  const [selected, setSelected] = useState(false);

  useEffect(() => {
    console.log(props.selected[props.id]);
  }, [props.selected]);

  return (
    <div
      className="question_card"
      onClick={() => {
        props.updateSelected(props.id);
        setSelected(!selected);
      }}
    >
      <div className="question_header">
        <p className={`tag`}>{props.question_data.exam_board}</p>
        <p
          className={`tag ${props.question_data.difficulty}`}
        >{`Difficulty: ${props.question_data.difficulty}`}</p>
        <p className={`tag`}>{`Points: ${props.question_data.num_points}`}</p>
        <p className={`tag`}>{props.question_data.exam_type}</p>
      </div>
      <div>
        <input type="checkbox" checked={selected}></input>
        <span className="question_text">
          {props.question_data.question_description}
        </span>
      </div>
    </div>
  );
}

export default GenerateQuestion;

GenerateQuestion.propTypes = {
  updateSelected: PropTypes.func,
  selected: PropTypes.object,
  question_data: PropTypes.object,
  id: PropTypes.number,
};
