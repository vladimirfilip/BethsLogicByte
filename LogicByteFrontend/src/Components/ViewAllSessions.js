import React, { useContext, useEffect, useState } from "react";
import { UsernameContext } from "../router";
import ViewSession from "./ViewSession";
import { asyncGETAPI } from "../helpers/asyncBackend";

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
      <div>{prevSessions}</div>
      {currentSession && <ViewSession sessionId={currentSession} />}
    </>
  );
}

export default ViewAllSessions;
