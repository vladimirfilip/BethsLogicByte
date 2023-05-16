import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import AuxFilter from "./AuxFilter";
import "./filter.css";
import { SUBJECT_AUX_FILTERS } from "../helpers/subjectData";
import Loading from "../helpers/loading";

function Filter(props) {
  const prevTags = useRef([]);
  const filterChecks = useRef([]);
  const tags = useRef({});
  const [auxFilters, setAuxFilters] = useState([]);
  const [children, setChildren] = useState([]);
  const [currentSubject, setCurrentSubject] = useState(null);

  let update = () => {
    let arr = [];
    let tagsEqual = true;
    let new_tags = [];
    //
    // Adds the tags in filter component
    //
    arr.push(",");
    for (let i in tags.current) {
      for (let j = 0; j < tags.current[i].length; j++) {
        let currentTag = tags.current[i][j];
        arr.length == 1 ? arr.push(currentTag) : arr.push("|" + currentTag);
        new_tags.push(currentTag);
        if (!prevTags.current.includes(currentTag)) {
          tagsEqual = false;
        }
      }
    }
    if (arr[arr.length - 1] == ",") {
      arr.pop();
    }
    //
    // Adds all the tags in the auxiliary filters
    //
    for (let filterType in filterChecks.current) {
      arr.push(",");
      for (let tag in filterChecks.current[filterType]) {
        if (filterChecks.current[filterType][tag]) {
          arr[arr.length - 1] == "," ? arr.push(tag) : arr.push("|" + tag);
          new_tags.push(tag);
          if (!prevTags.current.includes(tag)) {
            tagsEqual = false;
          }
        }
      }
    }
    //
    // Updates filtered questions only if new tags selected
    //
    if (!(tagsEqual && prevTags.current.length == new_tags.length)) {
      prevTags.current = new_tags;
      props.callback(arr);
    }
  };

  useEffect(() => {
    tags.current = {};
    setChildren(
      props.data.map((x) => {
        tags.current[x.name] = [];
        let callback = (arr) => {
          if (arr !== undefined) {
            tags.current[x.name] = arr;
          } else if (arr === undefined) {
            tags.current[x.name] = [];
          }
        };
        return (
          <FilterParent
            key={x.name}
            data={x}
            callback={(arr) => callback(arr)}
          />
        );
      })
    );
  }, [props.data]);

  useEffect(() => {
    //
    // Creates the auxiliary filters for additional filtering
    //
    const auxFilterData = SUBJECT_AUX_FILTERS[props.subject];
    for (const filterType of Object.keys(auxFilterData)) {
      filterChecks.current[filterType] = {};
      for (const tag of auxFilterData[filterType]) {
        filterChecks.current[filterType][tag] = false;
      }
      setAuxFilters((auxFilters) => [
        ...auxFilters,
        <AuxFilter
          key={filterType}
          options={auxFilterData[filterType]}
          checks={filterChecks}
          filterType={filterType}
        />,
      ]);
    }
    //
    // Creates a filter for difficulty, which is common to all subjects
    //
    const difficulties = ["Easy", "Medium", "Hard", "Challenge"];
    filterChecks.current["Difficulty"] = {};
    for (const difficulty of difficulties) {
      filterChecks.current["Difficulty"][difficulty] = false;
    }
    setAuxFilters((auxFilters) => [
      ...auxFilters,
      <AuxFilter
        key="difficulties"
        options={difficulties}
        checks={filterChecks}
        filterType={"Difficulty"}
      />,
    ]);

    return () => {
      setAuxFilters([]);
    };
  }, [props.subject]);

  useEffect(() => {
    setCurrentSubject(props.subject);
  }, [children, auxFilters]);

  if (currentSubject == props.subject) {
    return (
      <div className="filter">
        <button onClick={update} className="btn btn-primary">
          Apply filter
        </button>
        <span className="filter_tree">{children}</span>
        <span className="aux_filters">{auxFilters}</span>
      </div>
    );
  } else {
    return <Loading />;
  }
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

  function recursiveGetChecked(data) {
    if (data.subcategories === undefined) {
      if (data.checked) {
        return [data.name];
      }
    } else {
      let x = [];
      for (let i = 0; i < data.subcategories.length; i++) {
        let z = recursiveGetChecked(data.subcategories[i]);
        if (z != undefined) {
          if (z.length !== 0) {
            x = [...x, ...z];
          }
        }
      }

      if (data.checked) {
        return [data.name, ...x];
      } else {
        return x;
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

  useEffect(() => {
    setData(saturateData(props.data));
  }, [props.data]);

  useEffect(() => {
    props.callback(recursiveGetChecked(data));
  }, [data]);

  return <FilterNode data={data} callback={(name) => callback(name)} />;
}

function FilterNode(props) {
  let [hidden, setHidden] = useState(true);

  let indentString = "";

  if (props.depth !== undefined) {
    for (let i = 0; i < props.depth * 3; i++) {
      indentString += "\u00A0\u00A0";
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
      <p className="filter_node">
        {indentString}
        {props.data.subcategories !== undefined ? (
          <span onClick={() => setHidden(!hidden)}>{hidden ? "▲ " : "▼ "}</span>
        ) : (
          "\u00A0\u00A0\u00A0\u00A0"
        )}
        <span>
          <input
            type={"checkbox"}
            checked={props.data.checked}
            onChange={() => {
              props.callback(props.data.name);
            }}
            className="filter_input"
          ></input>
          <span className="filter_tag">{props.data.name}</span>
        </span>
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
  callback: PropTypes.func,
};

Filter.propTypes = {
  data: PropTypes.array,
  callback: PropTypes.func,
  subject: PropTypes.string,
  setLoaded: PropTypes.func,
};

export default Filter;
