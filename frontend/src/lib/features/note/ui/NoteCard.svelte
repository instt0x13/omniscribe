<script lang="ts">
  import { marked } from "marked";
  import { Button, ConfirmDialog } from "$lib/shared/ui";

  import type { Note } from "../noteTypes";
  import { NoteEntity } from '../classes/NoteEntity.svelte';

  interface Props { noteEntity: NoteEntity }
  let { noteEntity }: Props = $props();

  // снимок "эталона" для dirty/reset
  // svelte-ignore state_referenced_locally
  let baseline = $state({ title: noteEntity.title, content: noteEntity.content });
  let isManuallyEditing = $state(false);

  let isDirty = $derived(
    noteEntity.title !== baseline.title || noteEntity.content !== baseline.content
  );
  let isValid = $derived(noteEntity.title.trim().length > 0);
  let isInEditMode = $derived(noteEntity.isNew || isManuallyEditing);

  marked.setOptions({ gfm: true, breaks: true });

  export function requestClose(): boolean {
    if (isDirty) {
      return confirm("У вас есть несохраненные изменения. Вы уверены, что хотите закрыть?");
    } else {
      return true;
    }
  }

  async function handleSave() {
    if (!isValid || !isDirty) return;
    const ok = await noteEntity.save();
    if (ok) {
      baseline = { title: noteEntity.title, content: noteEntity.content };
      isManuallyEditing = false;
    }
  }

  function handleCancel() {
    noteEntity.title = baseline.title;
    noteEntity.content = baseline.content;
    noteEntity.error = null;
    isManuallyEditing = false;
  }

  function handleCopy() {
    const textToCopy = noteEntity.content;
    navigator.clipboard.writeText(textToCopy)
      .then(() => alert("Скопировано! 🎉"))
      .catch(() => alert("Ошибка копирования"));
  }
</script>

<div class="note-card">
  <div class="card-header">
    {#if isInEditMode}
      <input bind:value={noteEntity.title} class="title-input" placeholder="Заголовок..." />
    {:else}
      <h2>{noteEntity.title}</h2>
    {/if}
    <h3 class="note-id">ID: {noteEntity.isNew ? " (новая)" : noteEntity.id}</h3>

    <div class="card-actions">
      <Button variant="icon" onclick={handleCopy} title="Скопировать">📋</Button>

      {#if isInEditMode}
        {#if isDirty && isValid}
          <Button onclick={handleSave}>{noteEntity.isNew ? "Добавить" : "Сохранить"}</Button>
        {/if}
        <Button variant="secondary" onclick={handleCancel}>{isDirty ? "Отмена" : "Назад"}</Button>
      {:else}
        <Button onclick={() => (isManuallyEditing = true)}>Редактировать</Button>
      {/if}
    </div>
  </div>

  <div class="card-body">
    {#if isInEditMode}
      <textarea
        bind:value={noteEntity.content}
        class="note-editor"
        placeholder="Контент (Markdown)"
        rows="4"
      ></textarea>
    {:else}
      <div class="note-body">{@html marked(noteEntity.content)}</div>
    {/if}
  </div>
</div>

<style>
  .note-card {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
  }

  .title-input {
    width: 100%;
    font-size: 1.25rem;
    padding: 0.4rem 0.6rem;
  }

  .card-actions {
    display: flex;
    gap: 0.5rem;
  }

  .note-editor {
    width: 100%;
    min-height: 200px;
    resize: vertical;
  }

  .note-body, .note-editor {
    overflow-y: auto;
    line-height: 1.6;
  }
</style>