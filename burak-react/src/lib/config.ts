export const serverApi: string = (
  (import.meta.env.VITE_API_URL as string) || "http://localhost:3001"
).replace(/\/+$/, "");
