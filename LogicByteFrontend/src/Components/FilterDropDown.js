import React, { useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";

function FilterDropDown(props) {
  const [checked, setChecked] = useState(props.checked);
  const [ticked, setTicked] = useState(false);
  const num_children = Object.keys(props.topicList).length;
  const num_child_selected = useRef(num_children);
  const [toggleDropDown, setToggleDropDown] = useState(false);
  const [value, setValue] = useState(0);
  let btn_text = props.title;

  const showHideDropdown = () => {
    setToggleDropDown(!toggleDropDown);
  };

  function generateChildComps() {
    let child_comps = [];
    for (const key of Object.keys(props.topicList)) {
      if (props.topicList[key] != {}) {
        child_comps.push(
          <FilterDropDown
            title={key}
            topicList={props.topicList[key]}
            key={key}
            checked={checked}
            changeTopic={props.changeTopic}
            updateChildSelected={updateChildSelected}
            value={value}
          />
        );
      }
    }
    return child_comps;
  }

  const updateChildSelected = (n) => {
    num_child_selected.current += n;
    if (num_child_selected.current < 0) {
      num_child_selected.current = 0;
    } else if (num_child_selected.current > num_children) {
      num_child_selected.current = num_children;
    } else {
      if (num_child_selected.current == num_children) {
        setChecked(true);
        setTicked(true);
      }
      if (num_child_selected.current < num_children) {
        setTicked(false);
      }
    }
  };

  useEffect(() => {
    setChecked(props.checked);
  }, [props.checked, props.value]);

  useEffect(() => {
    setTicked(checked);
    if (props.updateChildSelected) {
      if (checked) {
        props.updateChildSelected(1);
      } else {
        props.updateChildSelected(-1);
      }
    }
  }, [checked]);

  return (
    <tr>
      <input
        type="checkbox"
        checked={ticked}
        onChange={null}
        onClick={() => {
          setTicked(!ticked);
          setChecked(!ticked);
          setValue(value + 1);
        }}
      />
      <button onClick={showHideDropdown}>{btn_text}</button>
      <div style={toggleDropDown ? { display: "block" } : { display: "none" }}>
        {generateChildComps()}
      </div>
    </tr>
  );
}

FilterDropDown.propTypes = {
  checked: PropTypes.bool,
  changeTopic: PropTypes.func,
  topicList: PropTypes.object,
  title: PropTypes.string,
  updateChildSelected: PropTypes.func,
  value: PropTypes.number,
};

export default FilterDropDown;
