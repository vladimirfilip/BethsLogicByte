import React, { useState } from "react";
import useForm from "../helpers/useForm";
import axios from "axios";
import PropTypes from "prop-types";

function Login(props) {
  const [values, handleChange] = useForm({ username: "", password: "" });
  const [showIncorrectDetails, setShowIncorrectDetails] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    getToken(values.username, values.password);
  };

  const getToken = async (username, password) => {
    axios
      .post("http://127.0.0.1:8000/api_token_auth/", {
        username: username,
        password: password,
      })
      .then((response) => {
        props.logIn(username, response.data.token);
      })
      .catch(() => {
        setShowIncorrectDetails(true);
      });
  };

  return (
    <>
      <h1>Login</h1>
      {showIncorrectDetails && <h2>Incorrect username and/or password</h2>}
      <form>
        <input
          name="username"
          style={{ display: "block" }}
          value={values.username}
          onChange={handleChange}
        ></input>
        <input
          name="password"
          type="password"
          value={values.password}
          onChange={handleChange}
        ></input>
        <button type="submit" onClick={handleSubmit}>
          Submit
        </button>
      </form>
    </>
  );
}

Login.propTypes = {
  logIn: PropTypes.func,
};

export default Login;
