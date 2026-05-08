import { NotebookPen } from "lucide-react";
import MainLayout from "../layouts/MainLayout";

export default function Notes() {
  return (
    <MainLayout>
      <div className="mx-auto max-w-5xl text-white">
        <div className="mb-6">
          <p className="text-sm text-gray-400">Organização de estudo</p>
          <h1 className="text-3xl font-semibold">Anotações</h1>
        </div>

        <div className="rounded-lg border border-white/10 bg-[#111318] p-6">
          <NotebookPen className="mb-4 text-purple-300" size={28} />
          <h2 className="text-lg font-semibold">Caderno IELTS</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-400">
            Espaço reservado para salvar vocabulário, erros comuns e comentários de aulas.
          </p>
          <textarea
            className="mt-5 h-56 w-full rounded-lg border border-white/10 bg-black/30 p-4 text-sm outline-none focus:border-purple-400"
            placeholder="Escreva suas anotações..."
          />
        </div>
      </div>
    </MainLayout>
  );
}
