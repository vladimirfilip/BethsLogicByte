import React, { useState, useRef } from "react";
import useForm from "../helpers/useForm";
import axios from "axios";
import PropTypes from "prop-types";

function Login(props) {
  const [values, handleChange] = useForm({ username: "", password: "" });
  const [showIncorrectDetails, setShowIncorrectDetails] = useState(false);
  const usernameForm = useRef(null);

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
        values.username = "";
        values.password = "";
        usernameForm.current.focus();
        setShowIncorrectDetails(true);
      });
  };

  return (
    <>
      <div className="container container-fluid">
        <div className="row">
          <div className="col">
            <div className="card login-card round-border">
              <h1 className="h2-signin-heading">Login</h1>
              <form className="form-signin">
                <input
                  name="username"
                  ref={usernameForm}
                  value={values.username}
                  onChange={handleChange}
                  required
                  placeholder="Username"
                  className="form-entry"
                  autoFocus
                />
                <input
                  name="password"
                  type="password"
                  value={values.password}
                  onChange={handleChange}
                  required
                  className="form-entry"
                  placeholder="Password"
                ></input>
                <button type="submit" className="btn-signin round-border" onClick={handleSubmit}>
                  Submit
                </button>
                {showIncorrectDetails && <p className="p-signin-error">Incorrect username or password</p>}
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

Login.propTypes = {
  logIn: PropTypes.func,
};

export default Login;
