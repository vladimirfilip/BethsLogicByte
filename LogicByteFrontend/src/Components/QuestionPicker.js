import React, { useState } from "react";
import Filter from "./filter";
import Question_select from "./question_select";
import PropTypes from "prop-types";

function QuestionPicker(props) {
  let [tags, setTags] = useState([]);
  // Stops unncecessary rerenders
  // This doesn't allow for data to be updated but there should be no situation where that is necessary anyways
  let [filter] = useState(
    <Filter data={props.data} callback={(data) => setTags(data)} />
  );

  return (
    <>
      <h1>Filter</h1>
      {filter}
      <h1>Questions</h1>
      <Question_select tags={tags} changePage={props.changePage} />
    </>
  );
}

QuestionPicker.propTypes = {
  changePage: PropTypes.func,
  data: PropTypes.array,
};

export default QuestionPicker;
