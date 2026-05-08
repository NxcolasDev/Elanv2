import { useState } from "react";
import { CalendarDays, Plus, Trash2 } from "lucide-react";
import MainLayout from "../layouts/MainLayout";
import { getScheduleTasks, saveScheduleTasks } from "../services/scheduleStorage";

export default function Schedule() {
  const [tasks, setTasks] = useState(() => getScheduleTasks());
  const [day, setDay] = useState("Segunda");
  const [task, setTask] = useState("");

  const persist = (nextTasks) => {
    setTasks(saveScheduleTasks(nextTasks));
  };

  const addTask = () => {
    if (!task.trim()) return;
    persist([
      {
        id: crypto.randomUUID?.() || `${Date.now()}`,
        day,
        task: task.trim(),
        done: false,
      },
      ...tasks,
    ]);
    setTask("");
  };

  return (
    <MainLayout>
      <div className="mx-auto max-w-6xl space-y-6 text-white">
        <section className="elan-glass elan-glow-card rounded-[2rem] p-6">
          <p className="text-sm text-purple-200">Planejamento semanal</p>
          <h1 className="mt-2 text-4xl font-black">Cronograma</h1>
          <p className="mt-3 text-sm text-gray-400">
            Tarefas reais salvas por usuário no navegador.
          </p>
        </section>

        <section className="elan-glass rounded-3xl p-5">
          <h2 className="font-bold">Nova tarefa</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-[180px_1fr_auto]">
            <select
              value={day}
              onChange={(event) => setDay(event.target.value)}
              className="rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm outline-none"
            >
              {["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"].map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
            <input
              value={task}
              onChange={(event) => setTask(event.target.value)}
              className="rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm outline-none focus:border-purple-400"
              placeholder="Ex: DELF compréhension orale B2"
            />
            <button onClick={addTask} className="inline-flex items-center gap-2 rounded-xl bg-purple-600 px-4 py-2 text-sm font-bold hover:bg-purple-500">
              <Plus size={16} />
              Adicionar
            </button>
          </div>
        </section>

        <div className="grid gap-4 md:grid-cols-2">
          {tasks.map((item) => (
            <div key={item.id} className="elan-glass rounded-3xl p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <CalendarDays className="mb-4 text-purple-300" size={24} />
                  <p className="font-semibold">{item.day}</p>
                  <p className="mt-2 text-sm text-gray-400">{item.task}</p>
                </div>
                <button
                  onClick={() => persist(tasks.filter((taskItem) => taskItem.id !== item.id))}
                  className="rounded-xl p-2 text-gray-500 hover:bg-red-500/10 hover:text-red-200"
                >
                  <Trash2 size={16} />
                </button>
              </div>
              <label className="mt-4 flex items-center gap-2 text-sm text-gray-300">
                <input
                  type="checkbox"
                  checked={Boolean(item.done)}
                  onChange={() =>
                    persist(
                      tasks.map((taskItem) =>
                        taskItem.id === item.id ? { ...taskItem, done: !taskItem.done } : taskItem
                      )
                    )
                  }
                />
                Concluída
              </label>
            </div>
          ))}
        </div>
      </div>
    </MainLayout>
  );
}
