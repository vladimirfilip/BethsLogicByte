import React from "react";
import PropTypes from "prop-types";
import ProfileDisplay from "../Components/ProfileDisplay";
import MainNavBar from "../Components/MainNavBar";
import ProblemOfDay from "../Components/ProblemOfDay";
import QuestionPicker from "../Components/QuestionPicker";

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
      <ProblemOfDay subject={subject} changePage={props.changePage} />
      <ProfileDisplay link={props.changePage} />
      <QuestionPicker changePage={props.changePage} subject={subject} />
    </>
  );
}

SubjectPage.propTypes = {
  changePage: PropTypes.func,
};

export default SubjectPage;
