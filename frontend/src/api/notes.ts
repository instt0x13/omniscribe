const API_URL = "http://localhost:8000/notes";

export interface Note {
  id: number;
  title: string;
  content: string;
}

export async function fetchNotes(): Promise<Note[]> {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error("Ошибка загрузки");
  return res.json();
}

export async function createNote(note: Omit<Note, "id">): Promise<void> {
  await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(note),
  });
}

export async function updateNote(id: number, note: Omit<Note, "id">): Promise<void> {
  await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(note),
  });
}