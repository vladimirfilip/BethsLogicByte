function getURL() {
  let url = window.location.href;
  url = url.split("/");
  url = url.slice(3);

  return url;
}

export default getURL;
