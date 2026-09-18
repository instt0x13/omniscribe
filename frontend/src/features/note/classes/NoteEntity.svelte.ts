import * as noteApi from '../noteApi';
import type { Note } from '../noteTypes';

export class NoteEntity {
  id = $state<number | null>(null);
  title = $state('');
  content = $state('');

  isSaving = $state(false);
  error = $state<string | null>(null);

  constructor(data: Partial<Note> = {}) {
    this.id = data.id ?? null;
    this.title = data.title ?? '';
    this.content = data.content ?? '';
  }

  get isNew() {
    return this.id === null;
  }

  async save(): Promise<boolean> {
    this.isSaving = true;
    this.error = null;
    try {
      const payload = { title: this.title, content: this.content };
      const saved = this.isNew
        ? await noteApi.createNote(payload)
        : await noteApi.updateNote(this.id!, payload);

      this.id = saved.id;
      this.title = saved.title;
      this.content = saved.content;
      return true;
    } catch (err) {
      this.error = err instanceof Error ? err.message : 'Ошибка сохранения';
      return false;
    } finally {
      this.isSaving = false;
    }
  }
}