import React, { useState } from "react";
import PropTypes from "prop-types";
import "./filter.css";

function AuxFilter(props) {
  const options = props.options;
  const [showDropdown, setShowDropdown] = useState(false);

  const optionsInputs = options.map((option) => (
    <p key={option}>
      <input
        type="checkbox"
        onClick={() => {
          let preVal = props.checks.current[props.filterType][option];
          props.checks.current[props.filterType][option] = !preVal;
        }}
      />
      <span className="filter_tag">{option}</span>
    </p>
  ));

  return (
    <>
      <button
        className="btn btn-outline-secondary"
        onClick={() => {
          setShowDropdown(!showDropdown);
        }}
      >
        {props.filterType}
      </button>
      <div className={"aux_tags"}>{showDropdown && optionsInputs}</div>
    </>
  );
}

AuxFilter.propTypes = {
  options: PropTypes.array,
  checks: PropTypes.object,
  filterType: PropTypes.string,
};
export default AuxFilter;
