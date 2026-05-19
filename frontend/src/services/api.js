import axios from "axios";

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 20000,
  headers: {
    "Content-Type": "application/json",
  },
});

export function getApiErrorMessage(error, fallback = "Something went wrong.") {
  return error?.response?.data?.error || error?.message || fallback;
}
