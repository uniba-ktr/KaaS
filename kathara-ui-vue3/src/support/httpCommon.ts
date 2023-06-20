import axios from "axios";

// const AUTH_API_VERSION_PREFIX = "/api/v1";

const kathara_api = axios.create({
  baseURL: "http://localhost:8000",
  headers: {
    Accept: "application/json",
    "Content-type": "application/json; charset=utf-8",
  },
});

const setToken = (token: string | null) =>
  (kathara_api.defaults.headers!.common["Authorization"] = `Bearer ${token}`);

const deleteToken = () =>
  delete kathara_api.defaults.headers?.common["Authorization"];

export { kathara_api, setToken, deleteToken };
