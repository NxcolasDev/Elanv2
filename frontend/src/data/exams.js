import franceFlag from "../assets/France.png";
import ukFlag from "../assets/United_kingdom.png";

export const exams = {
  IELTS: {
    id: "IELTS",
    label: "IELTS",
    language: "Inglês",
    flag: ukFlag,
    accent: "from-purple-500 to-blue-400",
    scoreLabel: "Band",
    maxScore: 9,
    sections: ["Reading", "Listening", "Writing", "Speaking"],
  },
  DELF: {
    id: "DELF",
    label: "DELF/DALF",
    language: "Francês",
    flag: franceFlag,
    accent: "from-blue-500 to-fuchsia-400",
    scoreLabel: "Points",
    maxScore: 100,
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    sections: [
      "Compréhension orale",
      "Compréhension écrite",
      "Production écrite",
      "Production orale",
    ],
  },
};

export function getStoredExam() {
  try {
    const saved = window.localStorage.getItem("elan.activeExam");
    return Object.hasOwn(exams, saved) ? saved : "IELTS";
  } catch {
    return "IELTS";
  }
}

export function setStoredExam(examId) {
  try {
    window.localStorage.setItem("elan.activeExam", examId);
  } catch {
    // The active session can still switch exams when persistence is unavailable.
  }
  window.dispatchEvent(new CustomEvent("elan:exam-change", { detail: examId }));
}
