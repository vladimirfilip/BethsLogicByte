import React, { useEffect, useContext } from "react";
import { useState } from "react";
import PropTypes from "prop-types";
import { UsernameContext } from "../router";
import { asyncGETAPI } from "../helpers/asyncBackend";

function ProfileDisplay(props) {
  const [picRef, setPicRef] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);
  const [numPoints, setNumPoints] = useState(null);
  const [rank, setRank] = useState(1);

  const username = useContext(UsernameContext);

  const setPoints = async () => {
    const profileData = await asyncGETAPI("api_profiles", { user: "" });
    setNumPoints(profileData.num_points);
    const profilePic = await asyncGETAPI("api_profile_picture", {
      user_profile: "",
    });
    setPicRef(profilePic.image);
    setIsLoaded(true);
  };

  const getRank = async () => {
    const getRank = await asyncGETAPI("api_profiles", { user: "" });
    setRank(getRank.rank);
  };

  useEffect(() => {
    if (username) {
      setPoints();
      getRank();
    }
    return () => {clearTimeout();
    setPicRef("")
  }}, [username]);

  if (!isLoaded) {
    return <h1>Loading...</h1>;
  } else {
    return (
      <div>
        <h1>{username}</h1>
        <img src={picRef} alt="Profile picture"></img>
        <div>
          <h2>Points</h2>
          <p>{numPoints}</p>
          <h2>Rank</h2>
          <p>{rank}</p>
        </div>
        <button onClick={() => props.link("my_questions")}>My Questions</button>
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
