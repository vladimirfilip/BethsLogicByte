import React from "react";
import PropTypes from "prop-types";
import "./multiSelect.css";

function MultiSelect(props) {
  //let options = props.values.map((x) => <option key={x}>{x}</option>);

  return (
    <div className="colour-picker" data-html2canvas-ignore>
      <div
        className={`col-xs-1 black colour-pick ${
          props.selectedValue == "Black" ? "white-selected" : ""
        }`}
        onClick={() => {
          if (props.selectedValue == "Black") {
            props.setSelectedValue(null);
          } else {
            props.setSelectedValue("Black");
          }
        }}
      />
      <div
        className={`col-xs-1 blue colour-pick ${
          props.selectedValue == "Blue" ? "white-selected" : ""
        }`}
        onClick={() => {
          if (props.selectedValue == "Blue") {
            props.setSelectedValue(null);
          } else {
            props.setSelectedValue("Blue");
          }
        }}
      />
      <div
        className={`col-xs-1 red colour-pick ${
          props.selectedValue == "Red" ? "selected" : ""
        }`}
        onClick={() => {
          if (props.selectedValue == "Red") {
            props.setSelectedValue(null);
          } else {
            props.setSelectedValue("Red");
          }
        }}
      />
      <div
        className={`col-xs-1 green colour-pick ${
          props.selectedValue == "Green" ? "white-selected" : ""
        }`}
        onClick={() => {
          if (props.selectedValue == "Green") {
            props.setSelectedValue(null);
          } else {
            props.setSelectedValue("Green");
          }
        }}
      />
      <div
        className={`col-xs-1 yellow colour-pick ${
          props.selectedValue == "Yellow" ? "selected" : ""
        }`}
        onClick={() => {
          if (props.selectedValue == "Yellow") {
            props.setSelectedValue(null);
          } else {
            props.setSelectedValue("Yellow");
          }
        }}
      />
    </div>
  );
}

MultiSelect.propTypes = {
  values: PropTypes.array,
  selectedValue: PropTypes.string,
  setSelectedValue: PropTypes.func,
};

export default MultiSelect;
