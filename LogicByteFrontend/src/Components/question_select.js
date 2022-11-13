import React, { useState, useEffect } from "react";
import axios from "axios";
import { getAuthInfo } from "../helpers/authHelper";
import PropTypes from "prop-types";
import MathJaxRender from "../helpers/mathJaxRender";
import questionIDs from "../helpers/questionIDs";

function Question_select(props) {
  let [isLoaded, setLoaded] = useState(false);
  let [data, setData] = useState([]);
  let [selected, setSelected] = useState({});
  let [filteredData, setFilteredData] = useState([]);

  function start() {
    let x = [];
    for (let i in selected) {
      if (selected[i] == true) {
        x.push(+i);
      }
    }
    questionIDs.ids = x;
    console.log(questionIDs.ids);
    props.changePage("question");
  }

  function containsTags(element) {
    if (props.tags.length == 0) {
      return true;
    }
    let contains = false;
    for (let i = 0; i < props.tags.length; i++) {
      if (element.tag_names.includes(props.tags[i])) {
        contains = true;
      }
    }
    return contains;
  }

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api_questions/", {
        headers: {
          Authorization: `token ${getAuthInfo().token}`,
        },
      })
      .then((response) => {
        setLoaded(true);
        setData(response.data);
        setFilteredData(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    let filtered = data.filter(containsTags);
    let newSelected = JSON.parse(JSON.stringify(selected));
    setFilteredData(filtered);
    for (let i in selected) {
      let found = false;
      for (let j = 0; j < filtered.length; j++) {
        if (filtered[j].id == i) {
          found = true;
        }
      }
      if (found == false) {
        delete newSelected[i];
      }
    }
    setSelected(newSelected);
  }, [props.tags]);

  console.log(selected);

  if (!isLoaded) {
    return <p>Loading</p>;
  } else {
    let children = filteredData.map((x) => {
      return (
        <div key={x.id}>
          <input
            type={"checkbox"}
            onChange={() => {
              setSelected({ ...selected, [x.id]: !selected[x.id] });
            }}
            checked={selected[x.id] != undefined ? selected[x.id] : false}
          ></input>

          <MathJaxRender text={x.question_description} />
        </div>
      );
    });
    return (
      <>
        {children}
        <button onClick={() => start()}>Start</button>
      </>
    );
    // return <p>{JSON.stringify(data)}</p>;
  }
}

Question_select.propTypes = {
  tags: PropTypes.array,
  changePage: PropTypes.func,
};

export default Question_select;
