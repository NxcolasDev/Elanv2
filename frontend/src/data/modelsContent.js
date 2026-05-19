export const modelCategories = [
  {
    id: "writing",
    label: "Writing Models",
    description: "IELTS and DELF essays with structure, vocabulary, grammar, and coherence notes.",
  },
  {
    id: "speaking",
    label: "Speaking Models",
    description: "Natural answers, fluency moves, pronunciation focus, and upgrade phrases.",
  },
  {
    id: "listening",
    label: "Listening Tips",
    description: "Practical strategies for notes, traps, prediction, and concentration.",
  },
  {
    id: "vocabulary",
    label: "Vocabulary Structures",
    description: "Reusable academic and conversational chunks with contextual examples.",
  },
  {
    id: "linking",
    label: "Linking Words",
    description: "Connectors grouped by purpose so writing and speaking feel organized.",
  },
  {
    id: "band",
    label: "High Band Strategies",
    description: "Precise habits that raise clarity, control, and exam performance.",
  },
];

export const studySections = [
  {
    id: "ielts-speaking-part-1",
    label: "IELTS Speaking Part 1",
    focus: "IELTS Speaking Part 1 personal questions, natural short answers, Band 6-8 vocabulary",
    starter: "Answer directly, add one reason, then include a small personal detail.",
  },
  {
    id: "ielts-speaking-part-2",
    label: "IELTS Speaking Part 2",
    focus: "IELTS Speaking Part 2 cue card structure, 2-minute answer organization, fluency and coherence",
    starter: "Use past, description, feeling, and reflection so the answer has a clear story arc.",
  },
  {
    id: "ielts-speaking-part-3",
    label: "IELTS Speaking Part 3",
    focus: "IELTS Speaking Part 3 abstract discussion, opinion development, examples, cautious language",
    starter: "Make a general claim, explain the reason, then qualify it with depends on the context.",
  },
  {
    id: "ielts-writing-task-1",
    label: "IELTS Writing Task 1",
    focus: "IELTS Academic Writing Task 1 charts, overview, comparisons, trend language",
    starter: "Start with a paraphrase, give a clear overview, then group the main comparisons.",
  },
  {
    id: "ielts-writing-task-2",
    label: "IELTS Writing Task 2",
    focus: "IELTS Writing Task 2 essay structure, thesis, topic sentences, coherence and cohesion",
    starter: "Answer the question directly and make each body paragraph do one job.",
  },
  {
    id: "delf-production-orale",
    label: "DELF production orale",
    focus: "DELF production orale, French opinion structure, argumentation, interaction, natural connectors",
    starter: "State your opinion clearly, justify it, add an example, and invite interaction when appropriate.",
  },
  {
    id: "delf-production-ecrite",
    label: "DELF production ecrite",
    focus: "DELF production ecrite, formal French writing, letters, essays, connectors, register",
    starter: "Respect the format, keep formal register, and move from problem to proposal or argument.",
  },
];

export const writingModels = [
  {
    id: "ielts-remote-work",
    exam: "IELTS Task 2",
    title: "Remote Work and Productivity",
    prompt:
      "Some people believe working from home improves productivity, while others think it weakens teamwork. Discuss both views and give your opinion.",
    modelText:
      "The growth of remote work has changed how many organizations operate. Some argue that working from home makes employees more productive because it removes commuting time and allows people to manage their energy more effectively. Others believe that it can weaken teamwork, especially when complex projects require fast discussion and trust between colleagues.\n\nOn the one hand, remote work can improve concentration. Employees often have more control over their schedule and can complete demanding tasks without constant office interruptions. This flexibility may also reduce stress, which can lead to better long-term performance.\n\nOn the other hand, teamwork can suffer when communication becomes too dependent on messages and meetings. Informal conversations in an office often help people solve problems quickly, share ideas, and build relationships. Without these moments, teams may become efficient individually but less creative collectively.\n\nIn my view, the best solution is a balanced model. Remote work should be used for focused tasks, while regular in-person collaboration should support planning, feedback, and team culture. This approach protects productivity without sacrificing cooperation.",
    structure: ["Clear introduction with both views", "One paragraph for productivity", "One paragraph for teamwork", "Balanced opinion in the conclusion"],
    linkingWords: ["On the one hand", "On the other hand", "especially when", "In my view", "while"],
    vocabulary: ["changed how organizations operate", "manage their energy", "long-term performance", "team culture"],
    grammar: ["Complex clauses with while and because", "Modal language for cautious claims", "Parallel comparison of two views"],
    coherence: "Each paragraph has one main idea and the opinion grows naturally from the discussion.",
  },
  {
    id: "delf-environnement",
    exam: "DELF B2 Production ecrite",
    title: "Transport Public et Environnement",
    prompt:
      "Vous ecrivez au maire de votre ville pour proposer des mesures encourageant l'utilisation des transports publics.",
    modelText:
      "Monsieur le Maire,\n\nJe me permets de vous ecrire afin d'attirer votre attention sur la necessite d'encourager davantage l'utilisation des transports publics dans notre ville. La circulation automobile provoque non seulement des embouteillages quotidiens, mais elle contribue aussi a la pollution de l'air.\n\nTout d'abord, il serait utile d'augmenter la frequence des bus aux heures de pointe. De nombreux habitants renoncent aux transports publics parce qu'ils les trouvent trop lents ou peu fiables. Ensuite, la creation d'un abonnement mensuel moins cher pour les etudiants et les familles pourrait rendre ce choix plus accessible.\n\nEnfin, une campagne d'information montrerait les avantages concrets de ces changements: moins de bruit, une meilleure qualite de vie et une ville plus agreable. Je suis convaincu que ces mesures encourageraient les citoyens a modifier leurs habitudes.\n\nJe vous prie d'agreer, Monsieur le Maire, l'expression de mes salutations distinguees.",
    structure: ["Formal opening", "Problem explanation", "Two concrete proposals", "Persuasive conclusion and formal closing"],
    linkingWords: ["Tout d'abord", "Ensuite", "Enfin", "non seulement... mais aussi"],
    vocabulary: ["attirer votre attention", "heures de pointe", "rendre ce choix plus accessible", "modifier leurs habitudes"],
    grammar: ["Conditional for polite proposals", "Formal register", "Cause and consequence structures"],
    coherence: "The letter moves from problem to solutions and keeps a consistent formal tone.",
  },
];

export const speakingModels = [
  {
    title: "IELTS Part 2: A Useful Skill",
    answer:
      "One useful skill I learned recently is planning my study week. At first it seemed simple, but it helped me understand how much time I was losing between tasks. I now divide my work into short focused blocks, and I leave space for review instead of trying to do everything at the last minute.",
    fluencyTips: ["Start with a direct answer", "Use time markers like at first and now", "Add a reflection at the end"],
    pronunciation: ["Stress content words: useful, planning, focused, review", "Pause after each idea group"],
    vocabulary: ["focused blocks", "leave space for review", "at the last minute"],
  },
  {
    title: "DELF B1/B2: Donner son opinion",
    answer:
      "A mon avis, apprendre une langue avec des contenus authentiques est tres efficace, car on decouvre la langue telle qu'elle est vraiment utilisee. Cependant, il faut aussi travailler la grammaire de facon reguliere pour eviter de repeter les memes erreurs.",
    fluencyTips: ["Open with a clear opinion", "Use contrast with cependant", "Give one practical reason"],
    pronunciation: ["Link common groups: a mon avis, il faut aussi", "Keep final consonants soft unless pronounced in French"],
    vocabulary: ["contenus authentiques", "de facon reguliere", "repeter les memes erreurs"],
  },
];

export const listeningTips = [
  "Read the questions first and predict the type of answer: name, number, reason, opinion, or date.",
  "Write short notes, not full sentences. Your goal is to catch meaning while the audio continues.",
  "Watch for traps: speakers often correct themselves after saying an attractive wrong answer.",
  "Use section pauses to preview the next questions and underline keywords.",
  "If you miss one answer, move on immediately so one gap does not become three gaps.",
];

export const vocabularyStructures = [
  {
    category: "Academic Claims",
    items: [
      ["It is widely argued that...", "It is widely argued that public transport should be more affordable."],
      ["This can be attributed to...", "This can be attributed to rising living costs."],
      ["A practical consequence is...", "A practical consequence is greater pressure on schools."],
    ],
  },
  {
    category: "French Opinion",
    items: [
      ["Il me semble que...", "Il me semble que cette mesure est necessaire."],
      ["Cela permettrait de...", "Cela permettrait de reduire les inegalites."],
      ["Il ne faut pas oublier que...", "Il ne faut pas oublier que le cout reste important."],
    ],
  },
  {
    category: "Speaking Upgrade",
    items: [
      ["What I found interesting was...", "What I found interesting was how quickly my habits changed."],
      ["I would not say it is perfect, but...", "I would not say it is perfect, but it is a realistic solution."],
      ["It depends on the context.", "It depends on the context, especially the learner's goal."],
    ],
  },
];

export const linkingGroups = [
  ["Addition", "Furthermore", "Moreover", "In addition", "De plus", "En outre"],
  ["Contrast", "However", "Nevertheless", "On the other hand", "Cependant", "Toutefois"],
  ["Cause", "because", "as a result of", "due to", "car", "puisque"],
  ["Result", "Therefore", "As a result", "Consequently", "Ainsi", "Par consequent"],
  ["Examples", "For instance", "A clear example is", "Notamment", "Par exemple"],
];

export const highBandStrategies = [
  "Answer the exact question before adding examples or background.",
  "Use fewer memorized phrases and more precise topic vocabulary.",
  "Make paragraph roles obvious: claim, explanation, example, consequence.",
  "In speaking, repair naturally: What I mean is... or Let me put that differently.",
  "Reserve advanced grammar for clarity, not decoration.",
  "Review mistakes by pattern: articles, verb tense, agreement, word form, or pronunciation.",
];
