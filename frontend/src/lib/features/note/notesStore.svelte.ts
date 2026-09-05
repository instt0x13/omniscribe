import * as noteApi from './noteApi';
import type { Note } from './noteTypes';

class NotesStore {
  notes = $state<Note[]>([]);
  activeNoteId = $state<number | null>(null);
  isCreating = $state(false);

  // Вычисляемая активная заметка
  currentNote = $derived(
    this.activeNoteId !== null 
      ? this.notes.find((n) => n.id === this.activeNoteId) ?? null 
      : null
  );

  async loadNotes() {
    try {
      this.notes = await noteApi.fetchNotes();
    } catch (err) {
      console.error('Ошибка загрузки заметок:', err);
    }
  }

  setActiveNoteId(id: number | null) {
    this.activeNoteId = id;
  }

  openCreateModal() {
    this.isCreating = true;
  }

  closeCreateModal() {
    this.isCreating = false;
  }
}

export const notesStore = new NotesStore();