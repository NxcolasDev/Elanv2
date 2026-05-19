import {
  BookOpen,
  CalendarDays,
  Headphones,
  Home,
  Layers,
  LayoutDashboard,
  LogOut,
  Mic,
  Newspaper,
  NotebookPen,
  Pencil,
  ScrollText,
  Sparkles,
  Video,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import ExamSwitcher from "../components/ExamSwitcher";
import logo from "../assets/logo.png";
import { useAuth } from "../hooks/useAuth";

const navItems = [
  { to: "/", label: "Home", icon: Home },
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/reading", label: "Reading", icon: BookOpen },
  { to: "/listening", label: "Listening", icon: Headphones },
  { to: "/speaking", label: "Speaking", icon: Mic },
  { to: "/writing", label: "Writing", icon: Pencil },
  { to: "/flashcards", label: "Flashcards", icon: Layers },
  { to: "/models", label: "Models", icon: Sparkles },
  { to: "/youtube", label: "YouTube", icon: Video },
  { to: "/history", label: "Historico", icon: ScrollText },
  { to: "/notes", label: "Anotacoes", icon: NotebookPen },
  { to: "/schedule", label: "Cronograma", icon: CalendarDays },
  { to: "/news", label: "News", icon: Newspaper },
];

function NavigationItems({ compact = false }) {
  return navItems.map(({ to, label, icon: Icon }) => (
    <NavLink
      key={to}
      to={to}
      className={({ isActive }) =>
        compact
          ? `flex min-w-[74px] flex-col items-center gap-1 rounded-xl px-2 py-2 text-[11px] transition ${
              isActive ? "bg-purple-500/20 text-white" : "text-gray-400"
            }`
          : `group flex items-center gap-3 rounded-2xl px-3 py-2.5 transition duration-200 ${
              isActive
                ? "bg-gradient-to-r from-purple-500/24 to-blue-500/12 text-white shadow-[0_0_30px_rgba(124,58,237,0.18),inset_0_0_0_1px_rgba(168,85,247,0.28)]"
                : "text-gray-400 hover:bg-white/6 hover:text-white"
            }`
      }
    >
      <Icon size={17} className={compact ? "" : "text-purple-200/80 transition group-hover:text-purple-100"} />
      <span>{label}</span>
    </NavLink>
  ));
}

export default function MainLayout({ children }) {
  const { user, logout } = useAuth();

  return (
    <div className="elan-bg flex min-h-screen text-white">
      <div className="pointer-events-none fixed inset-0 elan-orbit opacity-20" />

      <aside className="relative z-10 hidden w-72 flex-col border-r border-white/10 bg-[#090912]/82 p-4 shadow-[18px_0_80px_rgba(0,0,0,0.36)] backdrop-blur-xl md:flex">
        <NavLink to="/" className="mb-7 flex items-center gap-3 rounded-2xl p-2 transition hover:bg-white/5">
          <span className="rounded-2xl bg-purple-500/10 p-2 shadow-[0_0_34px_rgba(168,85,247,0.36)]">
            <img src={logo} alt="ELAN" className="h-9 w-9" />
          </span>
          <div>
            <h1 className="text-xl font-black tracking-wide">ELAN</h1>
            <p className="text-xs text-purple-200/80">AI exam studio</p>
          </div>
        </NavLink>

        <div className="mb-5">
          <ExamSwitcher compact />
        </div>

        <nav className="flex flex-col gap-1 text-sm">
          <NavigationItems />
        </nav>

        <div className="mt-auto space-y-3">
          {user && (
            <div className="elan-glass rounded-2xl p-3">
              <div className="flex items-center gap-3">
                {user.photoURL ? (
                  <img src={user.photoURL} alt="" className="h-9 w-9 rounded-full" />
                ) : (
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-purple-600 font-bold">
                    {user.displayName?.[0] || "E"}
                  </div>
                )}
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">{user.displayName || "Estudante ELAN"}</p>
                  <p className="truncate text-xs text-gray-500">{user.email}</p>
                </div>
              </div>
              <button
                onClick={logout}
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-gray-200 transition hover:bg-white/10"
              >
                <LogOut size={14} />
                Logout
              </button>
            </div>
          )}
          <div className="rounded-2xl border border-purple-400/20 bg-purple-500/10 p-3 text-xs text-gray-400">
            ELAN 2026 - premium study OS
          </div>
        </div>
      </aside>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-white/10 bg-[#090912]/95 px-3 py-2 backdrop-blur-xl md:hidden">
        <nav className="flex gap-1 overflow-x-auto">
          <NavigationItems compact />
        </nav>
      </div>

      <main className="relative z-10 flex-1 overflow-auto p-5 pb-28 md:p-7">{children}</main>
    </div>
  );
}
