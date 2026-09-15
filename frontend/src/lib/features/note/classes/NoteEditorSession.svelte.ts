import { NoteEntity } from "./NoteEntity.svelte";
import type { Note } from "../noteTypes";

export class NoteEditorSession {
  entity: NoteEntity;
  baseline = $state({ title: "", content: "" });
  isManuallyEditing = $state(false);

  constructor(note: Note | null) {
    this.entity = new NoteEntity(note ?? { title: "", content: "" });
    this.baseline = { title: this.entity.title, content: this.entity.content };
  }

  get isDirty() {
    return (
      this.entity.title !== this.baseline.title ||
      this.entity.content !== this.baseline.content
    );
  }

  get isValid() {
    return this.entity.title.trim().length > 0;
  }

  get isInEditMode() {
    return this.entity.isNew || this.isManuallyEditing;
  }

  async save(): Promise<boolean> {
    if (!this.isValid || !this.isDirty) return false;
    const ok = await this.entity.save();
    if (ok) {
      this.baseline = { title: this.entity.title, content: this.entity.content };
      this.isManuallyEditing = false;
    }
    return ok;
  }

  cancel() {
    this.entity.title = this.baseline.title;
    this.entity.content = this.baseline.content;
    this.entity.error = null;
    this.isManuallyEditing = false;
  }
}