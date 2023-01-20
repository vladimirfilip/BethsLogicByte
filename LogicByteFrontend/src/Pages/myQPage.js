import React from "react";
import MainNavBar from "../Components/MainNavBar";
import PropTypes from "prop-types";
import ViewAllSessions from "../Components/ViewAllSessions";

function MyQPage(props) {
  return (
    <>
      <MainNavBar link={props.changePage} />
      <ViewAllSessions />
    </>
  );
}

MyQPage.propTypes = {
  changePage: PropTypes.func,
};

export default MyQPage;
