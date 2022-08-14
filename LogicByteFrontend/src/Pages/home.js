import React from "react";
import PropTypes from "prop-types";
import ProfileDisplay from "../Components/ProfileDisplay";
import MainNavBar from "../Components/MainNavBar";
import ProblemOfDay from "../Components/ProblemOfDay";

function Home(props) {
  return (
    <>
      <MainNavBar link={props.changePage}></MainNavBar>
      <ProblemOfDay
        data={[
          {
            title: "Problem of the day",
            description:
              "Description for any random question for some subject.",
          },
        ]}
      />
      <ProfileDisplay link={props.changePage} />
    </>
  );
}

Home.propTypes = {
  changePage: PropTypes.func,
};

export default Home;
