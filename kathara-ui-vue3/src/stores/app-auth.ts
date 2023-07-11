import { defineStore } from "pinia";
import type {
  IAuthToken,
  IUserProfile,
  IAuthRequestPayload,
} from "@/models/auth-models";
import {
  setHeaderToken,
  deleteHeaderToken,
  getLocalToken,
  deleteLocalToken,
  setLocalToken,
  getUser,
  setUser,
  deleteUser,
} from "@/support/storageHelper";
import { kathara_api } from "@/support/httpCommon";

export type RootState = {
  user: IUserProfile;
  token: IAuthToken;
  authenticated: boolean;
};

export const useAuthStore = defineStore("auth", {
  state: () =>
    ({
      user: {
        user_id: "",
        username: "",
        email: "",
        first_name: "",
        last_name: "",
        disabled: false,
      },
      token: {
        access_token: null,
        refresh_token: null,
      },
      authenticated: false,
    } as RootState),
  actions: {
    SET_TOKEN(payload: IAuthToken) {
      setLocalToken(payload);
      setHeaderToken(payload);
      this.token = payload;
      this.authenticated = true;
    },
    async DO_LOGIN(payload: IAuthRequestPayload) {
      await kathara_api
        .post(`/auth/login`, payload)
        .then(async (response) => {
          this.SET_TOKEN(response.data);
          await this.GET_USER();
        });
    },
    async GET_USER() {
      await kathara_api
        .get(`/users/me`)
        .then((response) => {
          setUser(response.data);
          this.user = response.data;
        });
    },
    LOAD_SESSION() {
      return new Promise<void>((resolve, reject) => {
        const user = getUser();
        if (!user) {
          reject(new Error("User invalid!"));
        } else {
          this.user = user;
          resolve();
        }
      });
    },
    SIGN_OUT() {
      deleteLocalToken();
      deleteHeaderToken();
      deleteUser();
      this.user = {
        user_id: "",
        username: "",
        email: "",
        first_name: "",
        last_name: "",
        disabled: false,
      };
      this.token = {
        access_token: null,
        refresh_token: null,
      };
      this.authenticated = false;
    },
    async CHECK_TOKEN() {
      if (this.token.access_token)
        return Promise.resolve(this.token.access_token);
      const token = getLocalToken();
      if (!token) return Promise.reject(new Error("Token invalid!"));
      this.SET_TOKEN(token);
      return this.LOAD_SESSION();
    },
  },
  getters: {
    getUser: (state) => state.user,
    getToken: (state) => state.token,
    isAuthenticated: (state) => state.authenticated,
  },
});
