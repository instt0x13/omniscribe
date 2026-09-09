<script lang="ts">
  import { marked } from "marked";
  import { Button } from "$lib/shared/ui";

  import { NoteItem } from "../classes/NoteItem.svelte";

  interface Props {
    noteItem: NoteItem;
  }

  let { noteItem }: Props = $props();
  let isEditing = $state(false);

  async function handleSave() {
    const success = await noteItem.save();
    if (success) isEditing = false;
  }

  function handleCancel() {
    noteItem.reset();
    isEditing = false;
  }

  function handleCopy() {
    const textToCopy = noteItem.content;
    navigator.clipboard.writeText(textToCopy)
      .then(() => alert("Скопировано! 🎉"))
      .catch(() => alert("Ошибка копирования"));
  }
</script>

<div class="note-card">
  <div class="card-header">
    {#if isEditing}
      <input bind:value={noteItem.title} class="title-input" placeholder="Заголовок..." />
    {:else}
      <h2>{noteItem.title}</h2>
    {/if}

    <div class="card-actions">
      <Button variant="icon" onclick={handleCopy} title="Скопировать">📋</Button>

      {#if isEditing}
        <Button onclick={handleSave}>{noteItem ? "Сохранить" : "Добавить"}</Button>
        <Button variant="secondary" onclick={handleCancel}>Отмена</Button>
      {:else}
        <Button onclick={() => (isEditing = true)}>Редактировать</Button>
      {/if}
    </div>
  </div>

  <div class="card-body">
    {#if isEditing}
      <textarea
        bind:value={noteItem.content}
        class="note-editor"
        placeholder="Контент (Markdown)"
        rows="4"
      ></textarea>
    {:else}
      <div class="note-body">{@html marked(noteItem.content)}</div>
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