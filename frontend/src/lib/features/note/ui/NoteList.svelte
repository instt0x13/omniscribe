<script lang="ts">
  import { Button, Dialog, ConfirmDialog } from "$lib/shared/ui";

  import type { Note } from "../noteTypes";

  import { NoteEditorSession } from "../classes/NoteEditorSession.svelte";
  import { NotesStore } from "../classes/NotesStore.svelte";

  import NoteCard from "./NoteCard.svelte";

  const store = new NotesStore();
  let activeNoteSession = $state<NoteEditorSession | null>(null);
  let isConfirmOpen = $state(false);

  function openNote(note: Note | null = null) {
    activeNoteSession = new NoteEditorSession(note);
  }

  function closeNote() {
    if (activeNoteSession?.isDirty) {
      isConfirmOpen = true;
      return;
    }
      reallyClose();
  }

  async function reallyClose() {
    isConfirmOpen = false;
    activeNoteSession = null;
  }

  function handleCopy(text: string) {
    navigator.clipboard.writeText(text)
      .then(() => alert("Скопировано! 🎉"))
      .catch(() => alert("Ошибка копирования"));
  }

  async function handleSave() {
    const ok = await activeNoteSession?.save();
    if (ok) {
      store.refresh();
    }
  }

  $effect(() => {
    store.load();
  });
</script>

<div class="notes-list">
  <Button onclick={() => openNote()}>+ Создать заметку</Button>
  {#if store.isLoading}
    <p>Загрузка…</p>
  {:else if store.error}
    <p class="error">{store.error}</p>
  {:else}
    {#each store.items as note (note.id)}
      <div class="note-preview">
        <div
          class="note-title"
          onclick={() => openNote(note)}
          role="button"
          tabindex="0"
          onkeydown={(e) => e.key === "Enter" && openNote(note)}
        >
          <span>{note.title}</span>
        </div>
        <Button
          title="Скопировать"
          variant="icon"
          onclick={() => handleCopy(note.content)}
        >
          📋
        </Button>
      </div>
    {/each}
  {/if}
</div>

{#if activeNoteSession}
  <Dialog open={true} onrequestclose={closeNote}>
    <NoteCard session={activeNoteSession} onsave={handleSave} />
  </Dialog>
{/if}

{#if isConfirmOpen}
  <ConfirmDialog
    message="У вас есть несохранённые изменения. Закрыть без сохранения?"
    onconfirm={reallyClose}
    oncancel={() => (isConfirmOpen = false)}
  />
{/if}

<style>
  .notes-list {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .note-preview {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.75rem 1rem;
    background: var(--panel);
    border: 1px solid var(--border);
    border-radius: var(--radius);
  }

  .note-title {
    flex-grow: 1;
    font-weight: 600;
    cursor: pointer;
    &:hover {
      color: var(--primary);
    }
  }
</style>
