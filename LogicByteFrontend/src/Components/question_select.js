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

  function start() {
    let x = [];
    for (let i in selected) {
      if (selected[i] == true) {
        x.push(+i);
      }
    }
    questionIDs.ids = x;
    props.changePage("question");
  }

  useEffect(() => {
    let x = [];
    if (props.tags.length == 0) {
      axios
        .get("http://127.0.0.1:8000/api_questions/", {
          headers: {
            Authorization: `token ${getAuthInfo().token}`,
          },
        })
        .then((response) => {
          setLoaded(true);
          setData(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    }

    for (let i = 0; i < props.tags.length; i++) {
      axios
        .get(
          "http://127.0.0.1:8000/api_questions/?tag_names=" + props.tags[i],
          {
            headers: {
              Authorization: `token ${getAuthInfo().token}`,
            },
          }
        )
        .then((response) => {
          setLoaded(true);
          console.log(response.data);
          if (response.data.length !== undefined) {
            x = [...x, ...response.data];
          } else {
            x = [...x, response.data];
          }
          setData(x);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [props.tags]);

  useEffect(() => {
    let selectedx = {};
    for (let i = 0; i < data.length; i++) {
      selectedx[data[i].id] = false;
    }
    setSelected(selectedx);
  }, [data]);

  if (!isLoaded) {
    return <p>Loading</p>;
  } else {
    let children = data.map((x) => {
      let value;
      if (selected[x.id] == undefined) {
        value = false;
      } else {
        value = selected[x.id];
      }
      return (
        <div key={x.id}>
          <input
            type={"checkbox"}
            onChange={() => {
              setSelected({ ...selected, [x.id]: !selected[x.id] });
            }}
            checked={value}
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
