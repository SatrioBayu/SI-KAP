// frontend/src/api/auth.js
import api from "./axios";

export const loginRequest = (username, password) =>
  api.post("/auth/login", { username, password });

export const meRequest = () => api.get("/auth/me");
