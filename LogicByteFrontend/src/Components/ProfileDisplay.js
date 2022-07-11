import React, { useEffect } from "react";
import axios from "axios";
import { getAuthInfo } from "../helpers/authHelper";
import { useState } from "react";
import PropTypes from "prop-types";

function ProfileDisplay(props) {
  //const [picRef, setPicRef] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);
  const [numPoints, setNumPoints] = useState(0);
  const [rank, setRank] = useState(1);

  const calcRank = (user_points) => {
    //
    // Users with the same number of points have the same rank
    // Duplicate points are removed by converting user_points to set to account for this
    //
    let current_rank = 1;
    for (let num of user_points) {
      if (num > numPoints) {
        current_rank += 1;
      }
    }
    setRank(current_rank);
  };
  let username = getAuthInfo().username;
  //
  // To set user specific fields in display
  //
  useEffect(() => {
    axios
      .get(`http://127.0.0.1:8000/api_profiles/username=${username}`, {
        headers: {
          Authorization: `token ${getAuthInfo().token}`,
        },
      })
      .then((response) => {
        // setPicRef(response.data.profile_pic);
        setNumPoints(response.data.num_points);
      })
      .catch((error) => {
        console.log(error);
      });
    //
    // Retrieves all user records to calculate rank of user
    //
    axios
      .get("http://127.0.0.1:8000/api_profiles/", {
        headers: {
          Authorization: `token ${getAuthInfo().token}`,
        },
      })
      .then((response) => {
        calcRank(new Set(response.data.map((item) => item.num_points)));
      })
      .catch((error) => {
        console.log(error);
      });

    setIsLoaded(true);
  }, []);

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
