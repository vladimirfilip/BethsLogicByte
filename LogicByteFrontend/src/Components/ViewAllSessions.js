import React, { useContext, useEffect, useState } from "react";
import { UsernameContext } from "../router";
import ViewSession from "./ViewSession";
import { asyncGETAPI } from "../helpers/asyncBackend";
import "./ViewAllSessions.css";

function ViewAllSessions() {
  const username = useContext(UsernameContext);
  const [prevSessions, setPrevSessions] = useState([]);
  const [currentSession, setCurrentSession] = useState(null);

  const showPrevSessions = async () => {
    let sessionData = await asyncGETAPI("api_user_question_session", {
      user_profile: "",
      s_session_id: "",
      s_score: "",
    });
    if (!Array.isArray(sessionData)) {
      sessionData = [sessionData];
    }
    for (let session of sessionData.reverse()) {
      let day = session.session_id.slice(6, 8);
      let month = session.session_id.slice(4, 6);
      let year = session.session_id.slice(0, 4);
      const sessionDate = `${day}/${month}/${year}`;
      let score = Number(session.score);
      let scoreClasses = "session-score ";
      if (score >= 75) {
        scoreClasses += "good";
      } else if (score >= 40) {
        scoreClasses += "medium";
      } else {
        scoreClasses += "poor";
      }
      setPrevSessions((a) => [
        ...a,
        <button
          className="session-card"
          key={session.session_id}
          onClick={() => setCurrentSession(session.session_id)}
        >{`${sessionDate} session: `}<span className={scoreClasses}><strong>{`${score}%`}</strong></span></button>,
      ]);
    }
  };

  useEffect(() => {
    if (username) {
      showPrevSessions();
    }
  }, [username]);
  const sessionView = (
    <>
      <div className="col-sm-12 col-md-4 my-questions-list">
        <div className="card questions-card">
          {prevSessions}
        </div>
      </div>
      <div className="col-sm-12 col-md-8 my-questions-view">
        <div className="card questions-card">
          {currentSession && <ViewSession sessionId={currentSession} />}
        </div>
      </div>
    </>
  );

  const noSessionView = (
    <>
      <div className="card col-md-12">
        <p>You haven&apos;t attempted any questions</p>
      </div>
    </>
  );

  return (
    <>
      <div className="container container-fluid my-questions-container">
        {prevSessions.length > 0 && 
        <div className="row justify-center">  
          <div className="col stats-card">
            <div className="card">
              <svg viewBox="0 0 500 100" width="500px" height="100px" xmlns="http://www.w3.org/2000/svg" id="graph-svg">
                <path
                  fill="none"
                  stroke="red"
                  d="" 
                />
              </svg>
            </div>
          </div>
        </div>
        }
        <div className="row">
          {prevSessions.length > 0 ? sessionView : noSessionView}        
        </div>
      </div>
    </>
  );
}

export default ViewAllSessions;
