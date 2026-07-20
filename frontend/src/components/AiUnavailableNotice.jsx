import { ShieldAlert, Sparkles } from "lucide-react";
import { AI_UNAVAILABLE_MESSAGE } from "../services/api";

export default function AiUnavailableNotice({ className = "", compact = false }) {
  return (
    <div
      className={`rounded-2xl border border-amber-400/30 bg-amber-500/10 p-4 text-amber-50 shadow-[0_0_24px_rgba(245,158,11,0.12)] ${className}`}
    >
      <div className="flex gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-amber-300/30 bg-amber-300/10 text-amber-200">
          {compact ? <ShieldAlert size={18} /> : <Sparkles size={18} />}
        </div>
        <div>
          <p className="text-sm font-bold text-amber-100">IA indisponivel nesta demo</p>
          <p className="mt-1 text-sm leading-6 text-amber-50/85">{AI_UNAVAILABLE_MESSAGE}</p>
        </div>
      </div>
    </div>
  );
}
