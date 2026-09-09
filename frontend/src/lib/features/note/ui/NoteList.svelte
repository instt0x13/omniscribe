<script lang="ts">
  import { Button, Modal } from "$lib/shared/ui";

  import * as noteApi from "../noteApi";
  import type { Note } from "../noteTypes";
  import { NoteItem } from "../classes/NoteItem.svelte";

  import { default as NoteCard } from "./NoteCard.svelte";

  interface Props {
    id?: Number | null;
  }

  let { id }: Props = $props();

  let notes = $state<Note[]>([]);
  let openedNoteItem = $state<NoteItem | null>(null);

  async function loadNotes() {
    try {
      notes = await noteApi.fetchNotes();
    } catch (err) {
      console.error("Ошибка загрузки заметок:", err);
    }
  }

  function openNote(note: Note) {
    openedNoteItem = new NoteItem(note);
  }

  function createNote() {
    openedNoteItem = new NoteItem();
  }

  function closeNote() {
    openedNoteItem = null;
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
  <Button onclick={() => createNote()}>+ Создать заметку</Button>
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

{#if openedNoteItem}
  <Modal onclose={closeNote}>
    <NoteCard noteItem={openedNoteItem} />
  </Modal>
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
