import { api } from "./api";

export async function askStudyAssistant({ question, context = "", focus = "", exam }) {
  const response = await api.post("/api/exams/generate", {
    mode: "studyAssistant",
    text: question,
    exam,
    context,
    focus,
  });

  return response.data?.answer || "I could not generate an answer right now.";
}

export async function generateStudyModel(focus, exam) {
  const response = await api.post("/api/exams/generate", {
    mode: "modelStudy",
    exam,
    focus,
  });

  return response.data?.model;
}
