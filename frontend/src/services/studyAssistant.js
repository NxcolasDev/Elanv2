import { api } from "./api";

export async function askStudyAssistant({ question, context = "", focus = "" }) {
  const response = await api.post("/api/exams/generate", {
    mode: "studyAssistant",
    text: question,
    context,
    focus,
  });

  return response.data?.answer || "I could not generate an answer right now.";
}

export async function generateStudyModel(focus) {
  const response = await api.post("/api/exams/generate", {
    mode: "modelStudy",
    focus,
  });

  return response.data?.model;
}
