import { useEffect, useState } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const progressData = [
  { name: "Semana 1", ielts: 4.5, delf: 3.0 },
  { name: "Semana 2", ielts: 5.0, delf: 3.5 },
  { name: "Semana 3", ielts: 5.5, delf: 4.0 },
  { name: "Semana 4", ielts: 6.0, delf: 4.5 },
];

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const uid = params.get("uid");

    if (!uid) {
      setLoading(false);
      return;
    }

    const loadUser = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/users/${uid}`
        );
        setUser(res.data);
      } catch (err) {
        console.error("Erro ao buscar usuário:", err);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#0a0a0a] text-white">
        Carregando ELAN...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#0a0a0a] text-red-500">
        Usuário não encontrado
      </div>
    );
  }

  // progresso fake (depois vira cálculo real)
  const progress = 65;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">

      {/* HEADER */}
      <div className="flex justify-between items-center px-6 py-5 border-b border-purple-900/30">

        <div>
          <h1 className="text-2xl font-bold text-purple-500">
            ELAN
          </h1>
          <p className="text-xs text-gray-500">
            Plataforma de Simulados de Idiomas
          </p>
        </div>

        <div className="flex items-center gap-3 bg-[#111] px-3 py-2 rounded-xl border border-purple-900/40">
          <img
            src={user.photoURL}
            className="w-9 h-9 rounded-full"
          />
          <span className="text-sm text-gray-300">
            {user.name}
          </span>
        </div>

      </div>

      {/* PROGRESSO GERAL */}
      <div className="p-6">

        <h2 className="text-sm text-gray-400 mb-3">
          Seu progresso geral
        </h2>

        <div className="bg-[#111] border border-purple-900/40 rounded-2xl p-5">

          <div className="w-full bg-black rounded-full h-2 mb-2">
            <div
              className="bg-purple-500 h-2 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>

          <p className="text-xs text-gray-500">
            {progress}% do sistema concluído
          </p>

        </div>
      </div>
      <div className="px-6 mt-6">

  <h2 className="text-sm text-gray-400 mb-3">
    Evolução de desempenho
  </h2>

  <div className="bg-[#111] border border-purple-900/40 rounded-2xl p-5">

    <ResponsiveContainer width="100%" height={250}>
      <LineChart data={progressData}>

        <XAxis dataKey="name" stroke="#888" />
        <YAxis stroke="#888" />
        <Tooltip />

        <Line
          type="monotone"
          dataKey="ielts"
          stroke="#a855f7"
          strokeWidth={2}
        />

        <Line
          type="monotone"
          dataKey="delf"
          stroke="#60a5fa"
          strokeWidth={2}
        />

      </LineChart>
        </ResponsiveContainer>

    </div>

    </div>

      {/* CARDS */}
      <div className="px-6 grid grid-cols-1 md:grid-cols-2 gap-6 pb-10">

        {/* IELTS */}
        <div className="bg-[#111] border border-purple-900/40 rounded-2xl p-6 hover:border-purple-500 transition">

          <h2 className="text-purple-400 font-bold mb-4">
            IELTS
          </h2>

          <div className="space-y-3 text-sm text-gray-300">

            <p>📘 Reading: {user.ielts?.reading}</p>
            <p>✍️ Writing: {user.ielts?.writing}</p>
            <p>🎧 Listening: {user.ielts?.listening}</p>
            <p>🗣️ Speaking: {user.ielts?.speaking}</p>

          </div>

          <button className="mt-4 w-full bg-purple-600 hover:bg-purple-700 transition py-2 rounded-xl text-sm">
            Fazer simulado IELTS
          </button>

        </div>

        {/* DELF */}
        <div className="bg-[#111] border border-purple-900/40 rounded-2xl p-6 hover:border-purple-500 transition">

          <h2 className="text-purple-400 font-bold mb-4">
            DELF
          </h2>

          <div className="space-y-3 text-sm text-gray-300">

            <p>📘 Reading: {user.delf?.reading}</p>
            <p>✍️ Writing: {user.delf?.writing}</p>
            <p>🎧 Listening: {user.delf?.listening}</p>
            <p>🗣️ Speaking: {user.delf?.speaking}</p>

          </div>

          <button className="mt-4 w-full bg-purple-600 hover:bg-purple-700 transition py-2 rounded-xl text-sm">
            Fazer simulado DELF
          </button>

        </div>

      </div>

    </div>
  );
}