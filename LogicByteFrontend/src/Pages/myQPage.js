import React from "react";
import MainNavBar from "../Components/MainNavBar";
import ViewCompletedQs from "../Components/viewCompletedQs";
import PropTypes from "prop-types";

function MyQPage(props) {
  console.log("good");
  return (
    <>
      <MainNavBar link={props.changePage} />
      <ViewCompletedQs />
    </>
  );
}

MyQPage.propTypes = {
  changePage: PropTypes.func,
};

export default MyQPage;
