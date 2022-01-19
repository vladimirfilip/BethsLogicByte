import React from "react";
import "./MainNavBar.css";
import logo from "./beths_logo.png";
import { Outlet, Link } from "react-router-dom";

function MainNavBar() {
  return (
    <nav className="nav">
      <div className="col">
        <img alt="Beths logo" className="nav__logo" src={logo} />
      </div>
      <div className="col-lg-4"></div>
      <div class="col">
        <Link to="/">
          <button className="nav__button">Home</button>
        </Link>
      </div>
      <div class="col">
        <Link to="">
          <button className="nav__button">Mathematics</button>
        </Link>
      </div>
      <div class="col">
        <Link to="">
          <button className="nav__button">Physics</button>
        </Link>
      </div>
      <div class="col">
        <Link to="">
          <button className="nav__button">Chemistry</button>
        </Link>
      </div>
      <div class="col">
        <Link to="">
          <button className="nav__button">Biology</button>
        </Link>
      </div>
      <div class="col">
        <Link to="">
          <button className="nav__button">Informatics</button>
        </Link>
      </div>
    </nav>
  );
}

export default MainNavBar;
