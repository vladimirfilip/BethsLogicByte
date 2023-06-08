import React, { useContext, useEffect, useState } from "react";
import { UsernameContext } from "../router";
import ViewSession from "./ViewSession";
import { asyncGETAPI } from "../helpers/asyncBackend";
import "./ViewAllSessions.css";
import QuestionStats from "./QuestionStats";

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
        >
          {`${sessionDate} session: `}
          <span className={scoreClasses}>
            <strong>{`${score}%`}</strong>
          </span>
        </button>,
      ]);
    }
  };

  const currentSessionSelected = (
    <>
      <div className="col-sm-12 col-md-8 px-4 my-questions-view">
        <div className="card questions-card">
          {currentSession && <ViewSession sessionId={currentSession} />}
        </div>
      </div>
    </>
  );

  const noCurrentSessionSelected = (
    <>
      <div className="col-sm-12 col-md-8 px-4 my-questions-view">
        <div className="card questions-card height-fill" />
      </div>
    </>
  );

  useEffect(() => {
    if (username) {
      showPrevSessions();
    }
  }, [username]);
  const sessionView = (
    <>
      <div className="col-sm-12 col-md-4 px-4 my-questions-list">
        <div className="card questions-card">{prevSessions}</div>
      </div>
      {currentSession ? currentSessionSelected : noCurrentSessionSelected}
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
        {prevSessions.length > 0 && (
          <div className="row px-4 justify-center">
            <div className="col px-0 stats-card">
              <div className="card">
                <QuestionStats />
              </div>
            </div>
          </div>
        )}
        <div className="row py-2">
          {prevSessions.length > 0 ? sessionView : noSessionView}
        </div>
      </div>
    </>
  );
}

export default ViewAllSessions;
