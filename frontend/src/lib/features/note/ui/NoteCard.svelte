<script lang="ts">
  import { marked } from "marked";
  import { Button } from "$lib/shared/ui";

  import { NoteEntity } from '../classes/NoteEntity.svelte';

  interface Props { note: NoteEntity }
  let { note }: Props = $props();

  // снимок "эталона" для dirty/reset
  // svelte-ignore state_referenced_locally
  let baseline = $state({ title: note.title, content: note.content });
  let isManuallyEditing = $state(false);

  let isDirty = $derived(
    note.title !== baseline.title || note.content !== baseline.content
  );
  let isValid = $derived(note.title.trim().length > 0);
  let isInEditMode = $derived(note.isNew || isManuallyEditing);

  marked.setOptions({ gfm: true, breaks: true });

  async function handleSave() {
    if (!isValid || !isDirty) return;
    const ok = await note.save();
    if (ok) {
      baseline = { title: note.title, content: note.content };
      isManuallyEditing = false;
    }
  }

  function handleCancel() {
    note.title = baseline.title;
    note.content = baseline.content;
    note.error = null;
    isManuallyEditing = false;
  }

  function handleCopy() {
    const textToCopy = note.content;
    navigator.clipboard.writeText(textToCopy)
      .then(() => alert("Скопировано! 🎉"))
      .catch(() => alert("Ошибка копирования"));
  }
</script>

<div class="note-card">
  <div class="card-header">
    {#if isInEditMode}
      <input bind:value={note.title} class="title-input" placeholder="Заголовок..." />
    {:else}
      <h2>{note.title}</h2>
    {/if}
    <h3 class="note-id">ID: {note.isNew ? " (новая)" : note.id}</h3>

    <div class="card-actions">
      <Button variant="icon" onclick={handleCopy} title="Скопировать">📋</Button>

      {#if isInEditMode}
        <Button onclick={handleSave}>{note.isNew ? "Добавить" : "Сохранить"}</Button>
        <Button variant="secondary" onclick={handleCancel}>Отмена</Button>
      {:else}
        <Button onclick={() => (isManuallyEditing = true)}>Редактировать</Button>
      {/if}
    </div>
  </div>

  <div class="card-body">
    {#if isInEditMode}
      <textarea
        bind:value={note.content}
        class="note-editor"
        placeholder="Контент (Markdown)"
        rows="4"
      ></textarea>
    {:else}
      <div class="note-body">{@html marked(note.content)}</div>
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