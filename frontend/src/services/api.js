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
  return error?.response?.data?.message || error?.response?.data?.error || error?.message || fallback;
}

export function isAiUnavailableError(error) {
  return Boolean(
    error?.response?.data?.aiUnavailable ||
      error?.response?.data?.code === "AI_PROVIDER_UNAVAILABLE"
  );
}

export const AI_UNAVAILABLE_MESSAGE =
  "As funcionalidades de Inteligência Artificial dependem de uma chave de API própria. Por questões de segurança e custo, elas não estão disponíveis na demonstração pública. Consulte o README para saber como configurar.";
