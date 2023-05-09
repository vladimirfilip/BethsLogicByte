import React, { useState } from "react";
import PropTypes from "prop-types";
import "./multiSelect.css";

function MultiSelect(props) {
  //let options = props.values.map((x) => <option key={x}>{x}</option>);
  const colours = ["red", "black", "yellow", "green", "blue"];
  const [selected, setSelected] = useState({});

  const updateSelected = (colour) => {
    let newSelected = {};
    for (let c of colours) {
      if (c == colour) {
        newSelected[c] = true;
      } else {
        newSelected[c] = false;
      }
    }
    setSelected(newSelected);
  };

  return (
    <div className="colour-picker">
      <div
        className={`col-xs-1 black colour-pick ${
          selected["black"] ? "white-selected" : ""
        }`}
        onClick={() => {
          props.setSelectedValue("Black");
          updateSelected("black");
        }}
      />
      <div
        className={`col-xs-1 blue colour-pick ${
          selected["blue"] ? "white-selected" : ""
        }`}
        onClick={() => {
          props.setSelectedValue("Blue");
          updateSelected("blue");
        }}
      />
      <div
        className={`col-xs-1 red colour-pick ${
          selected["red"] ? "selected" : ""
        }`}
        onClick={() => {
          props.setSelectedValue("Red");
          updateSelected("red");
        }}
      />
      <div
        className={`col-xs-1 green colour-pick ${
          selected["green"] ? "selected" : ""
        }`}
        onClick={() => {
          props.setSelectedValue("Green");
          updateSelected("green");
        }}
      />
      <div
        className={`col-xs-1 yellow colour-pick ${
          selected["yellow"] ? "selected" : ""
        }`}
        onClick={() => {
          props.setSelectedValue("Yellow");
          updateSelected("yellow");
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
