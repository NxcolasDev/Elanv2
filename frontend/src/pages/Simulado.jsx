import { useEffect, useState } from "react";
import axios from "axios";

export default function Simulado() {
  const [topics, setTopics] = useState([]);
  const [text, setText] = useState("");
  const [correction, setCorrection] = useState(null);
  const [loading, setLoading] = useState(false);

  const API = "http://localhost:5000/api/exams/generate";

  const loadTopics = async () => {
    try {
      const res = await axios.post(API, {
        mode: "topics"
      });

      setTopics(res.data.topics || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCorrection = async () => {
    if (!text) return;

    setLoading(true);

    try {
      const res = await axios.post(API, {
        mode: "correction",
        text
      });

      setCorrection(res.data.correction);
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  };

  useEffect(() => {
    loadTopics();
  }, []);

  return (
    <div className="p-6 text-white min-h-screen bg-[#0a0a0a]">

      <h1 className="text-2xl mb-4 text-purple-400">
        IELTS Writing
      </h1>

      {/* BOTÃO TEMAS */}
      <button
        onClick={loadTopics}
        className="bg-purple-600 px-4 py-2 rounded mb-4"
      >
        🔄 Atualizar temas
      </button>

      {/* TEMAS */}
      <div className="mb-6">
        {topics.map((t, i) => (
          <p key={i} className="mb-2 text-gray-300">
            {t}
          </p>
        ))}
      </div>

      {/* TEXTAREA */}
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="w-full h-40 bg-black p-3 rounded mb-4 outline-none"
        placeholder="Escreva sua redação..."
      />

      {/* BOTÃO CORRIGIR */}
      <button
        onClick={handleCorrection}
        className="bg-green-600 px-4 py-2 rounded"
      >
        {loading ? "Corrigindo..." : "Corrigir com IA"}
      </button>

      {/* RESULTADO */}
      {correction && (
        <div className="mt-6 bg-[#111] p-4 rounded">

          <h2 className="text-purple-400 text-lg">
            Band: {correction?.band}
          </h2>

          <h3 className="mt-3 font-semibold">Correções:</h3>
          <ul className="text-gray-300">
            {correction?.corrections?.map((c, i) => (
              <li key={i}>• {c}</li>
            ))}
          </ul>

          <h3 className="mt-3 font-semibold">Texto melhorado:</h3>
          <p className="text-gray-300">
            {correction?.improvedText}
          </p>

          <h3 className="mt-3 font-semibold">Feedback:</h3>
          <p className="text-gray-300">
            {correction?.feedback}
          </p>

        </div>
      )}

    </div>
  );
}