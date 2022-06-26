function storeAuthInfo(data) {
  localStorage.auth = JSON.stringify(data);
}

function getAuthInfo() {
  if (localStorage.auth == undefined) {
    console.error("Not logged in");
  } else {
    return JSON.parse(localStorage.auth);
  }
}

function clearAuthInfo() {
  localStorage.removeItem("auth");
}

function isLoggedIn() {
  if (localStorage.auth == undefined) {
    return false;
  } else {
    return true;
  }
}

export { storeAuthInfo, getAuthInfo, clearAuthInfo, isLoggedIn };
