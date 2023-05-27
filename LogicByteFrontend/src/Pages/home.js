import React from "react";
import PropTypes from "prop-types";
import ProfileDisplay from "../Components/ProfileDisplay";
import MainNavBar from "../Components/MainNavBar";
import ProblemOfDay from "../Components/ProblemOfDay";
import InfoCard from "../Components/InfoCard";
import "./home.css";

function Home(props) {
  return (
    <div className="home">
      <MainNavBar link={props.changePage}></MainNavBar>
      <div className="container home_content">
        <div className="row home">
          <div className="col-md-3">
            <ProfileDisplay link={props.changePage} />
          </div>
          <div className="home_sub_content col-md-9">
            <ProblemOfDay subject={""} changePage={props.changePage} />
            <InfoCard
              date="13/05/2023"
              title="New issue of CS Uncovered released!"
              description={
                <p>
                  Read the brand new issue of the CS Uncovered by the Beths
                  Computing Society. You can access it from the Beths website:{" "}
                  <span>
                    <a href="https://www.beths.bexley.sch.uk/page/?title=CS+Uncovered%2D+Computing+newsletter&pid=413">
                      CS Uncovered
                    </a>
                  </span>
                </p>
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}

Home.propTypes = {
  changePage: PropTypes.func,
};

export default Home;
