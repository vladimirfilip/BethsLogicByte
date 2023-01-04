import React, { useState } from "react";
import Filter from "./filter";
import QuestionSelect from "./QuestionSelect";
import PropTypes from "prop-types";
import { PHYSICS_FILTER, MATHEMATICS_FILTER } from "../helpers/subjectData";

const AVAILABLE_SUBJECTS = ["Mathematics", "Physics"];

function QuestionPicker(props) {
  let [tags, setTags] = useState([]);
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

  // Stops unncecessary rerenders
  // This doesn't allow for data to be updated but there should be no situation where that is necessary anyways
  let [filter] = useState(
    <Filter
      data={subject_filter_data}
      callback={(data) => setTags(data)}
      subject={props.subject}
    />
  );

  return (
    <>
      <h1>Filter</h1>
      {filter}
      <h1>Questions</h1>
      <QuestionSelect
        tags={tags}
        changePage={props.changePage}
        subject={props.subject}
      />
    </>
  );
}

QuestionPicker.propTypes = {
  changePage: PropTypes.func,
  subject: PropTypes.string,
};

export default QuestionPicker;
