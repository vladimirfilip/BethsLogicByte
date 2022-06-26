import React from "react";
import { useState, useEffect } from "react";
import MainNavBar from "./Components/MainNavBar";
import Home from "./Pages/home";
import User from "./Pages/user";
import Login from "./Pages/login";
import { clearAuthInfo, storeAuthInfo, isLoggedIn } from "./authHelper";

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

function Router() {
  const [page, setPageState] = useState(getURL());
  const [loggedIn, setLoggedIn] = useState(isLoggedIn());

  const changePage = (page) => {
    changeURL(page);
    setPageState(getURL());
  };

  const logIn = (account) => {
    setLoggedIn(true);
    storeAuthInfo(account);
  };

  const logOut = () => {
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
    changePage("");
  }

  const pages = [
    {
      "": Home,
    },
    {
      user: User,
    },
  ];
  let pageNamesStandard = Object.keys(pages[0]);
  let pageNamesExtended = Object.keys(pages[1]);

  // if pageName provided in URL is a key in the pages object
  if (pageNamesStandard.indexOf(page[0]) != -1) {
    let PageComponent = pages[0][page[0]];
    return (
      <>
        <MainNavBar link={changePage} />
        <PageComponent changePage={changePage} />
      </>
    );
  } else if (pageNamesExtended.indexOf(page[0]) != -1 && page.length == 2) {
    let PageComponent = pages[1][page[0]];
    return (
      <>
        <MainNavBar link={changePage} />
        <PageComponent changePage={changePage} argument={page[1]} />
      </>
    );
  } else if (page == "logout") {
    logOut();
  } else {
    return <h1>Page cannot be found</h1>;
  }
}

export default Router;
