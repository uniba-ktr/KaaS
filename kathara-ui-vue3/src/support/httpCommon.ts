import axios from "axios";

// const AUTH_API_VERSION_PREFIX = "/api/v1";

const kathara_api = axios.create({
  baseURL: import.meta.env.VITE_KATHARA_API_URL,
  timeout: 5000, // Set a default timeout of 5 seconds
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
