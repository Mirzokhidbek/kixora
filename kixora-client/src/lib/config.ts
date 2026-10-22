/**
 * API base URL.
 * Production default "/api": Vercel proxies it to the backend (see vercel.json), so
 * the API is same-site and the httpOnly auth cookie is a first-party cookie that
 * browsers don't block. The JWT is therefore never stored in localStorage.
 */
const defaultApi = import.meta.env.PROD ? "/api" : "http://localhost:3001";

export const serverApi: string = ((import.meta.env.VITE_API_URL as string) || defaultApi)
  .replace(/\/+$/, "")
  .replace(/\/admin\/?$/i, "");

// Older versions kept the JWT in localStorage (readable by any injected script); remove it.
if (typeof window !== "undefined") {
  localStorage.removeItem("access_token");
}

export { getImageUrl } from "./image";
