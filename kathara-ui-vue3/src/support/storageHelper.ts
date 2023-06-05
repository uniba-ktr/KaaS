import { setToken, deleteToken } from "@/support/httpCommon";
import type { IAuthToken, IUserProfile } from "@/models/auth-models";

export const setHeaderToken = (token: IAuthToken) =>
  setToken(token.access_token);
export const deleteHeaderToken = () => deleteToken();
export const getLocalToken = (): IAuthToken | null => {
  const value = localStorage.getItem("token");
  if (value !== null) return JSON.parse(value);
  return null;
};
export const deleteLocalToken = () => localStorage.removeItem("token");
export const setLocalToken = (token: IAuthToken) =>
  localStorage.setItem("token", JSON.stringify(token));
export const getUser = (): IUserProfile | null => {
  const value = localStorage.getItem("user");
  if (value !== null) return JSON.parse(value);
  return null;
};
export const setUser = (user: IUserProfile) =>
  localStorage.setItem("user", JSON.stringify(user));
export const deleteUser = () => localStorage.removeItem("user");
