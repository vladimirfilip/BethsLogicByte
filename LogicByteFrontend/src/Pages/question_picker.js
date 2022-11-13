import React, { useState } from "react";
import Filter from "../Components/filter";
import Question_select from "../Components/question_select";
import PropTypes from "prop-types";

function QuestionPicker(props) {
  let data = [{ name: "trigonometry" }, { name: "numbers" }, {name: "john"}];
  let [tags, setTags] = useState([]);
  // Stops unncecessary rerenders
  // This doesn't allow for data to be updated but there should be no situation where that is necessary anyways
  let [filter] = useState(
    <Filter data={data} callback={(data) => setTags(data)} />
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
};

export default QuestionPicker;
