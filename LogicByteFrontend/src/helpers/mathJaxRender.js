import MathJax from "react-mathjax";
import React from "react";
import PropTypes from "prop-types";

function MathJaxRender(props) {
  //
  // Delimiters:
  // \( \) for inline
  // \[ \] for block
  //
  const inline = {
    "\\(": true,
    "\\[": false,
  };
  const end_delimiters = ["\\)", "\\]"];
  const text = props.text;
  //
  // Text is formatted as list with text and Mathjax nodes
  //
  let parsed_text = [];
  //
  // last_slice = start of plain text
  // idx = end of plain text / start of MathJax
  // next_slice = end of MathJax
  //
  let idx = 0;
  let last_slice = 0;
  while (idx < text.length - 1) {
    if (text[idx] + text[idx + 1] in inline) {
      //
      // Finds end of MathJax expression
      //
      let next_slice = idx + 1;
      while (
        !end_delimiters.includes(text[next_slice] + text[next_slice + 1])
      ) {
        if (next_slice + 1 === text.length - 1) {
          break;
        }
        next_slice += 1;
      }
      //
      // Adds plain text
      //
      parsed_text.push(text.slice(last_slice, idx));
      //
      // Adds rendered MathJax (exluding delimiters)
      // inline is set to true is delimiter is \( and false if \[
      //
      parsed_text.push(
        <MathJax.Node
          key={idx}
          inline={inline[text[idx] + text[idx + 1]]}
          formula={text.slice(idx + 2, next_slice)}
        />
      );
      //
      // last_slice is set to start of plain text after expression
      //
      last_slice = next_slice + 2;
      idx = last_slice;
    } else {
      idx += 1;
    }
  }
  //
  // Appends remaining plain text
  //
  if (idx !== last_slice) {
    parsed_text.push(text.slice(last_slice, idx + 1));
  }
  if (parsed_text.length === 0) {
    return text;
  } else {
    return <MathJax.Provider>{parsed_text}</MathJax.Provider>;
  }
}

MathJaxRender.propTypes = {
  text: PropTypes.string,
};

export default MathJaxRender;
