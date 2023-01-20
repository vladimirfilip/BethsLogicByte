import React from "react";
import "./MainNavBar.css";
import logo from "./beths_logo.png";
import PropTypes from "prop-types";

function MainNavBar(props) {
  return (
    <nav className="nav">
      <div className="col">
        <img alt="Beths logo" className="nav__logo" src={logo} />
      </div>
      <div className="col-lg-4"></div>
      <div className="col">
        <button onClick={() => props.link("home")} className="nav__button">
          Home
        </button>
      </div>
      <div className="col">
        <button
          onClick={() => props.link("Mathematics")}
          className="nav__button"
        >
          Mathematics
        </button>
      </div>
      <div className="col">
        <button onClick={() => props.link("Physics")} className="nav__button">
          Physics
        </button>
      </div>
      <div className="col">
        <button onClick={() => props.link("Chemistry")} className="nav__button">
          Chemistry
        </button>
      </div>
      <div className="col">
        <button onClick={() => props.link("Biology")} className="nav__button">
          Biology
        </button>
      </div>
      <div className="col">
        <button
          onClick={() => props.link("Informatics")}
          className="nav__button"
        >
          Informatics
        </button>
      </div>
    </nav>
  );
}

MainNavBar.propTypes = {
  link: PropTypes.func,
};

export default MainNavBar;
