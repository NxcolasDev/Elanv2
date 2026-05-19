export const readingContent = {
  IELTS: {
    title: "IELTS Reading",
    duration: 60,
    scoreLabel: "Band",
    description: "3 academic passages, 40 questions, 60 minutes.",
    passage:
      "Universities are increasingly expected to prepare students for a labour market shaped by automation, climate policy and global collaboration. While traditional lectures still play a role, many institutions now combine academic theory with project-based learning. Students may analyse real datasets, propose solutions to local problems, or work with companies before graduation.\n\nSupporters argue that this approach makes education more relevant. It can improve communication, critical thinking and confidence. However, critics warn that universities should not become training centres for short-term employment trends. They argue that higher education must also protect curiosity, independent research and the ability to question social assumptions.\n\nThe most successful programmes appear to balance both aims. They preserve rigorous academic standards while giving students opportunities to apply knowledge beyond the classroom. This balance is difficult to achieve, but it may be essential for graduates who need both specialist knowledge and adaptable skills.",
    questionSeed: [
      {
        type: "multiple",
        question: "What is the main idea of the passage?",
        options: ["A. Universities should stop using lectures", "B. Education is balancing theory with practical skills", "C. Companies should control universities", "D. Automation has ended academic research"],
        answer: "B. Education is balancing theory with practical skills",
      },
      {
        type: "true_false_not_given",
        question: "Critics believe universities should protect independent research.",
        options: ["True", "False", "Not Given"],
        answer: "True",
      },
      {
        type: "matching_headings",
        question: "Choose the best heading: paragraph 3",
        options: ["A. A balanced model", "B. The end of exams", "C. A new campus", "D. Student accommodation"],
        answer: "A. A balanced model",
      },
      {
        type: "fill_blank",
        question: "Graduates need specialist knowledge and ____ skills.",
        answer: "adaptable",
      },
    ],
  },
  DELF: {
    title: "DELF/DALF Compréhension écrite",
    duration: 45,
    scoreLabel: "Points",
    description: "Textes en français, questions de compréhension et justification.",
    passage:
      "Dans de nombreuses villes françaises, les bibliothèques changent de rôle. Elles ne sont plus seulement des lieux où l'on emprunte des livres. Elles proposent désormais des ateliers numériques, des espaces de travail partagés et des rencontres avec des auteurs. Cette évolution répond à de nouveaux besoins sociaux : apprendre tout au long de la vie, accéder gratuitement à l'information et créer du lien entre les habitants.\n\nCependant, certains usagers regrettent le silence et la simplicité des bibliothèques traditionnelles. Selon eux, trop d'activités peuvent transformer ces lieux en centres culturels bruyants. Les responsables répondent qu'il est possible de préserver des espaces calmes tout en ouvrant la bibliothèque à de nouveaux publics.\n\nLe défi consiste donc à trouver un équilibre entre tradition et innovation. Une bibliothèque moderne doit rester un lieu de lecture, mais elle peut aussi devenir un espace d'inclusion et de participation citoyenne.",
    questionSeed: [
      {
        type: "multiple",
        question: "Quel est le thème principal du texte ?",
        options: ["A. La fermeture des bibliothèques", "B. L'évolution du rôle des bibliothèques", "C. Le prix des livres", "D. Les auteurs étrangers"],
        answer: "B. L'évolution du rôle des bibliothèques",
      },
      {
        type: "vrai_faux",
        question: "Les bibliothèques proposent parfois des ateliers numériques.",
        options: ["Vrai", "Faux", "On ne sait pas"],
        answer: "Vrai",
      },
      {
        type: "justification",
        question: "Quel équilibre les bibliothèques doivent-elles trouver ?",
        answer: "entre tradition et innovation",
      },
      {
        type: "fill_blank",
        question: "Une bibliothèque moderne peut devenir un espace d'inclusion et de ____ citoyenne.",
        answer: "participation",
      },
    ],
  },
};

export const listeningContent = {
 IELTS: {
  duration: 30,
  title: "IELTS Listening Mock Test",
  lang: "en-US",

  sections: [
    {
      title: "Section 1 - Transport Information",

      script: `
Good morning everyone.

This is an announcement for passengers traveling to Cambridge this morning.

The 8:45 train has been delayed because of technical issues and will now leave at 9:10 from platform 4.

Passengers are reminded to keep their tickets ready before boarding the train.

Large luggage should be placed near the rear doors.

Please note that food and drinks are not allowed in silent areas.

If you require assistance, please speak to a member of staff wearing a yellow jacket.

Thank you for your patience and we apologize for the inconvenience.
      `,

      seed: [
        [
          "What time will the train depart?",
          ["8:45", "9:10", "9:30", "10:00"],
          "9:10"
        ],
        [
          "Which platform should passengers go to?",
          ["1", "2", "3", "4"],
          "4"
        ],
        [
          "Who can passengers ask for help?",
          [
            "Police officers",
            "Train drivers",
            "Staff wearing yellow jackets",
            "Ticket inspectors"
          ],
          "Staff wearing yellow jackets"
        ],
        [
          "Where should large luggage be placed?",
          [
            "Front doors",
            "Rear doors",
            "Middle carriage",
            "Under seats"
          ],
          "Rear doors"
        ],
        [
          "What is not allowed in silent areas?",
          [
            "Phones",
            "Food and drinks",
            "Children",
            "Music"
          ],
          "Food and drinks"
        ]
      ]
    },

    {
      title: "Section 2 - University Orientation",

      script: `
Welcome to Greenhill University.

Today we will provide information about the campus facilities available for new students.

The library opens daily from 7 a.m. until midnight.

Students can access free tutoring sessions every Wednesday afternoon in Building C.

The cafeteria serves breakfast, lunch, and dinner at affordable prices.

International students may also request language support classes during the semester.

Sports facilities include a swimming pool, basketball courts, and a modern fitness center.

Thank you and enjoy your first week at university.
      `,

      seed: [
        [
          "What time does the library close?",
          ["10 p.m.", "11 p.m.", "Midnight", "1 a.m."],
          "Midnight"
        ],
        [
          "Where are tutoring sessions located?",
          ["Building A", "Building B", "Building C", "Building D"],
          "Building C"
        ],
        [
          "When are tutoring sessions available?",
          [
            "Monday morning",
            "Wednesday afternoon",
            "Friday evening",
            "Saturday morning"
          ],
          "Wednesday afternoon"
        ],
        [
          "Who can request language support?",
          [
            "Teachers",
            "Local students",
            "International students",
            "Visitors"
          ],
          "International students"
        ],
        [
          "Which sports facility is mentioned?",
          [
            "Football field",
            "Tennis court",
            "Swimming pool",
            "Ice rink"
          ],
          "Swimming pool"
        ]
      ]
    },

    {
      title: "Section 3 - Student Discussion",

      script: `
Anna and James are discussing their science project.

Anna believes climate change is the most important environmental issue today.

James agrees but thinks pollution in large cities should also receive more attention.

Their presentation will focus on renewable energy and recycling systems.

The students plan to interview local residents next Friday afternoon.

Their professor requested at least three academic sources for the project.

The final presentation will happen at the end of the month.
      `,

      seed: [
        [
          "What topic are the students discussing?",
          [
            "History project",
            "Science project",
            "Business project",
            "Math project"
          ],
          "Science project"
        ],
        [
          "What issue does Anna consider most important?",
          [
            "Traffic",
            "Poverty",
            "Climate change",
            "Education"
          ],
          "Climate change"
        ],
        [
          "What does James think deserves more attention?",
          [
            "Healthcare",
            "Pollution",
            "Technology",
            "Housing"
          ],
          "Pollution"
        ],
        [
          "When will they interview residents?",
          [
            "Monday morning",
            "Tuesday evening",
            "Friday afternoon",
            "Saturday afternoon"
          ],
          "Friday afternoon"
        ],
        [
          "How many academic sources are required?",
          ["1", "2", "3", "5"],
          "3"
        ]
      ]
    },

    {
      title: "Section 4 - Environmental Lecture",

      script: `
Today’s lecture focuses on the effects of plastic pollution in the oceans.

Every year, millions of tons of plastic waste enter marine environments.

This pollution affects fish, sea birds, and many other species.

Researchers are currently studying alternative materials that decompose more quickly.

Governments around the world are introducing policies to reduce single-use plastics.

Experts believe education is one of the most effective tools to change consumer behavior.

Individuals can also help by recycling properly and reducing unnecessary waste.
      `,

      seed: [
        [
          "What is the lecture about?",
          [
            "Forest fires",
            "Ocean pollution",
            "Space travel",
            "Urban transport"
          ],
          "Ocean pollution"
        ],
        [
          "What enters marine environments every year?",
          [
            "Oil",
            "Chemicals",
            "Plastic waste",
            "Glass"
          ],
          "Plastic waste"
        ],
        [
          "What are researchers studying?",
          [
            "New vehicles",
            "Alternative materials",
            "Animal behavior",
            "Weather systems"
          ],
          "Alternative materials"
        ],
        [
          "What are governments reducing?",
          [
            "Taxes",
            "Imports",
            "Single-use plastics",
            "Factories"
          ],
          "Single-use plastics"
        ],
        [
          "What can individuals do?",
          [
            "Travel more",
            "Buy more products",
            "Recycle properly",
            "Use more plastic"
          ],
          "Recycle properly"
        ]
      ]
    }
  ]
  },
  DELF: {
    title: "DELF/DALF Compréhension orale",
    duration: 30,
    lang: "fr-FR",
    sections: [
      {
        title: "Document 1",
        script:
          "Bonjour, vous écoutez Radio Ville. Aujourd'hui, la mairie annonce l'ouverture d'une nouvelle médiathèque près de la gare. Elle proposera des livres, des ateliers numériques et une salle de travail.",
        seed: [
          ["Quel lieu va ouvrir près de la gare ?", ["A. Un cinéma", "B. Une médiathèque", "C. Un restaurant", "D. Une école"], "B. Une médiathèque"],
          ["Que proposera ce lieu ?", ["A. Des ateliers numériques", "B. Des cours de sport", "C. Des concerts chaque soir", "D. Des voyages"], "A. Des ateliers numériques"],
        ],
      },
      {
        title: "Document 2",
        script:
          "Le professeur rappelle aux étudiants que le dossier écrit doit être rendu vendredi avant midi. La présentation orale aura lieu la semaine prochaine.",
        seed: [
          ["Quand faut-il rendre le dossier ?", ["A. Lundi", "B. Mercredi", "C. Vendredi avant midi", "D. Dimanche soir"], "C. Vendredi avant midi"],
          ["Quelle activité aura lieu la semaine prochaine ?", ["A. Une présentation orale", "B. Un voyage", "C. Un examen médical", "D. Un concert"], "A. Une présentation orale"],
        ],
      },
    ],
  },
};

export const speakingBanks = {
  IELTS: {
    lang: "en-US",
    title: "IELTS Speaking",
    parts: {
      1: [["Where are you from?", "Do you enjoy studying English?", "What do you usually do at weekends?"]],
      2: ["Describe a person who helped you learn something important."],
      3: [["How has education changed in recent years?", "Should schools focus more on practical skills?", "What makes a good teacher?"]],
    },
  },
  DELF: {
    lang: "fr-FR",
    title: "DELF/DALF Production orale",
    parts: {
      1: [["Présentez-vous brièvement.", "Parlez de votre ville.", "Qu'aimez-vous faire pendant votre temps libre ?"]],
      2: ["Décrivez une expérience d'apprentissage importante pour vous."],
      3: [["Pourquoi apprend-on une langue étrangère ?", "La technologie aide-t-elle vraiment l'apprentissage ?", "Comment encourager les jeunes à lire davantage ?"]],
    },
  },
};

export const writingContent = {
  IELTS: {
    title: "IELTS Writing",
    task1Label: "Task 1 (Graph/Map/Process)",
    task2Label: "Task 2 (Essay)",
    placeholder: "Write your essay...",
    criteria: ["task achievement", "coherence", "lexical resource", "grammar"],
    topics: [
      "Some people believe that remote work improves productivity. To what extent do you agree?",
      "Universities should prepare students for employment rather than academic research. Discuss both views.",
    ],
  },
  DELF: {
    title: "DELF/DALF Production écrite",
    task1Label: "Écrit guidé",
    task2Label: "Essai argumentatif",
    placeholder: "Rédigez votre réponse en français...",
    criteria: ["respect de la consigne", "cohérence", "lexique", "grammaire"],
    topics: [
      "Vous écrivez au maire pour proposer une amélioration dans votre quartier.",
      "Faut-il limiter l'utilisation des téléphones portables à l'école ? Donnez votre opinion.",
    ],
  },
};

export function expandQuestions(seed, total = 40) {
  return Array.from({ length: total }, (_, index) => {
    const source = seed[index % seed.length];
    return {
      ...source,
      id: index + 1,
      question: `${source.question}${index >= seed.length ? ` (${Math.floor(index / seed.length) + 1})` : ""}`,
    };
  });
}
