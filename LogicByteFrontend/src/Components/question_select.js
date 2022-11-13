import React, { useState, useEffect } from "react";
import axios from "axios";
import { getAuthInfo } from "../helpers/authHelper";
import PropTypes from "prop-types";

function Question_select(props) {
  let [isLoaded, setLoaded] = useState(false);
  let [data, setData] = useState([]);

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

  if (!isLoaded) {
    return <p>Loading</p>;
  } else {
    let children = data.map((x) => {
      return <p key={x.id}>{x.question_description}</p>;
    });
    return <> {children}</>;
    // return <p>{JSON.stringify(data)}</p>;
  }
}

Question_select.propTypes = {
  tags: PropTypes.array,
};

export default Question_select;
