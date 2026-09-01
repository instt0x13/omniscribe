<script lang="ts">
  import { marked } from "marked";
  import type { Note } from "$api/notes";
  import {Button} from "$components";

  interface Props {
    note: Note;
    onsave: (data: { title: string; content: string }) => Promise<void>;
    onclose: () => void;
    oncopy: (text: string) => void;
  }

  let { note, onsave, onclose, oncopy }: Props = $props();
  let isEditing = $state(false);
  let editTitle = $state(note.title);
  let editContent = $state(note.content);

  async function handleSave() {
    await onsave({ title: editTitle, content: editContent });
    isEditing = false;
  }
</script>

<div class="modal-header">
  {#if isEditing}
    <input bind:value={editTitle} class="title-input" />
  {:else}
    <h2>{note.title}</h2>
  {/if}
  
  <div class="modal-actions">
    <Button variant="icon" onclick={() => oncopy(isEditing ? editContent : note.content)} title="Скопировать">📋</Button>
    {#if isEditing}
      <Button onclick={handleSave}>Сохранить</Button>
      <Button variant="secondary" onclick={() => (isEditing = false)}>Отмена</Button>
    {:else}
      <Button onclick={() => (isEditing = true)}>Редактировать</Button>
      <Button variant="secondary" onclick={onclose}>Закрыть</Button>
    {/if}
  </div>
</div>

{#if isEditing}
  <textarea class="note-editor" bind:value={editContent}></textarea>
{:else}
  <div class="note-body">{@html marked(note.content)}</div>
{/if}

<style>
  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
  }

  .modal-actions { display: flex; gap: 0.5rem; }

.note-body, .note-editor {
  overflow-y: auto;
  line-height: 1.6;
}
.note-editor { min-height: 300px; resize: vertical; }

</style>