/**import axios from "axios";

export const api = axios.create({
  baseURL: "http://127.0.0.1:8000",
});**/

import axios, { AxiosHeaders } from "axios";

const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL ?? "http://127.0.0.1:8001").replace(/\/$/, "");

export const api = axios.create({
  baseURL: apiBaseUrl,
});

// Attach the JWT (saved at login) to every outgoing request.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    const headers = config.headers ? new AxiosHeaders(config.headers) : new AxiosHeaders();
    headers.set("Authorization", `Bearer ${token}`);
    headers.set("authorization", `Bearer ${token}`);
    config.headers = headers;
  }
  return config;
});

// If the token is missing/expired, bounce to login instead of leaving
// the user stuck on a page full of failed requests.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;