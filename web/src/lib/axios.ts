import axios from "axios";

console.log("aaa", import.meta.env.VITE_API_BASE_URL);

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});
