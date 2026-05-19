import { scopedKey } from "../utils/storageScope";

const NOTES_KEY = "elan.studyNotes";

export function getStudyNotes() {
  try {
    const value = window.localStorage.getItem(scopedKey(NOTES_KEY));
    const parsed = value ? JSON.parse(value) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveStudyNotes(notes) {
  const safeNotes = Array.isArray(notes) ? notes : [];

  try {
    window.localStorage.setItem(scopedKey(NOTES_KEY), JSON.stringify(safeNotes));
  } catch {
    // Notes remain local-first; storage failures should not crash the UI.
  }

  return safeNotes;
}

export function createStudyNote({ title, content, category = "Geral", source = "manual" }) {
  const notes = getStudyNotes();
  const now = new Date().toISOString();
  const note = {
    id: crypto.randomUUID?.() || `${Date.now()}`,
    title: title?.trim() || "Nova anotacao",
    content: content?.trim() || "",
    category: category?.trim() || "Geral",
    source,
    createdAt: now,
    updatedAt: now,
  };

  return saveStudyNotes([note, ...notes]);
}

export function updateStudyNote(noteId, updates) {
  const notes = getStudyNotes();
  return saveStudyNotes(
    notes.map((note) =>
      note.id === noteId
        ? {
            ...note,
            ...updates,
            updatedAt: new Date().toISOString(),
          }
        : note
    )
  );
}

export function deleteStudyNote(noteId) {
  return saveStudyNotes(getStudyNotes().filter((note) => note.id !== noteId));
}
