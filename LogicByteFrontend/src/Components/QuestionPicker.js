import React, { useEffect, useState, useRef } from "react";
import Filter from "./filter";
import QuestionSelect from "./QuestionSelect";
import PropTypes from "prop-types";
import { PHYSICS_FILTER, MATHEMATICS_FILTER } from "../helpers/subjectData";
import "./QuestionPicker.css";

const AVAILABLE_SUBJECTS = ["Mathematics", "Physics"];

function QuestionPicker(props) {
  let [tags, setTags] = useState([]);
  const [height, setHeight] = useState(0);
  const [filterLoaded, setFilterLoaded] = useState(false);
  let currentHeight = useRef(0);

  let subject_filter_data = null;
  if (!AVAILABLE_SUBJECTS.includes(props.subject)) {
    return <h1>Coming soon!</h1>;
  }
  switch (props.subject) {
    case "Mathematics":
      subject_filter_data = MATHEMATICS_FILTER;
      break;
    case "Physics":
      subject_filter_data = PHYSICS_FILTER;
      break;
  }
  useEffect(() => {
    setTags([]);
  }, [props.subject]);

  useEffect(() => {
    if (filterLoaded) {
      setHeight(currentHeight.current.clientHeight);
    }
  }, [filterLoaded]);

  return (
    <div className={"row question_picker"}>
      <div
        className={"col-md-3 justify-content-center filter_col"}
        ref={currentHeight}
      >
        <h1 className="row justify-content-center">Filter</h1>
        <Filter
          className="row"
          data={subject_filter_data}
          callback={(data) => setTags(data)}
          subject={props.subject}
          setFilterLoaded={setFilterLoaded}
        />
      </div>
      <div className={"col-md-9"}>
        <h1 className="row justify-content-center">Questions</h1>
        <QuestionSelect
          className="row"
          tags={tags}
          changePage={props.changePage}
          subject={props.subject}
          height={height}
        />
      </div>
    </div>
  );
}

QuestionPicker.propTypes = {
  changePage: PropTypes.func,
  subject: PropTypes.string,
};

export default QuestionPicker;
