import React, { useEffect, useState } from "react";

function FilterDropDown(props) {
  const [showDropDown, setShowDropDown] = useState(false);
  let button_event = null;

  let btn_text = props.title.split("\\")[-1];
  let child_comps = [];

  for (const child of props.children) {
    child_comps.push(child);
  }

  if (child_comps.length > 0) {
    btn_text += "\t /";
    button_event = toggleShowDropdown;
  } else {
    button_event = generateQs;
  }

  const toggleShowDropdown = (e) => {
    e.preventDefault();
    if (showDropDown == false) {
      setShowDropDown(true);
    } else {
      setShowDropDown(false);
    }
  };

  const generateQs = (e) => {
    e.preventDefault();
    if (props.selectTopic) {
      props.selectTopic(props.topic);
    }
  };
  return (
    <>
      <button onClick={button_event}>{btn_text}</button>
      {showDropDown && child_comps}
    </>
  );
}

export default FilterDropDown;
