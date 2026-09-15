import * as noteApi from "../noteApi";
import type { Note } from "../noteTypes";

export class NotesStore {
  items = $state<Note[]>([]);
  isLoading = $state(false);
  error = $state<string | null>(null);

  async load() {
    this.isLoading = true;
    this.error = null;
    try {
      this.items = await noteApi.fetchNotes();
    } catch (err) {
      this.error = err instanceof Error ? err.message : String(err);
      console.error("Ошибка загрузки заметок:", err);
    } finally {
      this.isLoading = false;
    }
  }

  getById(id: number): Note | null {
    return this.items.find((n) => n.id === id) ?? null;
  }

  async refresh() {
    await this.load();
  }
}