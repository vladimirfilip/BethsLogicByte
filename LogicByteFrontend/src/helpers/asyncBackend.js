import axios from "axios";
import { getAuthInfo } from "./authHelper";

const asyncGETAPI = async (url, params) => {
  if ("user" in params) {
    params.user = getAuthInfo().token;
  } else if ("user_profile" in params) {
    params.user_profile = getAuthInfo().token;
  }
  const res = await axios
    .get(`http://127.0.0.1:8000/${url}/`, {
      params: params,
      headers: { Authorization: `token ${getAuthInfo().token}` },
    })
    .catch((err) => console.error(err));
  return res.data;
};

const asyncPOSTAPI = async (url, data) => {
  if ("user_profile" in data) {
    data.user_profile = getAuthInfo().token;
  }
  const res = await axios
    .post(`http://127.0.0.1:8000/${url}/`, data, {
      headers: { Authorization: `token ${getAuthInfo().token}` },
    })
    .catch((err) => console.error(err));
  return res;
};

const asyncPUTAPI = async (url, params, data) => {
  if ("user_profile" in params) {
    params.user_profile = getAuthInfo().token;
  }
  const res = await axios
    .put(`http://127.0.0.1:8000/${url}/`, {
      params: params,
      data: data,
      headers: { Authorization: `token ${getAuthInfo().token}` },
    })
    .catch((err) => console.error(err));
  return res;
};

const asyncDELETEAPI = async (url, params) => {
  if ("user_profile" in params) {
    params.user_profile = getAuthInfo().token;
  }
  const res = await axios
    .delete(`http://127.0.0.1:8000/${url}/`, {
      params: params,
      headers: { Authorization: `token ${getAuthInfo().token}` },
    })
    .catch((err) => console.error(err));
  return res;
};

export { asyncGETAPI, asyncPUTAPI, asyncPOSTAPI, asyncDELETEAPI };
