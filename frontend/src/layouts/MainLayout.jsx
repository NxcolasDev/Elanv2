import { LayoutDashboard, Pencil, BookOpen, Headphones, Mic, FileText, Calendar } from "lucide-react";
import { Link } from "react-router-dom";

export default function MainLayout({ children }) {
  return (
    <div className="flex h-screen bg-[#0a0a0a] text-white">

      <aside className="w-64 bg-[#0f0f1a] border-r border-purple-900 p-4 flex flex-col">

        <div className="flex items-center gap-2 mb-8">
          <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
          <h1 className="text-xl font-bold">elan</h1>
        </div>

        <div className="text-xs text-gray-400 mb-2">WORKSPACE</div>

        <nav className="flex flex-col gap-2 text-sm">

          <Link to="/dashboard" className="flex items-center gap-2 p-2 rounded-lg hover:bg-[#1a1a2e]">
            <LayoutDashboard size={16} /> Dashboard
          </Link>

          <Link to="/writing" className="flex items-center gap-2 p-2 rounded-lg hover:bg-[#1a1a2e]">
            <Pencil size={16} /> Writing
          </Link>

          <Link to="/reading" className="flex items-center gap-2 p-2 rounded-lg hover:bg-[#1a1a2e]">
            <BookOpen size={16} /> Reading
          </Link>

          <Link to="/listening" className="flex items-center gap-2 p-2 rounded-lg hover:bg-[#1a1a2e]">
            <Headphones size={16} /> Listening
          </Link>

          <Link to="/speaking" className="flex items-center gap-2 p-2 rounded-lg hover:bg-[#1a1a2e]">
            <Mic size={16} /> Speaking
          </Link>

        </nav>

      </aside>

      <main className="flex-1 p-6 overflow-auto">
        {children}
      </main>

    </div>
  );
}