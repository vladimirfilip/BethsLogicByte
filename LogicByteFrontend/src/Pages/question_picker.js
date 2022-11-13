import React, { useState } from "react";
import Filter from "../Components/filter";
import Question_select from "../Components/question_select";

function QuestionPicker() {
  let data = [{ name: "trigonometry" }, { name: "numbers" }];
  let [tags, setTags] = useState([]);
  // Stops unncecessary rerenders
  // This doesn't allow for data to be updated but there should be no situation where that is necessary anyways
  let [filter] = useState(
    <Filter data={data} callback={(data) => setTags(data)} />
  );

  return (
    <>
      {filter}
      <Question_select tags={tags} />
    </>
  );
}

export default QuestionPicker;
