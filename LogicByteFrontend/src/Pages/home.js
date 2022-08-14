import React from "react";
import PropTypes from "prop-types";
import ProfileDisplay from "../Components/ProfileDisplay";
import MainNavBar from "../Components/MainNavBar";

function Home(props) {
  return (
    <>
      <MainNavBar link={props.changePage}></MainNavBar>
      <ProfileDisplay link={props.changePage} />
    </>
  );
}

Home.propTypes = {
  changePage: PropTypes.func,
};

export default Home;
