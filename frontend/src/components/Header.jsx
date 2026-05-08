export default function Header({ children, title = "Dashboard" }) {
  return (
    <main className="flex flex-1 flex-col">
      <header className="flex h-16 items-center justify-between border-b border-purple-900 px-6">
        <h1 className="text-lg font-semibold">{title}</h1>

        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-300">Inglês | IELTS</div>
          <div className="h-9 w-9 rounded-full bg-purple-500" />
        </div>
      </header>

      <div className="overflow-auto p-6">{children}</div>
    </main>
  );
}
