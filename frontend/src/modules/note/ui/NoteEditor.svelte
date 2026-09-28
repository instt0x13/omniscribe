<script lang="ts">
  import { marked } from "marked";
  import type { NoteEditorSession } from "../classes/NoteEditorSession.svelte";

  interface Props { session: NoteEditorSession }
  let { session }: Props = $props();

  marked.setOptions({ gfm: true, breaks: true });
</script>

<div class="note-card">
  <div class="card-header">
    {#if session.isInEditMode}
      <input bind:value={session.entity.title} class="title-input" placeholder="Заголовок..." />
    {:else}
      <h2>{session.entity.title}</h2>
    {/if}
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

    /* Ограничения ширины */
    width: 100%;
    min-width: 520px;
    max-width: 720px;

    /* Центрирование, если родитель шире */
    margin-inline: auto;
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