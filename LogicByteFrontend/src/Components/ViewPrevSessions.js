import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { UserDataContext } from "../router";
import { getAuthInfo } from "../helpers/authHelper";
import ViewQInSession from "./viewQInSession";

function ViewCompletedQs() {
  const username = useContext(UserDataContext);
  const [prevSessions, setPrevSessions] = useState([]);
  const [currentSession, setCurrentSession] = useState(null);

  const showPrevSessions = () => {
    axios
      .get("http://127.0.0.1:8000/api_user_question_session/", {
        params: { username: username, s_session_id: "", s_score: "" },
        headers: { Authorization: `token ${getAuthInfo().token}` },
      })
      .then((response) => {
        let sessionData = response.data.slice(0, 10);
        for (const session of sessionData) {
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
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    if (username) {
      showPrevSessions();
    }
  }, [username]);

  useEffect(() => {
    console.log(currentSession);
  }, [currentSession]);
  return (
    <>
      <div>{prevSessions}</div>
      {currentSession && <ViewQInSession sessionId={currentSession} />}
    </>
  );
}

export default ViewCompletedQs;
