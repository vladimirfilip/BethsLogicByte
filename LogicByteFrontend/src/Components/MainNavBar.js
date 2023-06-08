import React, { useState } from "react";
import "./MainNavBar.css";
import "../App.css";
import logo from "./beths_logo.png";
import PropTypes from "prop-types";

function MainNavBar(props) {
  const [showCollapse, setShowCollapse] = useState(false);

  const toggleNav = () => {
    setShowCollapse(!showCollapse);
  };

  return (
    <nav
      className={`navbar navbar-expand-md navbar-light flex-grow-1 justify-content-between ${
        showCollapse ? "flex-wrap" : "flex-nowrap"
      }`}
    >
      <a className="navbar-brand col-lg-1 flex-grow-1">
        <img alt="Beths logo" className={"nav__logo"} src={logo} />
      </a>

      <button
        className="navbar-toggler float-right"
        type="button"
        onClick={() => {
          toggleNav();
        }}
        data-toggle="collapse"
      >
        <span className="navbar-toggler-icon col-lg-9"></span>
      </button>
      <div
        className={`${
          showCollapse ? "show" : ""
        } collapse navbar-collapse col-lg-9 flex-grow-1 justify-content-end`}
        id="navbarNavDropdown"
      >
        <ul className={"navbar-nav me-auto align-self-stretch"}>
          <li>
            <button onClick={() => props.link("home")} className="nav__button">
              Home
            </button>
          </li>
          <li>
            <button
              onClick={() => props.link("Mathematics")}
              className="nav__button"
            >
              Mathematics
            </button>
          </li>
          <li>
            <button
              onClick={() => props.link("Physics")}
              className="nav__button"
            >
              Physics
            </button>
          </li>
          <li>
            <button
              onClick={() => props.link("Chemistry")}
              className="nav__button"
            >
              Chemistry
            </button>
          </li>
          <li>
            <button
              onClick={() => props.link("Biology")}
              className="nav__button"
            >
              Biology
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
}

MainNavBar.propTypes = {
  link: PropTypes.func,
};

export default MainNavBar;
