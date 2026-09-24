<script lang="ts">
  import { Button, ChoiceList, GhostButton, GhostText, Icon, ModalConfirm } from "$shared/ui";
  import type { Note } from "../noteTypes";
  import { NoteEditorSession } from "../classes/NoteEditorSession.svelte";
  import { NotesStore } from "../classes/NotesStore.svelte";
  import NoteEditor from "./NoteEditor.svelte";

  let store = new NotesStore();
  let tabs = $state<NoteEditorSession[]>([]);
  let activeSession = $state<NoteEditorSession | null>(null);

  let pendingCloseSession = $state<NoteEditorSession | null>(null);

  function openNote(note: Note | null = null) {
    // если заметка уже открыта — просто активируем вкладку
    if (note) {
      const existing = tabs.find((s) => s.entity.id === note.id);
      if (existing) {
        activeSession = existing;
        return;
      }
    }
    const session = new NoteEditorSession(note);
    tabs = [...tabs, session];
    activeSession = session;
  }

  function requestCloseTab(session: NoteEditorSession) {
    if (session.isDirty) {
      pendingCloseSession = session;
      return;
    }
    closeTab(session);
  }

  function closeTab(session: NoteEditorSession) {
    pendingCloseSession = null;
    tabs = tabs.filter((s) => s !== session);
    if (activeSession === session) {
      activeSession = tabs[tabs.length - 1] ?? null;
    }
  }

  async function handleSave(session: NoteEditorSession) {
    const ok = await session.save();
    if (ok) {
      store.refresh();
    }
  }

  $effect(() => {
    store.load();
  });
</script>

<div class="notes-layout">
  <!-- Боковая панель со списком всех заметок -->
  <aside class="notes-sidebar">
    <div class="sidebar-header">
      <h3>Все заметки</h3>
      <Button variant="icon" onclick={() => openNote()} title="Создать">
        +
      </Button>
    </div>

    {#if store.items.length === 0}
      <p class="empty">Нет заметок</p>
    {:else}
      <ul class="notes-list">
        {#each store.items as note (note.id)}
          <li>
            <button
              class="note-item"
              class:active={activeSession?.entity.id === note.id}
              onclick={() => openNote(note)}
            >
              {note.title || "Без названия"}
            </button>
          </li>
        {/each}
      </ul>
    {/if}
  </aside>

  <div class="notes-tabs">
    <div class="tabs-content">
      {#if activeSession}
        <NoteEditor session={activeSession} />
      {:else}
        <p>Нет открытых заметок.</p>
      {/if}
    </div>
  </div>
</div>

{#if pendingCloseSession}
  <ModalConfirm
    message="У вас есть несохранённые изменения. Закрыть без сохранения?"
    onconfirm={() => pendingCloseSession && closeTab(pendingCloseSession)}
    oncancel={() => (pendingCloseSession = null)}
  />
{/if}

<style>
  .notes-layout {
    display: grid;
    grid-template-columns: 16rem 1fr;
    gap: 1rem;
    align-items: start;
  }

  .notes-sidebar {
    border: 1px solid var(--border);
    border-radius: var(--radius);
    background: var(--panel);
    padding: 0.75rem;
    max-height: 80vh;
    overflow-y: auto;
  }

  .sidebar-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 0.5rem;
  }

  .sidebar-header h3 {
    margin: 0;
    font-size: 0.9rem;
    text-transform: uppercase;
    opacity: 0.7;
  }

  .notes-list {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .note-item {
    width: 100%;
    text-align: left;
    padding: 0.4rem 0.6rem;
    border: 1px solid transparent;
    border-radius: var(--radius);
    background: transparent;
    color: inherit;
    cursor: pointer;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .note-item:hover {
    background: var(--border);
  }

  .note-item.active {
    border-color: var(--primary);
    color: var(--primary);
  }

  .empty {
    font-size: 0.85rem;
    opacity: 0.6;
  }

  .tabs-content {
    margin-top: 1rem;
  }
</style>