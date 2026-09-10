import axios from "axios";

export const serverApi: string = (
  (import.meta.env.VITE_API_URL as string) || "http://localhost:3001"
)
  .replace(/\/+$/, "")
  .replace(/\/admin\/?$/i, "");


// Global Axios Interceptor: automatically attaches Bearer token if present
axios.interceptors.request.use((config) => {
  const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export { getImageUrl } from "./image";


