import { scopedKey } from "./storageScope.js";

const HISTORY_KEY = "elan.examHistory";

export function getExamHistory(userId) {
  try {
    const value = window.localStorage.getItem(scopedKey(HISTORY_KEY, userId));
    const parsed = value ? JSON.parse(value) : [];

    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveExamResult(result, userId) {
  const currentHistory = getExamHistory(userId);

  const nextResult = {
    id: crypto.randomUUID?.() || `${Date.now()}`,
    createdAt: new Date().toISOString(),

    exam: result.exam || "IELTS",
    level: result.level || null,

    skill: result.skill || "Unknown",
    type: result.type || null,

    label: result.label || "",

    score: Number(result.score || 0),
    durationMinutes: Number(result.durationMinutes || 0),

    ...result,
  };

  const nextHistory = [nextResult, ...currentHistory].slice(0, 100);

  try {
    window.localStorage.setItem(
      scopedKey(HISTORY_KEY, userId),
      JSON.stringify(nextHistory)
    );
  } catch {
    return nextResult;
  }

  return nextResult;
}

/* =========================================================
   FILTROS
========================================================= */

export function getExamFilteredHistory(exam) {
  return getExamHistory().filter((item) => item.exam === exam);
}

export function getSkillHistory(skill, exam = null) {
  return getExamHistory().filter((item) => {
    const sameSkill = item.skill === skill;

    if (!exam) return sameSkill;

    return sameSkill && item.exam === exam;
  });
}

/* =========================================================
   STATS
========================================================= */

export function getHistoryStats(history) {
  if (!Array.isArray(history) || history.length === 0) {
    return {
      average: 0,
      best: 0,
      weeklyProgress: 0,
      streak: 0,
      studyMinutes: 0,
      total: 0,
    };
  }

  const scores = history
    .map((item) => Number(item.score))
    .filter((score) => Number.isFinite(score));

  const average =
    scores.length > 0
      ? scores.reduce((sum, score) => sum + score, 0) / scores.length
      : 0;

  const best = scores.length > 0 ? Math.max(...scores) : 0;

  const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;

  const weeklyProgress = history.filter((item) => {
    const time = new Date(item.createdAt).getTime();

    return Number.isFinite(time) && time >= oneWeekAgo;
  }).length;

  return {
    average: Number(average.toFixed(1)),
    best: Number(best.toFixed(1)),
    weeklyProgress,

    streak: getStudyStreak(history),

    studyMinutes: getStudyMinutes(history),

    total: history.length,
  };
}

/* =========================================================
   TEMPO DE ESTUDO
========================================================= */

export function getStudyMinutes(history) {
  if (!Array.isArray(history)) return 0;

  return history.reduce((total, item) => {
    const minutes = Number(
      item.durationMinutes ?? item.studyMinutes ?? 0
    );

    if (Number.isFinite(minutes) && minutes > 0) {
      return total + minutes;
    }

    return total + 10;
  }, 0);
}

/* =========================================================
   STREAK
========================================================= */

export function getStudyStreak(history) {
  if (!Array.isArray(history) || history.length === 0) {
    return 0;
  }

  const days = new Set(
    history
      .map((item) => new Date(item.createdAt))
      .filter((date) => Number.isFinite(date.getTime()))
      .map((date) => date.toISOString().slice(0, 10))
  );

  let streak = 0;

  const cursor = new Date();

  while (days.has(cursor.toISOString().slice(0, 10))) {
    streak += 1;

    cursor.setDate(cursor.getDate() - 1);
  }

  return streak;
}

/* =========================================================
   PROGRESSO POR SKILL
========================================================= */

export function getExamBreakdown(history) {
  const skills = [
    "Reading",
    "Listening",
    "Writing",
    "Speaking",
    "Simulado",
  ];

  return skills.map((skill) => {
    const items = Array.isArray(history)
      ? history.filter(
          (item) =>
            item.skill === skill ||
            item.type === skill
        )
      : [];

    const stats = getHistoryStats(items);

    return {
      skill,

      average: stats.average,

      total: items.length,

      progress:
        stats.average > 0
          ? Math.min(
              100,
              Math.round((stats.average / 9) * 100)
            )
          : 0,
    };
  });
}
