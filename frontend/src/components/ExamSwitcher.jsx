import { ChevronDown } from "lucide-react";
import { setStoredExam } from "../data/exams";
import { useActiveExam } from "../hooks/useActiveExam";

export default function ExamSwitcher({ compact = false }) {
  const { activeExam, exam } = useActiveExam();

  const toggleExam = () => {
    const nextExam = activeExam === "IELTS" ? "DELF" : "IELTS";
    setStoredExam(nextExam);
  };

  return (
    <button
      onClick={toggleExam}
      className={`group inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/8 px-3 py-2 text-left shadow-[0_0_28px_rgba(124,58,237,0.18)] backdrop-blur transition hover:border-purple-300/40 hover:bg-white/12 ${
        compact ? "w-full justify-between" : ""
      }`}
      title="Trocar exame ativo"
    >
      <img src={exam.flag} alt={exam.language} className="h-6 w-6 rounded-full object-cover" />
      <span className="min-w-0">
        <span className="block text-xs text-gray-400">{exam.language}</span>
        <span className="block text-sm font-semibold text-white">{exam.label}</span>
      </span>
      <ChevronDown size={15} className="text-gray-400 transition group-hover:text-purple-200" />
    </button>
  );
}
