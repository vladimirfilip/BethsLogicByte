import React from "react";
import axios from "axios";
import { useState } from "react";
import useForm from "../helpers/useForm";
import { getAuthInfo } from "../helpers/authHelper";
import isSecurePassword from "../helpers/passwd";

function Settings() {
  const [passwords, handleChange] = useForm({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });
  //
  // If password is correct
  //
  const [isPasswordCorrect, setCorrect] = useState(false);
  //
  // If new password and confirmed password are the same
  //
  const [isConfirmCorrect, setConfirm] = useState(false);
  const [isSecure, setSecure] = useState(true);
  let username = getAuthInfo().username;

  const handleSubmit = (e) => {
    setCorrect(false);

    e.preventDefault();
    //
    // Checks whether password is valid
    //
    console.log(typeof passwords.current_password);
    axios
      .get(
        `http://127.0.0.1:8000/api_check_password/${username}&${passwords.current_password}`,
        {
          headers: {
            Authorization: `token ${getAuthInfo().token}`,
          },
        }
      )
      .then((response) => {
        // setPicRef(response.data.profile_pic);
        if (response.data.result == "good") {
          setCorrect(true);
        } else {
          setCorrect(false);
        }
      })
      .catch((error) => {
        console.error(error.response.data);
      });

    if (isPasswordCorrect) {
      //
      // If the new password is secure
      //
      if (isSecurePassword(passwords.new_password)) {
        setSecure(true);
        //
        // If the new password is equal to confirmation
        //
        if (passwords.new_password == passwords.confirm_password) {
          setConfirm(true);
          //
          // Updates password
          //
          axios
            .put(
              `http://127.0.0.1:8000/api_users/username=${username}`,
              {
                password: passwords.new_password,
              },
              {
                headers: {
                  Authorization: `token ${getAuthInfo().token}`,
                  "Content-Type": "application/json",
                },
              }
            )
            .catch((error) => {
              console.log(error.response);
            });
        } else {
          setConfirm(false);
        }
      } else {
        setSecure(false);
      }
    }
  };

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
          value={passwords.current_password}
          onChange={handleChange}
        ></input>
        {!isSecure && (
          <div>
            <h2>The password should contain:</h2>
            <ul>
              <li>Both lowercase and uppercase characters</li>
              <li>At least one digit</li>
              <li>At least one symbol</li>
              <li>At least eight special characters</li>
            </ul>
          </div>
        )}
        <input
          name="new_password"
          value={passwords.new_password}
          onChange={handleChange}
        ></input>
        {!isConfirmCorrect && <h2>The two password fields did not match</h2>}
        <input
          name="confirm_password"
          value={passwords.confirm_password}
          onChange={handleChange}
        ></input>
        <button onClick={handleSubmit}>Save</button>
      </form>
    </div>
  );
}

export default Settings;
