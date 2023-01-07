import React, { useState } from "react";
import PropTypes from "prop-types";

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
      {option}
    </p>
  ));

  return (
    <>
      <button
        onClick={() => {
          setShowDropdown(!showDropdown);
        }}
      >
        {props.filterType}
      </button>
      {showDropdown && optionsInputs}
    </>
  );
}

AuxFilter.propTypes = {
  options: PropTypes.array,
  checks: PropTypes.object,
  filterType: PropTypes.string,
};
export default AuxFilter;
