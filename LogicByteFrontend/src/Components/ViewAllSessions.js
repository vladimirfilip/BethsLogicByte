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
    console.log(sessionData);
    if (!Array.isArray(sessionData)) {
      sessionData = [sessionData];
    }
    for (let session of sessionData) {
      let day = session.session_id.slice(6, 8);
      let month = session.session_id.slice(4, 6);
      let year = session.session_id.slice(0, 4);
      const sessionDate = `${day}/${month}/${year}`;
      setPrevSessions((a) => [
        ...a,
        <button
          className="session-card"
          key={session.session_id}
          onClick={() => setCurrentSession(session.session_id)}
        >{`You attempted some questions on ${sessionDate} and got ${session.score}%`}</button>,
      ]);
    }
  };

  useEffect(() => {
    if (username) {
      showPrevSessions();
    }
  }, [username]);

  return (
    <>
      <div className="container container-fluid my_questions">
        <div className="row">
          <div className="card col-md-4 my-questions-list">{prevSessions}</div>
          <div className="card col-md-8 my-questions-view">
            {currentSession && <ViewSession sessionId={currentSession} />}
          </div>
        </div>
      </div>
    </>
  );
}

export default ViewAllSessions;
