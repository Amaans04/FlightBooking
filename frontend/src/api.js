import axios from "axios";

const baseURL = (import.meta.env.VITE_BACKEND_URL || "http://localhost:5050").replace(/\/$/, "");

const api = axios.create({
  baseURL,
});

export default api;
