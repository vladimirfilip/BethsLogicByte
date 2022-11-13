import React, { createContext } from "react";
import { useState, useEffect } from "react";
import Home from "./Pages/home";
import User from "./Pages/user";
import Login from "./Pages/login";
import Settings from "./Pages/settings";
import QuestionPage from "./Pages/questionPage";
import FinishSession from "./Pages/finishSession";
import {
  clearAuthInfo,
  storeAuthInfo,
  isLoggedIn,
  getAuthInfo,
} from "./helpers/authHelper";
import axios from "axios";
import SubjectPage from "./Pages/subjectPage";
import MyQPage from "./Pages/myQPage";
import QuestionPicker from "./Pages/question_picker";

function getURL() {
  let url = window.location.href;
  url = url.split("/");
  url = url.slice(3);

  return url;
}

function changeURL(url) {
  // URLs should be lowercase
  url = url.toLowerCase();
  if (url[0] != "/") {
    // prefixed by / makes the url be root
    // without prefix byte/cool -> byte/cool/nice
    // with prefix byte/cool -> byte/nice
    url = "/" + url;
  }
  let data = {
    title: "LogicByte",
  };
  history.pushState(data, "", url);
}

const UsernameContext = createContext();

function Router() {
  const [page, setPageState] = useState(getURL());
  const [loggedIn, setLoggedIn] = useState(isLoggedIn());
  const [username, setUsername] = useState("");

  const changePage = (page) => {
    changeURL(page);
    setPageState(getURL());
  };

  const logIn = (entered_username, token) => {
    storeAuthInfo({ token: token });
    setUsername(entered_username);
    setLoggedIn(true);
  };

  const logOff = () => {
    setLoggedIn(false);
    clearAuthInfo();
    changePage("login");
  };

  const onPopState = () => {
    // let url = getURL();
    // url = url.join("/");
    // changePage(url);
    setPageState(getURL());
  };

  useEffect(() => {
    //
    // Gets username using token
    //
    if (loggedIn) {
      axios
        .get("http://127.0.0.1:8000/api_get_username/", {
          params: { token: getAuthInfo().token },
          headers: { Authorization: `token ${getAuthInfo().token}` },
        })
        .then((response) => {
          setUsername(response.data.username);
        })
        .catch((error) => console.log(error));
    }

    window.addEventListener("popstate", () => {
      onPopState();
    });

    return () => {
      window.removeEventListener("popstate", () => {
        onPopState();
      });
    };
  }, []);

  if (loggedIn == false) {
    if (page == "login") {
      return <Login logIn={logIn} />;
    } else {
      return <h1>Please login to view this page</h1>;
    }
  } else if (page == "login") {
    changePage("home");
  }

  const pages = [
    {
      home: Home,
      settings: Settings,
      mathematics: SubjectPage,
      physics: SubjectPage,
      chemistry: SubjectPage,
      biology: SubjectPage,
      informatics: SubjectPage,
      my_questions: MyQPage,
      question_picker: QuestionPicker,
      question: QuestionPage,
    },
    {
      user: User,
      finish: FinishSession,
    },
  ];
  let pageNamesStandard = Object.keys(pages[0]);
  let pageNamesExtended = Object.keys(pages[1]);

  // if pageName provided in URL is a key in the pages object
  if (pageNamesStandard.indexOf(page[0]) != -1) {
    let PageComponent = pages[0][page[0]];
    return (
      <UsernameContext.Provider value={username}>
        <PageComponent changePage={changePage} username={username} />
      </UsernameContext.Provider>
    );
  } else if (pageNamesExtended.indexOf(page[0]) != -1 && page.length == 2) {
    let PageComponent = pages[1][page[0]];
    return (
      <UsernameContext.Provider value={username}>
        <PageComponent
          changePage={changePage}
          argument={page[1]}
          username={username}
        />
      </UsernameContext.Provider>
    );
  } else if (page == "logoff") {
    logOff();
  } else {
    return <h1>Page cannot be found</h1>;
  }
}

export { Router, UsernameContext };
