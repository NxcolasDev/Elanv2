import { scopedKey } from "../utils/storageScope";

const SCHEDULE_KEY = "elan.schedule";

const defaultTasks = [
  { id: "mon", day: "Segunda", task: "Reading passage + vocabulário", done: false },
  { id: "tue", day: "Terça", task: "Listening section + shadowing", done: false },
  { id: "wed", day: "Quarta", task: "Writing Task 2", done: false },
  { id: "thu", day: "Quinta", task: "Speaking Part 2", done: false },
  { id: "fri", day: "Sexta", task: "Simulado curto", done: false },
];

export function getScheduleTasks() {
  try {
    const value = window.localStorage.getItem(scopedKey(SCHEDULE_KEY));
    const parsed = value ? JSON.parse(value) : defaultTasks;
    return Array.isArray(parsed) ? parsed : defaultTasks;
  } catch {
    return defaultTasks;
  }
}

export function saveScheduleTasks(tasks) {
  const safeTasks = Array.isArray(tasks) ? tasks : defaultTasks;
  try {
    window.localStorage.setItem(scopedKey(SCHEDULE_KEY), JSON.stringify(safeTasks));
  } catch {
    // Keep local-first storage silent for restricted browsers.
  }
  return safeTasks;
}
