import React, { useEffect, useContext } from "react";
import { useState } from "react";
import PropTypes from "prop-types";
import { UsernameContext } from "../router";
import { asyncGETAPI } from "../helpers/asyncBackend";
import "./ProfileDisplay.css";
import Loading from "../helpers/loading";

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
    return () => {
      clearTimeout();
      setPicRef("");
    };
  }, [username]);

  if (!isLoaded) {
    return <Loading />;
  } else {
    return (
      <div className="container profile_display col-md-3">
        <div className="col-sm-12">
          <h1 className="username">{username}</h1>
          <img src={picRef} alt="Profile picture" className="profile_pic"></img>
          <div>
            <h3>Points</h3>
            <p className="profile_info">{numPoints}</p>
            <h3>Rank</h3>
            <p>{rank}</p>
          </div>
          <button
            onClick={() => props.link("my_questions")}
            className="btn btn-outline-info"
          >
            My Questions
          </button>
          <button
            onClick={() => props.link("home")}
            className="btn btn-outline-info"
          >
            My Classes
          </button>
          <button
            onClick={() => props.link("settings")}
            className="btn btn-outline-warning"
          >
            Settings
          </button>
          <button
            onClick={() => props.link("logoff")}
            className="btn btn-outline-danger"
          >
            Log off
          </button>
        </div>
      </div>
    );
  }
}

ProfileDisplay.propTypes = {
  link: PropTypes.func,
};

export default ProfileDisplay;
