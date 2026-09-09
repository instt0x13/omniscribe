import { appConfig } from '$lib/shared/config';
import type { Note } from './noteTypes';

// Получить все заметки
export async function fetchNotes(): Promise<Note[]> {
  const res = await fetch(appConfig.apiBaseUrl);
  if (!res.ok) throw new Error("Ошибка загрузки заметок");
  return res.json();
}

// Создать заметку (возвращает созданную заметку с ID)
export async function createNote(note: Omit<Note, "id">): Promise<Note> {
  const res = await fetch(appConfig.apiBaseUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(note),
  });
  
  if (!res.ok) throw new Error("Ошибка создания заметки");
  return res.json();
}

// Обновить заметку (возвращает обновленную заметку)
export async function updateNote(id: number, note: Omit<Note, "id">): Promise<Note> {
  const res = await fetch(`${appConfig.apiBaseUrl}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(note),
  });
  
  if (!res.ok) {
    if (res.status === 404) {
      throw new Error("Заметка не найдена");
    }
    throw new Error("Ошибка обновления заметки");
  }
  return res.json();
}