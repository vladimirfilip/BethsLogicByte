import React from "react";
import PropTypes from "prop-types";

function Question_select(props) {
  return <h1>{props.tags}</h1>;
}

Question_select.propTypes = {
  tags: PropTypes.array,
};

export default Question_select;
