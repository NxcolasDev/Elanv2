import { useEffect, useState } from "react";
import { exams, getStoredExam } from "../data/exams";

export function useActiveExam() {
  const [activeExam, setActiveExam] = useState(getStoredExam);

  useEffect(() => {
    const handleChange = (event) => {
      setActiveExam(event.detail || getStoredExam());
    };

    window.addEventListener("elan:exam-change", handleChange);
    window.addEventListener("storage", handleChange);

    return () => {
      window.removeEventListener("elan:exam-change", handleChange);
      window.removeEventListener("storage", handleChange);
    };
  }, []);

  return {
    activeExam,
    exam: exams[activeExam] || exams.IELTS,
    isDelf: activeExam === "DELF",
  };
}
