import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import "./filter.css";

function Filter(props) {
  let children = props.data.map((x) => {
    return <FilterParent key={x.name} data={x} />;
  });

  return children;
}

function FilterParent(props) {
  const callback = (name) => {
    let copy = JSON.parse(JSON.stringify(data));
    recursionSearch(copy, name);
    recursionCheck(copy);
    setData(copy);
  };

  function recursionSearch(data, name) {
    if (data.name !== name) {
      if (data.subcategories !== undefined) {
        for (let i = 0; i < data.subcategories.length; i++) {
          recursionSearch(data.subcategories[i], name);
        }
      }
    } else {
      recursionDownSet(data, !data.checked);
    }
  }

  function recursionDownSet(data, value) {
    data.checked = value;
    if (data.subcategories !== undefined) {
      for (let i = 0; i < data.subcategories.length; i++) {
        recursionDownSet(data.subcategories[i], value);
      }
    }
  }

  function recursionCheck(data) {
    if (data.subcategories !== undefined) {
      let allTrue = true;
      for (let i = 0; i < data.subcategories.length; i++) {
        if (data.subcategories[i].checked !== true) {
          allTrue = false;
        }
      }
      if (allTrue === true && data.checked === false) {
        data.checked = true;
        setX(x + 1);
      } else if (allTrue === false && data.checked === true) {
        data.checked = false;
        setX(x + 1);
      }
      for (let i = 0; i < data.subcategories.length; i++) {
        recursionCheck(data.subcategories[i]);
      }
    }
  }

  function saturateData(data) {
    data.checked = false;
    if (data.subcategories !== undefined) {
      for (let i = 0; i < data.subcategories.length; i++) {
        data.subcategories[i] = saturateData(data.subcategories[i]);
      }
    }
    return data;
  }

  let [data, setData] = useState(saturateData(props.data));
  let [x, setX] = useState(0);

  useEffect(() => {
    let copy = JSON.parse(JSON.stringify(data));
    recursionCheck(copy);
    setData(copy);
  }, [x]);

  return <FilterNode data={data} callback={(name) => callback(name)} />;
}

function FilterNode(props) {
  let [hidden, setHidden] = useState(false);

  let indentString = "";

  if (props.depth !== undefined) {
    for (let i = 0; i < props.depth * 3; i++) {
      indentString += "\u00A0";
    }
  }

  let children;
  if (props.data.subcategories !== undefined) {
    children = props.data.subcategories.map((x) => {
      return (
        <FilterNode
          key={x.name}
          data={x}
          callback={(name) => props.callback(name)}
          depth={props.depth !== undefined ? props.depth + 1 : 1}
        />
      );
    });
  }

  return (
    <>
      <p>
        {indentString}
        {props.data.subcategories !== undefined ? (
          <span onClick={() => setHidden(!hidden)}>{hidden ? "▲ " : "▼ "}</span>
        ) : (
          "\u00A0\u00A0\u00A0\u00A0"
        )}
        <input
          type={"checkbox"}
          checked={props.data.checked}
          onChange={() => props.callback(props.data.name)}
        ></input>
        {props.data.name}
      </p>
      <div className={hidden ? "hidden" : ""}>{children}</div>
    </>
  );
}

FilterNode.propTypes = {
  data: PropTypes.object,
  callback: PropTypes.func,
  depth: PropTypes.number,
};

FilterParent.propTypes = {
  data: PropTypes.object,
};

Filter.propTypes = {
  data: PropTypes.array,
};

export default Filter;
