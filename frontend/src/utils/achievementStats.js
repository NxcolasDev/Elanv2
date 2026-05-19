export function buildAchievementStats(history = []) {
  const safeHistory = Array.isArray(history) ? history : [];

  const stats = {
    writingCount: 0,
    speakingCount: 0,
    readingCount: 0,
    listeningCount: 0,
    flashcardReviews: Number(localStorage.getItem("elan.flashcardReviews") || 0),
    studyMinutes: 0,
    bestScore: 0,
    totalActivities: safeHistory.length,
    streak: 0,
  };

  const uniqueDays = new Set();

  safeHistory.forEach((item) => {
    const skill = item.skill?.toLowerCase?.() || "";

    if (skill.includes("writing")) stats.writingCount++;
    if (skill.includes("speaking")) stats.speakingCount++;
    if (skill.includes("reading")) stats.readingCount++;
    if (skill.includes("listening")) stats.listeningCount++;

    stats.studyMinutes += Number(item.durationMinutes || 0);

    if (Number(item.score || 0) > stats.bestScore) {
      stats.bestScore = Number(item.score);
    }

    if (item.createdAt) {
      const day = new Date(item.createdAt).toDateString();
      uniqueDays.add(day);
    }
  });

  stats.streak = uniqueDays.size;

  return stats;
}