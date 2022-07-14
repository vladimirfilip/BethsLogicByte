import React from "react";
import axios from "axios";
import { useState } from "react";
import { useEffect } from "react";
import useForm from "../helpers/useForm";
import { getAuthInfo } from "../helpers/authHelper";
import isSecurePassword from "../helpers/passwd";
import PropTypes from "prop-types";

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
  //
  // If new password and confirmed password are the same
  //
  const [isConfirmCorrect, setConfirm] = useState(true);
  const [isSecure, setSecure] = useState(true);
  //
  // secureMsg stores error messages passed from isSecurePassword
  //
  const [secureMsg, setSecureMsg] = useState([]);

  let username = getAuthInfo().username;

  const checkPassword = () => {
    //
    // Checks whether user correctly entered current password
    //
    axios
      .get(
        `http://127.0.0.1:8000/api_check_password/`,
        {
          params: { username: username, password: passwords.current_password },
        },
        {
          headers: {
            Authorization: `token ${getAuthInfo().token}`,
          },
        }
      )
      .then((response) => {
        if (response.data.result == "good") {
          setCorrect(true);
        } else {
          setCorrect(false);
        }
      })
      .catch((error) => {
        console.error(error.response.data);
      });
  };

  const updatePassword = () => {
    axios
      .put(
        `http://127.0.0.1:8000/api_users/`,
        {
          password: passwords.new_password,
        },
        {
          params: {
            username: username,
          },
          headers: {
            Authorization: `token ${getAuthInfo().token}`,
            "Content-Type": "application/json",
          },
        }
      )
      .catch((error) => {
        console.error(error.response.data);
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    checkPassword();
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
      <h2>{username}</h2>
      {/* Image field not yet added to user model */}
      <img alt="profile picture"></img>
      <h3>Change password</h3>
      {!isPasswordCorrect && <h2>Incorrect password</h2>}
      <form>
        <input
          name="current_password"
          type="password"
          value={passwords.current_password}
          onChange={handleChange}
        ></input>
        {!isSecure && <ul>{secureMsg}</ul>}
        <input
          name="new_password"
          type="password"
          value={passwords.new_password}
          onChange={handleChange}
        ></input>
        {!isConfirmCorrect && <h2>Re-enter the password correctly</h2>}
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
