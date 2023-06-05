import axios from "axios";

const AUTH_API_VERSION_PREFIX = "/api/v1";

const auth_api = axios.create({
  baseURL: "http://localhost:8000",
  headers: {
    Accept: "application/json",
    "Content-type": "application/json; charset=utf-8",
  },
});

const setToken = (token: string | null) =>
  (auth_api.defaults.headers!.common["Authorization"] = `Bearer ${token}`);

const deleteToken = () =>
  delete auth_api.defaults.headers?.common["Authorization"];

export { auth_api, setToken, deleteToken, AUTH_API_VERSION_PREFIX };
