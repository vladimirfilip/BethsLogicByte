import React from "react";
import PropTypes from "prop-types";
import ProfileDisplay from "../Components/ProfileDisplay";

function Home(props) {
  return (
    <>
      <ProfileDisplay link={props.changePage} />
    </>
  );
}

Home.propTypes = {
  changePage: PropTypes.func,
};

export default Home;
