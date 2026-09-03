import { appConfig } from '$lib/shared/config';

import type { Note } from './noteTypes';

export async function fetchNotes(): Promise<Note[]> {
  const res = await fetch(appConfig.apiBaseUrl);
  if (!res.ok) throw new Error("Ошибка загрузки");
  return res.json();
}

export async function createNote(note: Omit<Note, "id">): Promise<void> {
  await fetch(appConfig.apiBaseUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(note),
  });
}

export async function updateNote(id: number, note: Omit<Note, "id">): Promise<void> {
  await fetch(`${appConfig.apiBaseUrl}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(note),
  });
}