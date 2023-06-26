import React from "react";
import PropTypes from "prop-types";
// import ProfileDisplay from "../Components/ProfileDisplay";
import MainNavBar from "../Components/MainNavBar";
import ProblemOfDay from "../Components/ProblemOfDay";
import QuestionPicker from "../Components/QuestionPicker";
import "./subjectPage.css";

function SubjectPage(props) {
  let subject = window.location.pathname.slice(1);
  subject = subject[0].toUpperCase() + subject.slice(1);
  document.title = `LogicByte | ${subject}`;
  if (subject == "Chemistry" || subject == "Biology") {
    return (
      <>
        <MainNavBar link={props.changePage} />
        <div style={{ textAlign: "center", marginTop: "10vh" }}>
          <h1>Coming soon!</h1>

          <h2>The LogicByte team is working hard to deliver this content.</h2>
          <h2>Keep an eye out on this page for updates.</h2>
        </div>
      </>
    );
  }
  return (
    <>
      <MainNavBar link={props.changePage} />
      <div className="container subject_content">
        <div className="row">
          <div className="col-md-1"></div>
          <div className="col-md-10">
            <ProblemOfDay subject={subject} changePage={props.changePage} />
          </div>
        </div>
        <div>
          <div className="col-md-12">
            <QuestionPicker changePage={props.changePage} subject={subject} />
          </div>
        </div>
      </div>
    </>
  );
}

SubjectPage.propTypes = {
  changePage: PropTypes.func,
};

export default SubjectPage;
