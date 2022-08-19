import React, { useEffect, useContext } from "react";
import axios from "axios";
import { getAuthInfo } from "../helpers/authHelper";
import { useState } from "react";
import PropTypes from "prop-types";
import { UsernameContext } from "../router";

function ProfileDisplay(props) {
  //const [picRef, setPicRef] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);
  const [numPoints, setNumPoints] = useState(0);
  const [rank, setRank] = useState(1);

  const username = useContext(UsernameContext);

  const calcRank = (points) => {
    //
    // Gets all user points
    //
    axios
      .get("http://127.0.0.1:8000/api_profiles/", {
        headers: {
          Authorization: `token ${getAuthInfo().token}`,
        },
      })
      .then((response) => {
        //
        // Calculates rank for user
        //
        let user_points = new Set(response.data.map((item) => item.num_points));
        //
        // Users with the same number of points have the same rank
        // Duplicate points are removed by converting user_points to set to account for this
        //
        let current_rank = 1;
        for (let num of user_points) {
          if (num > points) {
            current_rank += 1;
          }
        }
        setRank(current_rank);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  //
  // To set user specific fields in display
  //
  useEffect(() => {
    if (username) {
      axios
        .get(`http://127.0.0.1:8000/api_profiles/`, {
          headers: {
            Authorization: `token ${getAuthInfo().token}`,
          },
          params: { username: username },
        })
        .then((response) => {
          // setPicRef(response.data.profile_pic);
          setNumPoints(response.data.num_points);
          //
          // Waits for numPoints to be updated before calculating rank
          //
          setNumPoints((state) => {
            calcRank(state);
            return state;
          });
        })
        .catch((error) => {
          console.error(error.response.data);
        });
      setIsLoaded(true);
    }
    //
    // cleanup function
    //
    return () => clearTimeout();
  }, [username]);

  if (!isLoaded) {
    return <h1>Loading...</h1>;
  } else {
    return (
      <div>
        <h1>{username}</h1>
        <img src="" alt="Profile picture"></img>
        <div>
          <h2>Points</h2>
          <p>{numPoints}</p>
          <h2>Rank</h2>
          <p>{rank}</p>
        </div>
        <button onClick={() => props.link("home")}>My Questions</button>
        <button onClick={() => props.link("home")}>My Classes</button>
        <button onClick={() => props.link("settings")}>Settings</button>
        <button onClick={() => props.link("logoff")}>Log off</button>
      </div>
    );
  }
}

ProfileDisplay.propTypes = {
  link: PropTypes.func,
};

export default ProfileDisplay;
