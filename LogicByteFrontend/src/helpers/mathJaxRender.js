import { MathJax } from "better-react-mathjax";
import React from "react";
import PropTypes from "prop-types";

function MathJaxRender(props) {
  //
  // inline dynamic is needed for formatting of equations in multiple choices
  //
  return (
    <MathJax inline dynamic hideUntilTypeset={"first"}>
      {props.text}
    </MathJax>
  );
}

MathJaxRender.propTypes = {
  text: PropTypes.string,
};

export default MathJaxRender;
