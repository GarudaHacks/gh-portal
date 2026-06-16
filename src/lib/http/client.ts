// Empty string = relative path, works with Vite dev proxy. Set VITE_API_URL in Vercel
// per environment (Production / Preview) to the full cloud functions base URL.
export const apiUrl = import.meta.env.VITE_API_URL ?? "";
