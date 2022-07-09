import React from "react";
import axios from "axios";
import { useState } from "react";
import useForm from "../helpers/useForm";
import { getAuthInfo } from "../helpers/authHelper";

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

  let username = getAuthInfo().username;
  const verifyPassword = (password) => {
    if (password != passwords.current_password) {
      setCorrect(false);
    }
    setCorrect(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    //
    // Retrieves password of user
    //
    axios
      .get(`http://127.0.0.1:8000/api_users/username=${username}`, {
        headers: {
          Authorization: `token ${getAuthInfo().token}`,
        },
      })
      .then((response) => {
        verifyPassword(response.data.password);
      })
      .catch((error) => {
        console.log(error);
      });

    if (isPasswordCorrect) {
      //
      // If new password and confirmed password are equal
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
        //
        // Resets only new password fields (current_password already been checked)
        //
        handleChange({
          current_password: passwords.current_password,
          new_password: "",
          confirm_password: "",
        });
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
