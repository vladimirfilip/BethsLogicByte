import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import "./filter.css";

function Filter(props) {
  let indent = props.indent;
  if (indent == undefined) {
    indent = 0;
  }
  let indentString = "";
  for (let i = 0; i < indent; i++) {
    indentString += "\u00A0";
    indentString += "\u00A0";
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

  const elements = props.data.map((x) => {
    let hiddenClass = folded[x.name] ? "hidden" : "";
    if (x.subcategories === undefined) {
      return (
        <p key={x.name}>
          {indentString}
          {x.name}
        </p>
      );
    } else {
      return (
        <div key={x.name}>
          <p
            onClick={() => setFolded({ ...folded, [x.name]: !folded[x.name] })}
          >
            {indentString}
            {x.name}
          </p>
          <div className={hiddenClass}>
            <Filter indent={indent + 1} data={x.subcategories}></Filter>
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
};

export default Filter;
