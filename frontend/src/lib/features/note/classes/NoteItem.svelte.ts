import * as noteApi from '../noteApi';
import type { Note } from '../noteTypes';

export class NoteItem {
  id: number | null = null;

  // Исходное состояние для сброса (reset)
  private initialData = $state<Note>({
    id: 0,
    title: '',
    content: ''
  });
  
  // Реактивное состояние редактируемых полей
  title = $state('');
  content = $state('');
  
  // Внутренние флаги состояния экземпляра
  isSaving = $state(false);
  error = $state<string | null>(null);

  constructor(data: Note) {
    data = data || { id: null, title: "", content: "" };
    this.id = data.id;
    this.title = data.title;
    this.content = data.content;
    this.initialData = { ...data };
  }

  // Derived-свойство: проверка, изменены ли данные
  isDirty = $derived(
    this.title !== this.initialData.title || 
    this.content !== this.initialData.content
  );

  // Валидация
  isValid = $derived(
    this.title.trim().length > 0
  );

  async save(): Promise<boolean> {
    if (!this.isValid || !this.isDirty) return false;

    this.isSaving = true;
    this.error = null;

    try {
      let result: Note | null = null;
      if (this.id !== null) {
        result = await noteApi.updateNote(this.id, {
          title: this.title,
          content: this.content,
        });
      } else {
        result = await noteApi.createNote({
          title: this.title,
          content: this.content,
        });
      }

      // Обновляем контрольную точку исходных данных
      this.initialData = { ...result };
      return true;
    } catch (err) {
      this.error = err instanceof Error ? err.message : 'Ошибка сохранения';
      return false;
    } finally {
      this.isSaving = false;
    }
  }

  reset(): void {
    this.title = this.initialData.title;
    this.content = this.initialData.content;
    this.error = null;
  }
}
