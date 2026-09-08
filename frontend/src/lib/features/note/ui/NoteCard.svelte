<script lang="ts">
  import { marked } from "marked";
  import { Button } from "$lib/shared/ui";

  import { type Note } from "../noteTypes";
  import * as noteApi from "../noteApi";
  import { notesStore } from "../notesStore.svelte";

  interface Props {
    note?: Note | null;
    onclose?: () => void;
  }

  let { note = null, onclose }: Props = $props();

  let isEditing = $derived(!note);
  let title = $state("");
  let content = $state("");

  $effect(() => {
    title = note?.title ?? "";
    content = note?.content ?? "";
    isEditing = !note;
  });

  async function handleSave() {
    if (!title.trim()) return;

    try {
      if (note) {
        await noteApi.updateNote(note.id, { title, content });
        isEditing = false;
      } else {
        await noteApi.createNote({ title, content });
      }
      await notesStore.loadNotes();
      if (onclose) onclose(); // Закрываем карточку
    } catch (err) {
      console.error("Ошибка сохранения заметки:", err);
    }
  }

  function handleCancel() {
    if (note) {
      title = note.title;
      content = note.content;
      isEditing = false;
    } else if (onclose) {
      onclose();
    }
  }

  function handleCopy() {
    const textToCopy = isEditing ? content : (note?.content ?? content);
    navigator.clipboard.writeText(textToCopy)
      .then(() => alert("Скопировано! 🎉"))
      .catch(() => alert("Ошибка копирования"));
  }
</script>

<div class="note-card">
  <div class="card-header">
    {#if isEditing}
      <input bind:value={title} class="title-input" placeholder="Заголовок..." />
    {:else}
      <h2>{note?.title}</h2>
    {/if}

    <div class="card-actions">
      <Button variant="icon" onclick={handleCopy} title="Скопировать">📋</Button>

      {#if isEditing}
        <Button onclick={handleSave}>{note ? "Сохранить" : "Добавить"}</Button>
        <Button variant="secondary" onclick={handleCancel}>Отмена</Button>
      {:else}
        <Button onclick={() => (isEditing = true)}>Редактировать</Button>
        <Button variant="secondary" onclick={onclose}>Закрыть</Button>
      {/if}
    </div>
  </div>

  <div class="card-body">
    {#if isEditing}
      <textarea
        bind:value={content}
        class="note-editor"
        placeholder="Контент (Markdown)"
        rows="4"
      ></textarea>
    {:else if note}
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