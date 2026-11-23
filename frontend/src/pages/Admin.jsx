import { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import { api, getApiErrorMessage } from "../services/api";

const labels = { reading: "Reading", listening: "Listening", modelStudy: "Modelo de Writing ou Speaking" };
const states = { draft: "Rascunho", reviewed: "Revisado", published: "Publicado" };
const actions = {
  draft: ["review", "Marcar como revisado"],
  reviewed: ["publish", "Publicar"],
  published: ["unpublish", "Despublicar"],
};
const button = "rounded-xl bg-purple-600 px-4 py-2 text-sm font-semibold hover:bg-purple-500 disabled:opacity-50";
const field = "rounded-xl border border-white/15 bg-slate-950 px-3 py-2 text-white";
const blank = { kind: "reading", exam: "IELTS", focus: "" };

export default function Admin() {
  const [status, setStatus] = useState(null);
  const [items, setItems] = useState([]);
  const [history, setHistory] = useState([]);
  const [form, setForm] = useState(blank);
  const [editor, setEditor] = useState("");
  const [editing, setEditing] = useState(null);
  const [busy, setBusy] = useState(true);
  const [error, setError] = useState("");

  async function refresh() {
    const [health, content, generations] = await Promise.all([
      api.get("/api/admin/status"), api.get("/api/admin/content"), api.get("/api/admin/generations"),
    ]);
    setStatus(health.data);
    setItems(content.data);
    setHistory(generations.data);
  }

  async function perform(operation) {
    setBusy(true);
    setError("");
    try {
      await operation();
    } catch (failure) {
      setError(failure instanceof SyntaxError ? "Corrija o JSON do conteúdo." :
        getApiErrorMessage(failure, "Não foi possível concluir a operação."));
    } finally {
      setBusy(false);
    }
  }

  useEffect(() => {
    const timer = window.setTimeout(() => perform(refresh), 0);
    return () => window.clearTimeout(timer);
  }, []);

  function select(item) {
    setEditing(item);
    setForm({ kind: item.kind, exam: item.exam, focus: "" });
    setEditor(JSON.stringify(item.payload, null, 2));
  }

  function reset() {
    setEditing(null);
    setForm(blank);
    setEditor("");
  }

  const preview = () => perform(async () => {
    const { data } = await api.post("/api/admin/preview", form);
    setEditor(JSON.stringify(data.payload, null, 2));
    await refresh();
  });

  const save = () => perform(async () => {
    const payload = JSON.parse(editor);
    if (editing) {
      await api.patch(`/api/admin/content/${editing._id}`, { action: "edit", revision: editing.__v, payload });
    } else {
      await api.post("/api/admin/content", { ...form, payload });
    }
    reset();
    await refresh();
  });

  return (
    <MainLayout>
      <main className="mx-auto max-w-6xl space-y-6 text-white">
        <header className="elan-glass rounded-3xl p-6">
          <h1 className="text-3xl font-black">Administração</h1>
          {status && <p className="mt-2 text-sm text-purple-200">
            MongoDB {status.database} · Gemini {status.geminiConfigured ? "configurado" : "indisponível"} · Prompt {status.version}
          </p>}
        </header>
        {error && <p role="alert" className="rounded-xl bg-red-950 p-4 text-red-100">{error}</p>}
        {busy && <p role="status" className="text-sm text-purple-200">Processando…</p>}
        {status && <>
          <section className="elan-glass space-y-4 rounded-3xl p-6">
            <h2 className="text-xl font-bold">{editing ? "Revisar conteúdo" : "Gerar e testar conteúdo"}</h2>
            <fieldset disabled={busy || Boolean(editing)} className="grid gap-3 md:grid-cols-3">
              <label className="grid gap-1">Exame
                <select className={field} value={form.exam} onChange={(event) => setForm({ ...form, exam: event.target.value })}>
                  <option>IELTS</option><option>DELF</option>
                </select>
              </label>
              <label className="grid gap-1">Tipo
                <select className={field} value={form.kind} onChange={(event) => setForm({ ...form, kind: event.target.value })}>
                  {Object.entries(labels).map(([kind, label]) => <option key={kind} value={kind}>{label}</option>)}
                </select>
              </label>
              <label className="grid gap-1">Tema, habilidade ou nível
                <input className={field} maxLength={300} value={form.focus} onChange={(event) => setForm({ ...form, focus: event.target.value })} />
              </label>
            </fieldset>
            <div className="flex flex-wrap gap-2">
              {!editing && <button className={button} disabled={busy} onClick={preview}>Gerar prévia com Gemini</button>}
              {editing && <button className={button} disabled={busy} onClick={reset}>Novo conteúdo</button>}
              <button className={button} disabled={busy || !editor.trim() || editing?.status === "published"} onClick={save}>Salvar rascunho</button>
            </div>
            <label className="grid gap-1">Conteúdo em JSON
              <textarea className={`${field} min-h-60 font-mono text-sm`} value={editor} readOnly={editing?.status === "published"}
                onChange={(event) => setEditor(event.target.value)} spellCheck={false} />
            </label>
          </section>
          <section className="elan-glass space-y-3 rounded-3xl p-6">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-xl font-bold">Banco de questões e modelos</h2>
              <button className={button} disabled={busy} onClick={() => perform(refresh)}>Atualizar</button>
            </div>
            {items.length === 0 && <p>O banco está vazio.</p>}
            {items.map((item) => (
              <div className="flex flex-wrap items-center gap-3 border-t border-white/10 py-3" key={item._id}>
                <span className="mr-auto">{item.payload.title || `${labels[item.kind]} · ${item.exam}`} · {states[item.status]}</span>
                <button className={button} disabled={busy} onClick={() => select(item)}>Abrir conteúdo</button>
                <button className={button} disabled={busy} onClick={() => perform(async () => {
                  await api.patch(`/api/admin/content/${item._id}`, { action: actions[item.status][0], revision: item.__v });
                  if (editing?._id === item._id) reset();
                  await refresh();
                })}>{actions[item.status][1]}</button>
              </div>
            ))}
            {items.length > 0 && items.length % 25 === 0 && <button className={button} disabled={busy} onClick={() => perform(async () => {
              const { data } = await api.get("/api/admin/content", { params: { before: items.at(-1)._id } });
              setItems([...items, ...data]);
            })}>Carregar anteriores</button>}
          </section>
          <section className="elan-glass space-y-3 rounded-3xl p-6">
            <h2 className="text-xl font-bold">Gerações recentes nesta instância</h2>
            <p className="text-sm text-purple-200">Tentativas hoje em UTC · {status.attemptsToday}</p>
            {history.length === 0 && <p>Nenhuma tentativa registrada.</p>}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead><tr>{["Horário", "Modo", "Modelo", "Tentativa", "Resultado", "Duração", "Tokens"].map((heading) => <th className="p-2" key={heading}>{heading}</th>)}</tr></thead>
                <tbody>{history.map((entry, index) => <tr key={`${entry.timestamp}-${index}`} className="border-t border-white/10">
                  {[entry.timestamp, entry.mode, entry.model, entry.attempt, entry.outcome, `${entry.durationMs} ms`, entry.totalTokens ?? "—"].map((value, column) => <td className="p-2" key={column}>{value}</td>)}
                </tr>)}</tbody>
              </table>
            </div>
          </section>
        </>}
      </main>
    </MainLayout>
  );
}
