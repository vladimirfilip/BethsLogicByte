import React, { useContext } from "react";
import { useState, useEffect } from "react";
import useForm from "../helpers/useForm";
import MainNavBar from "../Components/MainNavBar";
import isSecurePassword from "../helpers/passwd";
import PropTypes from "prop-types";
import {
  asyncDELETEAPI,
  asyncGETAPI,
  asyncPUTAPI,
} from "../helpers/asyncBackend";
import { UsernameContext } from "../router";
import ProfilePicInput from "../Components/ProfilePicInput";
import axios from "axios";
import { getAuthInfo } from "../helpers/authHelper";

function Settings(props) {
  const [passwords, handleChange] = useForm({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });
  //
  // isPasswordCorrect originally set to true to prevent showing error message
  // but ensures password is entered
  //
  const [isPasswordCorrect, setCorrect] = useState(true);
  const username = useContext(UsernameContext);
  //
  // If new password and confirmed password are the same
  //
  const [isConfirmCorrect, setConfirm] = useState(true);
  const [isSecure, setSecure] = useState(true);
  //
  // secureMsg stores error messages passed from isSecurePassword
  //
  const [secureMsg, setSecureMsg] = useState([]);
  const [newProfilePic, setNewProfilePic] = useState("");

  const checkPassword = async () => {
    //
    // Checks whether user correctly entered current password
    //
    const result = await asyncGETAPI("api_check_password", {
      username: username,
      password: passwords.current_password,
    });
    if (result.result == "good") {
      setCorrect(true);
    } else {
      setCorrect(false);
    }
  };

  const updatePassword = async () => {
    await asyncPUTAPI(
      "api_users",
      { username: username },
      { password: passwords.new_password }
    );
  };

  const updateProfilePic = async () => {
    await asyncDELETEAPI("api_profile_picture", { user_profile: "" });
    await axios
      .post(
        "http://127.0.0.1:8000/api_profile_picture/",
        {
          user_profile: `${getAuthInfo().token}`,
          image: newProfilePic,
        },
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `token ${getAuthInfo().token}`,
          },
        }
      )
      .catch((err) => console.error(err));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newProfilePic != "") {
      (async () => {
        await updateProfilePic();
        if (
          passwords.new_password == "" &&
          passwords.current_password == "" &&
          passwords.confirm_password == ""
        ) {
          props.changePage("home");
        }
      })();
    }
    if (passwords.current_password != "") {
      checkPassword();
    }
    if (isPasswordCorrect && passwords.current_password != "") {
      //
      // Receives any error messages
      //
      let secure_result = isSecurePassword(passwords.new_password);
      if (secure_result.length == 0) {
        setSecure(true);
        //
        // If the new password is equal to confirmation
        //
        if (passwords.new_password == passwords.confirm_password) {
          setConfirm(true);
          updatePassword();
          props.changePage("home");
        } else {
          setConfirm(false);
        }
      } else {
        setSecure(false);
        //
        // Displays each individual error message
        //
        setSecureMsg(
          secure_result.map((result) => <li key={result}>{result}</li>)
        );
      }
    }
  };
  //
  // cleanup function
  //
  useEffect(() => {
    return () => clearTimeout();
  }, []);

  return (
    <div>
      <MainNavBar link={props.changePage}></MainNavBar>
      <h2>{username}</h2>
      <ProfilePicInput setProfilePic={setNewProfilePic} />
      <h3>Change password</h3>
      <h4>Enter your current password</h4>
      {!isPasswordCorrect && <h2>Incorrect password</h2>}
      <form>
        <input
          name="current_password"
          type="password"
          value={passwords.current_password}
          onChange={handleChange}
        ></input>
        {!isSecure && <ul>{secureMsg}</ul>}
        <h4>Enter your new password</h4>
        <input
          name="new_password"
          type="password"
          value={passwords.new_password}
          onChange={handleChange}
        ></input>
        {!isConfirmCorrect && <h2>Re-enter the password correctly</h2>}
        <h4>Confirm your new password</h4>
        <input
          name="confirm_password"
          type="password"
          value={passwords.confirm_password}
          onChange={handleChange}
        ></input>
        <button onClick={handleSubmit}>Save</button>
      </form>
    </div>
  );
}

Settings.propTypes = {
  changePage: PropTypes.func,
};

export default Settings;
