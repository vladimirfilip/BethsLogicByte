import React from "react";
import PropTypes from "prop-types";

function MultiSelect(props) {
  let options = props.values.map((x) => <option key={x}>{x}</option>);

  return (
    <select
      data-html2canvas-ignore
      value={props.selectedValue}
      onChange={(e) => props.setSelectedValue(e.target.value)}
    >
      {options}
    </select>
  );
}

MultiSelect.propTypes = {
  values: PropTypes.array,
  selectedValue: PropTypes.string,
  setSelectedValue: PropTypes.func,
};

export default MultiSelect;
