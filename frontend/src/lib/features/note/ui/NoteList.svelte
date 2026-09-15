<script lang="ts">
  import { Button, Dialog } from "$lib/shared/ui";

  import * as noteApi from "../noteApi";
  import type { Note } from "../noteTypes";

  import { NoteEditorSession } from "../classes/NoteEditorSession.svelte";
  import { default as NoteCard } from "./NoteCard.svelte";

  interface Props { }

  let { }: Props = $props();

  let notes = $state<Note[]>([]);
  let activeNoteSession = $state<NoteEditorSession | null>(null);

  async function loadNotes() {
    try {
      notes = await noteApi.fetchNotes();
    } catch (err) {
      console.error("Ошибка загрузки заметок:", err);
    }
  }

  function openNote(note: Note | null = null) {
    activeNoteSession = new NoteEditorSession(note);
  }

  function closeNote() {
    if (activeNoteSession?.isDirty) {
      return;
    }
    reallyClose();
  }

  function reallyClose() {
    activeNoteSession = null;
  }

  function handleCopy(text: string) {
    navigator.clipboard
      .writeText(text)
      .then(() => alert("Скопировано! 🎉"))
      .catch(() => alert("Ошибка копирования"));
  }

  $effect(() => {
    loadNotes();
  });
</script>

<div class="notes-list">
  <Button onclick={() => openNote()}>+ Создать заметку</Button>
  {#each notes as note (note.id)}
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
</div>

{#if activeNoteSession}
  <Dialog open={true} onrequestclose={closeNote}>
    <NoteCard session={activeNoteSession} />
  </Dialog>
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
