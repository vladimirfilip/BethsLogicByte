import React from "react";
import PropTypes from "prop-types";
import ProfileDisplay from "../Components/ProfileDisplay";
import MainNavBar from "../Components/MainNavBar";
import ProblemOfDay from "../Components/ProblemOfDay";
import InfoCard from "../Components/InfoCard";
import triviaContest from "../Components/trivia contest.png";
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
            {/* Example announcement using info card */}
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
            <InfoCard
              date="14/06/2023"
              title="The inaugral Beths Computing Trivia Contest"
              description={
                <div className="container">
                  <div className="row flex-nowrap">
                    <p clasSName="col-xs-8">
                      Today, the Beths Computing Society hosted the Trivia
                      Contest, a nail-biting contest between the best computer
                      scientists at Beths, who fought tooth-and-nail to be
                      crowned the Trivia Content champions. The winning pair was
                      the incredible, spectacular and majestic team Lil G's FC,
                      captained by Vlad Filip, followed by the magnificent,
                      amazing, world-class pair The Europeans, led by Alex
                      Litchev. Vlad and Alex will have the privilege of
                      representing Beths at the inter-school contest, where they
                      will mercilessly obliterate whatever feeble opposition
                      dares to stand in the way of their greatness.
                    </p>
                    <img
                      style={{
                        marginTop: "10px",
                        height: "60%",
                        width: "30%",
                        marginLeft: "15px",
                      }}
                      src={triviaContest}
                      alt={"totally the Beths Trivia Contest"}
                      className="col-xs-4"
                    />
                  </div>
                </div>
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
