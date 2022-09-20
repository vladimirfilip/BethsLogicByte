import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import "./filter.css";

function Filter(props) {
  let indent = props.indent;
  if (indent == undefined) {
    indent = 0;
  }
  let indentString = "";
  for (let i = 0; i < indent * 3; i++) {
    indentString += "\u00A0";
  }

  const [folded, setFolded] = useState({});

  useEffect(() => {
    let dict = {};
    props.data.map((x) => {
      dict[x.name] = false;
    });
    setFolded(dict);
  }, []);

  const elements = props.data.map((element) => {
    let hiddenClass = folded[element.name] ? "hidden" : "";

    if (element.subcategories === undefined) {
      return (
        <p
          key={element.name}
          onClick={() => props.callback(element.name)}
          className="pointer"
        >
          {indentString}
          {element.name}
        </p>
      );
    } else {
      return (
        <div key={element.name}>
          <p>
            {indentString}
            <span
              onClick={() =>
                setFolded({ ...folded, [element.name]: !folded[element.name] })
              }
            >
              {folded[element.name] ? "▲ " : "▼ "}
            </span>
            <span
              onClick={() => props.callback(element.name)}
              className="pointer"
            >
              {element.name}
            </span>
          </p>
          <div className={hiddenClass}>
            <Filter
              indent={indent + 1}
              data={element.subcategories}
              callback={props.callback}
            ></Filter>
          </div>
        </div>
      );
    }
  });

  return (
    <>
      {elements}
      {/* <p>&emsp;Hello</p> */}
    </>
  );
}

Filter.propTypes = {
  data: PropTypes.array,
  indent: PropTypes.number,
  hidden: PropTypes.bool,
  callback: PropTypes.func,
};

export default Filter;
