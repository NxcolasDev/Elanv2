<main className="flex-1 flex flex-col">

  {/* HEADER */}
  <header className="h-16 border-b border-purple-900 flex items-center justify-between px-6">

    <h1 className="font-semibold text-lg">
      Dashboard
    </h1>

    <div className="flex items-center gap-4">

      <div className="text-sm text-gray-300">
        🇬🇧 Inglês | IELTS
      </div>

      <div className="w-9 h-9 bg-purple-500 rounded-full"></div>

    </div>

  </header>

  {/* CONTEÚDO */}
  <div className="p-6 overflow-auto">
    {children}
  </div>

</main>