import {
  ArrowRight,
  BarChart3,
  BookOpen,
  Brain,
  CheckCircle2,
  Headphones,
  Mic,
  PenLine,
  Sparkles,
  Target,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import ExamSwitcher from "../components/ExamSwitcher";
import heroImage from "../assets/hero-human-ai.png";
import logo from "../assets/logo.png";
import { useAuth } from "../hooks/useAuth";
import lumiImage from "../assets/Lumi.png";

const examCards = [
  {
    title: "IELTS",
    text: "Reading, Listening, Writing e Speaking com band score, timer e histórico.",
  },
  {
    title: "DELF/DALF",
    text: "Treino por níveis A1-C2 com produção oral, escrita e compreensão em francês.",
  },
];

const steps = [
  ["Escolha o exame", "Alterne entre IELTS e DELF/DALF com trilhas e critérios próprios."],
  ["Faça exercícios reais", "Treinos por seção, simulados e feedback acumulado por habilidade."],
  ["Receba correção IA", "Speaking e Writing recebem análise por critérios de prova."],
];

export default function Home() {
  const navigate = useNavigate();
  const { user, loginWithGoogle, logout } = useAuth();

  const handleStart = async () => {
    if (user) {
      navigate("/dashboard");
      return;
    }

    const firebaseUser = await loginWithGoogle();
    navigate(`/dashboard?uid=${firebaseUser.uid}`);
  };

  return (
    <div className="elan-bg min-h-screen overflow-hidden text-white">
      <div className="pointer-events-none fixed inset-0 elan-orbit opacity-30" />

      <section className="relative min-h-screen">
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt=""
            className="h-full w-full object-cover object-center opacity-90 saturate-125"
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,#070710_0%,rgba(7,7,16,0.82)_38%,rgba(7,7,16,0.32)_100%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_68%_34%,rgba(168,85,247,0.34),transparent_24%),radial-gradient(circle_at_82%_22%,rgba(59,130,246,0.30),transparent_22%)]" />
        </div>

        <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col px-6">
          <nav className="mt-5 flex items-center justify-between rounded-2xl border border-purple-500/10 bg-black/35 px-4 py-3 shadow-[0_0_60px_rgba(124,58,237,0.24)] backdrop-blur-xl">
            <Link to="/" className="flex items-center gap-3">
              <span className="rounded-xl bg-purple-500/10 p-2 shadow-[0_0_28px_rgba(168,85,247,0.36)]">
                <img src={logo} alt="ELAN" className="h-8 w-8" />
              </span>
              <span>
                <span className="block text-xl font-bold tracking-wide">ELAN</span>
                <span className="block text-xs text-purple-200/80">AI exam studio</span>
              </span>
            </Link>

            <div className="hidden items-center gap-7 text-sm text-gray-300 md:flex">
              <a href="#inicio" className="transition hover:text-white">Início</a>
              <a href="#exames" className="transition hover:text-white">Exames</a>
              <a href="#sobre" className="transition hover:text-white">Sobre</a>
              <a href="#lumi" className="transition hover:text-white">Lumi AI</a>
              <Link to="/dashboard" className="transition hover:text-white">Dashboard</Link>
            </div>

            <div className="flex items-center gap-3">
              <ExamSwitcher />
              {user ? (
                <>
                  {user.photoURL && (
                    <img src={user.photoURL} alt="" className="hidden h-9 w-9 rounded-full sm:block" />
                  )}
                  <Link
                    to="/dashboard"
                    className="rounded-lg bg-gradient-to-r from-purple-600 to-blue-500 px-4 py-2 text-sm font-semibold shadow-[0_0_35px_rgba(124,58,237,0.42)] transition hover:scale-[1.02]"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={logout}
                    className="hidden rounded-lg border border-white/10 px-4 py-2 text-sm font-semibold text-gray-100 transition hover:bg-white/10 sm:block"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="hidden rounded-lg border border-white/10 px-4 py-2 text-sm font-semibold text-gray-100 transition hover:bg-white/10 sm:block"
                  >
                    Entrar
                  </Link>
                  <button
                    onClick={handleStart}
                    className="rounded-lg bg-gradient-to-r from-purple-600 to-blue-500 px-4 py-2 text-sm font-semibold shadow-[0_0_35px_rgba(124,58,237,0.42)] transition hover:scale-[1.02]"
                  >
                    Criar conta
                  </button>
                </>
              )}
            </div>
          </nav>

          <main id="inicio" className="flex flex-1 items-center py-16">
            <div className="max-w-3xl">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-purple-300/30 bg-purple-500/15 px-4 py-2 text-sm text-purple-50 shadow-[0_0_40px_rgba(168,85,247,0.32)] animate-pulse backdrop-blur">
                <Sparkles size={15} />
                IELTS + DELF/DALF com feedback de IA
              </div>

            <h1 className="text-5xl font-black leading-[1.02] md:text-7xl">
              <span className="elan-flow-gradient">
                Domine idiomas com IA.
              </span>
            </h1>

              <p className="mt-6 max-w-2xl text-lg leading-8 text-gray-300">
                O ELAN combina simulados, correções inteligentes, flashcards e histórico
                de evolução em uma experiência premium para preparação IELTS e DELF/DALF.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <button
                  onClick={handleStart}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-blue-500 px-6 py-3 text-sm font-bold shadow-[0_0_45px_rgba(124,58,237,0.48)] transition hover:scale-[1.02]"
                >
                  Começar agora
                  <ArrowRight size={17} />
                </button>

                <Link
                  to="/reading"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/8 px-6 py-3 text-sm font-bold backdrop-blur transition hover:bg-white/12"
                >
                  Explorar exames
                </Link>
              </div>

              <div className="mt-12 grid max-w-3xl grid-cols-2 gap-3 md:grid-cols-4">
                {[
                  [BookOpen, "Reading"],
                  [Headphones, "Listening"],
                  [PenLine, "Writing"],
                  [Mic, "Speaking"],
                ].map(([Icon, label]) => (
                  <Link
                    key={label}
                    to={`/${String(label).toLowerCase()}`}
                    className="elan-glass elan-glow-card rounded-2xl p-4 transition duration-300 hover:-translate-y-1 hover:border-purple-300/40"
                  >
                    <Icon className="mb-4 text-purple-200" size={24} />
                    <p className="font-semibold">{label}</p>
                    <p className="text-xs text-gray-400">Treino guiado</p>
                  </Link>
                ))}
              </div>
            </div>
          </main>
        </div>
      </section>

      <section id="exames" className="relative z-10 mx-auto max-w-7xl px-6 py-20">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-purple-300">Exames</p>
            <h2 className="mt-3 text-4xl font-bold">Duas trilhas, critérios diferentes.</h2>
          </div>
          <ExamSwitcher />
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {examCards.map((card) => (
            <div key={card.title} className="elan-glass elan-glow-card rounded-3xl p-7 transition hover:-translate-y-1">
              <p className="text-sm text-purple-200">Preparação oficial-like</p>
              <h3 className="mt-3 text-3xl font-bold">{card.title}</h3>
              <p className="mt-4 leading-7 text-gray-300">{card.text}</p>
              <div className="mt-6 grid grid-cols-2 gap-3 text-sm text-gray-300">
                {["score realista", "histórico", "IA avaliadora", "simulados"].map((item) => (
                  <span key={item} className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-purple-300" />
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="sobre" className="relative z-10 mx-auto grid max-w-7xl gap-5 px-6 py-20 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-300">Como funciona</p>
          <h2 className="mt-3 text-4xl font-bold">Prática, correção e evolução em um só fluxo.</h2>
          <p className="mt-5 leading-7 text-gray-300">
            A plataforma salva tentativas reais, calcula médias, mostra evolução e mantém
            uma rotina de estudo com recursos de IA para produção oral e escrita.
          </p>
        </div>

        <div className="grid gap-4">
          {steps.map(([title, text], index) => (
            <div key={title} className="elan-glass rounded-2xl p-5 transition hover:border-purple-300/35">
              <div className="flex items-start gap-4">
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-purple-500/20 text-purple-100 shadow-[0_0_28px_rgba(168,85,247,0.22)]">
                  {index + 1}
                </span>
                <div>
                  <h3 className="font-semibold">{title}</h3>
                  <p className="mt-1 text-sm leading-6 text-gray-400">{text}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-7xl px-6 py-20">
        <div className="grid gap-5 md:grid-cols-3">
          {[
            [Brain, "IA corrigindo", "Feedback por fluência, gramática, vocabulário, coerência e tarefa."],
            [BarChart3, "Estatísticas reais", "Média, melhor score, evolução semanal, streak e histórico."],
            [Target, "Plano de estudo", "Flashcards, cronograma e revisão espaçada para manter consistência."],
          ].map(([Icon, title, text]) => (
            <div key={title} className="elan-glass rounded-3xl p-6 transition hover:-translate-y-1">
              <Icon className="mb-5 text-blue-300" size={28} />
              <h3 className="text-xl font-bold">{title}</h3>
              <p className="mt-3 text-sm leading-6 text-gray-400">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section
  id="lumi"
  className="relative z-10 mx-auto max-w-7xl px-6 py-24"
>
  <div className="grid items-center gap-16 lg:grid-cols-2">

    {/* LEFT */}

    <div>
      <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-purple-400/20 bg-purple-500/10 px-4 py-2 text-sm text-purple-200">
        <Sparkles size={15} />
        Conheça a Lumi AI
      </div>

      <h2 className="text-5xl font-black leading-tight md:text-6xl">
        Sua mentora inteligente de idiomas.
      </h2>

      <p className="mt-6 max-w-2xl text-lg leading-8 text-gray-300">
        A Lumi acompanha sua evolução no IELTS e DELF/DALF,
        corrige redações, ajuda no speaking e oferece feedback
        inteligente baseado nos critérios reais das provas.
      </p>

      <div className="mt-10 grid gap-4 md:grid-cols-2">

        <div className="elan-glass rounded-3xl p-5">
          <Brain className="mb-4 text-purple-300" size={26} />

          <h3 className="text-xl font-bold">
            Correção Inteligente
          </h3>

          <p className="mt-2 text-sm leading-6 text-gray-400">
            Feedback baseado nos critérios oficiais.
          </p>
        </div>

        <div className="elan-glass rounded-3xl p-5">
          <Mic className="mb-4 text-blue-300" size={26} />

          <h3 className="text-xl font-bold">
            Speaking Assistant
          </h3>

          <p className="mt-2 text-sm leading-6 text-gray-400">
            Ajuda com fluência, pronúncia e confiança.
          </p>
        </div>

      </div>
    </div>

    {/* RIGHT */}

    <div className="relative flex justify-center">

      <div className="absolute h-72 w-72 rounded-full bg-purple-500/20 blur-3xl" />

      <img
        src={lumiImage}
        alt="Lumi AI"
        className="relative z-10 w-full max-w-md drop-shadow-[0_0_60px_rgba(168,85,247,0.45)]"
      />
    </div>
  </div>

  {/* CHAT */}

  <div className="mt-24">
    <div className="elan-glass mx-auto max-w-4xl rounded-[2rem] p-8">

      <p className="mb-8 text-center text-3xl font-black">
        Converse com a Lumi
      </p>

      <div className="space-y-5">

        <div className="ml-auto max-w-md rounded-3xl bg-purple-600 px-5 py-4 text-sm">
          How can I improve my speaking?
        </div>

        <div className="max-w-xl rounded-3xl border border-white/10 bg-white/5 px-5 py-4 text-sm text-gray-300">
          Try speaking daily using IELTS topics and focus on fluency first.
        </div>

      </div>

      <button
        className="mt-8 w-full rounded-2xl bg-gradient-to-r from-purple-600 to-blue-500 px-6 py-4 font-bold transition hover:scale-[1.01]"
      >
        Open Lumi Assistant
      </button>
    </div>
  </div>
</section>

      <section className="relative z-10 mx-auto max-w-7xl px-6 pb-24">
        <div className="elan-glass elan-glow-card rounded-[2rem] p-8 text-center md:p-12">
          <h2 className="text-4xl font-black">Entre no modo simulado quando estiver pronto.</h2>
          <p className="mx-auto mt-4 max-w-2xl text-gray-300">
            Comece com treinos livres ou avance para uma sequência completa de prova.
          </p>
          <div className="mt-7 flex justify-center gap-3">
            <Link to="/simulado" className="rounded-xl bg-purple-600 px-6 py-3 text-sm font-bold hover:bg-purple-500">
              Simulado completo
            </Link>
            <Link to="/flashcards" className="rounded-xl border border-white/15 bg-white/8 px-6 py-3 text-sm font-bold hover:bg-white/12">
              Revisar flashcards
            </Link>
          </div>
        </div>
      </section>

      
    </div>
  );
}
