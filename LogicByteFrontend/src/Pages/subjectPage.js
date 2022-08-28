import React from "react";
import PropTypes from "prop-types";
import ProfileDisplay from "../Components/ProfileDisplay";
import MainNavBar from "../Components/MainNavBar";
import ProblemOfDay from "../Components/ProblemOfDay";

function SubjectPage(props) {
  let subject = window.location.pathname.slice(1);
  subject = subject[0].toUpperCase() + subject.slice(1);

  if (subject == "Informatics") {
    return (
      <>
        <MainNavBar link={props.changePage} />
        <h1>Coming soon!</h1>
      </>
    );
  }
  return (
    <>
      <MainNavBar link={props.changePage} />
      <ProblemOfDay
        data={[
          {
            title: `${subject} Problem of the Day`,
            description:
              "Description for any random question for some subject.",
          },
        ]}
      />
      <ProfileDisplay link={props.changePage} />
    </>
  );
}

SubjectPage.propTypes = {
  changePage: PropTypes.func,
};

export default SubjectPage;
