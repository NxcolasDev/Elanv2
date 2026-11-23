import axios from "axios";
import { auth } from "./firebase";

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 42000,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use(async (config) => {
  // Attach Firebase credentials only to relative API calls to the configured backend.
  if (config.url?.startsWith("/api/") && !config.url.startsWith("/api/content/") && config.baseURL === API_BASE_URL && auth.currentUser) {
    config.headers.set("Authorization", `Bearer ${await auth.currentUser.getIdToken()}`);
  }
  return config;
});

export async function getPublishedContent(exam, kind, signal) {
  const { data } = await api.get(`/api/content/${exam}/${kind}`, { signal, timeout: 2500 });
  return data;
}

export function getApiErrorMessage(error, fallback = "Something went wrong.") {
  if (error?.response?.status === 401) return "Entre na sua conta para usar este recurso.";
  return error?.response?.data?.message || error?.response?.data?.error || fallback;
}

export function isAiUnavailableError(error) {
  return Boolean(
    error?.response?.data?.aiUnavailable ||
      error?.response?.data?.code === "AI_PROVIDER_UNAVAILABLE"
  );
}

export const AI_UNAVAILABLE_MESSAGE =
  "As funcionalidades de Inteligência Artificial dependem de uma chave de API própria. Consulte o README para saber como configurar.";
