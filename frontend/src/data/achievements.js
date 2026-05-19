export const achievements = [
  {
    id: "first-writing",
    title: "Primeiro Texto",
    description: "Complete sua primeira redação.",
    icon: "✍️",
    category: "Writing",
    requirement: (stats) => stats.writingCount >= 1,
  },

  {
    id: "writing-10",
    title: "Escritor Consistente",
    description: "Complete 10 redações.",
    icon: "📝",
    category: "Writing",
    requirement: (stats) => stats.writingCount >= 10,
  },

  {
    id: "writing-50",
    title: "Máquina de Writing",
    description: "Complete 50 redações.",
    icon: "🔥",
    category: "Writing",
    requirement: (stats) => stats.writingCount >= 50,
  },

  {
    id: "first-speaking",
    title: "Primeira Conversa",
    description: "Complete um treino de speaking.",
    icon: "🎤",
    category: "Speaking",
    requirement: (stats) => stats.speakingCount >= 1,
  },

  {
    id: "speaking-20",
    title: "Fluência em Construção",
    description: "Complete 20 sessões de speaking.",
    icon: "🗣️",
    category: "Speaking",
    requirement: (stats) => stats.speakingCount >= 20,
  },

  {
    id: "first-reading",
    title: "Leitor Inicial",
    description: "Complete um treino de reading.",
    icon: "📖",
    category: "Reading",
    requirement: (stats) => stats.readingCount >= 1,
  },

  {
    id: "reading-30",
    title: "Leitor Avançado",
    description: "Complete 30 leituras.",
    icon: "📚",
    category: "Reading",
    requirement: (stats) => stats.readingCount >= 30,
  },

  {
    id: "first-listening",
    title: "Primeira Escuta",
    description: "Complete um listening.",
    icon: "🎧",
    category: "Listening",
    requirement: (stats) => stats.listeningCount >= 1,
  },

  {
    id: "listening-25",
    title: "Ouvido Treinado",
    description: "Complete 25 listenings.",
    icon: "🔊",
    category: "Listening",
    requirement: (stats) => stats.listeningCount >= 25,
  },

  {
    id: "first-flashcard",
    title: "Memória Ativada",
    description: "Revise um flashcard.",
    icon: "🧠",
    category: "Flashcards",
    requirement: (stats) => stats.flashcardReviews >= 1,
  },

  {
    id: "flashcards-100",
    title: "Mestre da Memorização",
    description: "Revise 100 flashcards.",
    icon: "⚡",
    category: "Flashcards",
    requirement: (stats) => stats.flashcardReviews >= 100,
  },

  {
    id: "streak-3",
    title: "3 Dias Seguidos",
    description: "Mantenha uma streak de 3 dias.",
    icon: "🔥",
    category: "Streak",
    requirement: (stats) => stats.streak >= 3,
  },

  {
    id: "streak-7",
    title: "Semana Perfeita",
    description: "Mantenha uma streak de 7 dias.",
    icon: "📅",
    category: "Streak",
    requirement: (stats) => stats.streak >= 7,
  },

  {
    id: "streak-30",
    title: "Disciplina Extrema",
    description: "Mantenha uma streak de 30 dias.",
    icon: "👑",
    category: "Streak",
    requirement: (stats) => stats.streak >= 30,
  },

  {
    id: "band-5",
    title: "Band 5",
    description: "Alcance band 5.",
    icon: "⭐",
    category: "Score",
    requirement: (stats) => stats.bestScore >= 5,
  },

  {
    id: "band-6",
    title: "Band 6",
    description: "Alcance band 6.",
    icon: "🌟",
    category: "Score",
    requirement: (stats) => stats.bestScore >= 6,
  },

  {
    id: "band-7",
    title: "Band 7",
    description: "Alcance band 7.",
    icon: "💎",
    category: "Score",
    requirement: (stats) => stats.bestScore >= 7,
  },

  {
    id: "band-8",
    title: "Band 8",
    description: "Alcance band 8.",
    icon: "🚀",
    category: "Score",
    requirement: (stats) => stats.bestScore >= 8,
  },

  {
    id: "study-60",
    title: "1 Hora de Estudo",
    description: "Acumule 60 minutos.",
    icon: "⏳",
    category: "Tempo",
    requirement: (stats) => stats.studyMinutes >= 60,
  },

  {
    id: "study-600",
    title: "10 Horas de Estudo",
    description: "Acumule 600 minutos.",
    icon: "⌛",
    category: "Tempo",
    requirement: (stats) => stats.studyMinutes >= 600,
  },

  {
    id: "study-3000",
    title: "Veterano",
    description: "Acumule 3000 minutos.",
    icon: "🏆",
    category: "Tempo",
    requirement: (stats) => stats.studyMinutes >= 3000,
  },

  {
    id: "complete-all",
    title: "Poliglota",
    description: "Faça treino em todas as skills.",
    icon: "🌍",
    category: "Geral",
    requirement: (stats) =>
      stats.readingCount >= 1 &&
      stats.listeningCount >= 1 &&
      stats.writingCount >= 1 &&
      stats.speakingCount >= 1,
  },

  {
    id: "history-20",
    title: "Histórico Rico",
    description: "Tenha 20 atividades salvas.",
    icon: "📈",
    category: "Histórico",
    requirement: (stats) => stats.totalActivities >= 20,
  },

  {
    id: "history-100",
    title: "Lenda do ELAN",
    description: "Tenha 100 atividades salvas.",
    icon: "🏅",
    category: "Histórico",
    requirement: (stats) => stats.totalActivities >= 100,
  },
];