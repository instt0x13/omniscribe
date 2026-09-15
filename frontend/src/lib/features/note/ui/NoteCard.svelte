<script lang="ts">
  import { marked } from "marked";
  import { Button } from "$lib/shared/ui";
  import type { NoteEditorSession } from "../classes/NoteEditorSession.svelte";

  interface Props { session: NoteEditorSession, onsave?: () => void, oncancel?: () => void }
  let { session, onsave, oncancel }: Props = $props();

  marked.setOptions({ gfm: true, breaks: true });

  function handleCopy() {
    navigator.clipboard.writeText(session.entity.content)
      .then(() => alert("Скопировано! 🎉"));
  }
  
  async function handleSave() {
    const ok = await session.save();
    if (ok) onsave?.();
  }

  function handleCancel() {
    session.cancel();
    oncancel?.();
  }
</script>

<div class="note-card">
  <div class="card-header">
    {#if session.isInEditMode}
      <input bind:value={session.entity.title} class="title-input" placeholder="Заголовок..." />
    {:else}
      <h2>{session.entity.title}</h2>
    {/if}
    <h3 class="note-id">ID: {session.entity.isNew ? " (новая)" : session.entity.id}</h3>

    <div class="card-actions">
      <Button variant="icon" onclick={handleCopy} title="Скопировать">📋</Button>

      {#if session.isInEditMode}
        {#if session.isDirty && session.isValid}
          <Button onclick={handleSave}>
            {session.entity.isNew ? "Добавить" : "Сохранить"}
          </Button>
        {/if}
        <Button variant="secondary" onclick={handleCancel}>
          {session.isDirty ? "Отмена" : "Назад"}
        </Button>
      {:else}
        <Button onclick={() => (session.isManuallyEditing = true)}>Редактировать</Button>
      {/if}
    </div>
  </div>

  <div class="card-body">
    {#if session.isInEditMode}
      <textarea
        bind:value={session.entity.content}
        class="note-editor"
        placeholder="Контент (Markdown)"
        rows="4"
      ></textarea>
    {:else}
      <div class="note-body">{@html marked(session.entity.content)}</div>
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