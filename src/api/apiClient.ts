import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";
import axios from "axios";

import { useAuthStore } from "../stores/authStore";
import { ENV_CONFIG } from "../env.config";

export const API_BASE_URL =
  process.env.NODE_ENV === "development" || process.env.NODE_ENV === "preview"
    ? ENV_CONFIG.dev.BASE_API_URL
    : process.env.NODE_ENV === "production"
      ? ENV_CONFIG.prod.BASE_API_URL
      : ENV_CONFIG.dev.BASE_API_URL;

// for NON AUTH USER
export const PUB_API_CLIENT = axios.create({
  baseURL: API_BASE_URL,
  method: "post",
});

// axios instance for authenticated endpoints
export const AUTH_API_CLIENT = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// axios interceptor to inject access token when hitting auth endpoints
AUTH_API_CLIENT.interceptors.request.use(
  async (request) => {
    try {
      const serializedUser = await AsyncStorage.getItem("User");

      if (!serializedUser) throw new Error("User not found");
      const user = JSON.parse(serializedUser);

      const { accessToken } = user.tokens;
      if (accessToken) {
        request.headers["Authorization"] = `Bearer ${accessToken}`;
      }
      return request;
    } catch (error) {
      return Promise.reject(error);
    }
  },
  (err) => {
    Promise.reject(err);
  },
);

AUTH_API_CLIENT.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalRequest = err.config;
    // console.log(err.response, "error from auth")
    console.log(err.response, "--error from auth");
    if (err && err?.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const serializedUser = await AsyncStorage.getItem("User");
        if (serializedUser) {
          const user = JSON.parse(serializedUser);
          const refreshToken = user.tokens.refreshToken;

          const serverResponse = await axios.post(
            `${API_BASE_URL}/users/generate/token`,
            {
              refreshToken,
            },
          );

          const responseData = serverResponse.data;

          const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
            responseData.data;

          user.tokens = {
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
          };

          await AsyncStorage.setItem("User", JSON.stringify(user));

          AUTH_API_CLIENT.defaults.headers.common["Authorization"] =
            `Bearer ${newAccessToken}`;
          console.log("Refreshed user", user);

          return AUTH_API_CLIENT(originalRequest);
        }
      } catch (refreshError) {
        // failed to refresh token
        console.error("Token refresh failed", refreshError);
        Alert.alert(
          "Sign in",
          "Your current session has expired. Kindly login again",
        );
        await AsyncStorage.removeItem("User");
        useAuthStore.setState((state) => ({ ...state, user: null }));
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(err);
  },
);
