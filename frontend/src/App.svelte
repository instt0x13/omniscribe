<script lang="ts">
  import { marked } from "marked";
  import page from "page";

  import { Modal, ThemeToggle, Button } from "$lib/shared/ui";
  import { NotePreview, NoteCard, notesStore } from "$lib/features/note";

  marked.setOptions({ gfm: true, breaks: true });

  // Глобальный роутинг верхнего уровня
  page("/", () => {
    notesStore.setActiveNoteId(null);
  });

  page("/note/:id", (ctx) => {
    notesStore.setActiveNoteId(Number(ctx.params.id));
  });

  $effect(() => {
    notesStore.loadNotes();
    page.start();
    return () => page.stop();
  });
</script>

<main>
  <header>
    <ThemeToggle />
    <h1>OmniScribe</h1>
    <p class="subtitle">Удобный менеджер заметок</p>
  </header>

  <div class="actions-bar">
    <Button onclick={() => notesStore.openCreateModal()}>
      + Создать заметку
    </Button>
  </div>

  <div class="notes-list">
    {#each notesStore.notes as note (note.id)}
      <NotePreview 
        {note} 
        onopen={() => page(`/note/${note.id}`)} 
      />
    {/each}
  </div>
</main>

<!-- 1. Модалка создания (закрывается через стор, без смены URL) -->
{#if notesStore.isCreating}
  <Modal onclose={() => notesStore.closeCreateModal()}>
    <NoteCard onclose={() => notesStore.closeCreateModal()} />
  </Modal>
{/if}

<!-- 2. Модалка просмотра по URL (закрывается сбросом роута в root `/`) -->
{#if notesStore.currentNote}
  <Modal onclose={() => page("/")}>
    <NoteCard 
      note={notesStore.currentNote} 
      onclose={() => page("/")} 
    />
  </Modal>
{/if}

<style>
  .subtitle {
    color: var(--muted);
  }

  .actions-bar {
    margin-bottom: 1.5rem;
  }

  .notes-list {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }
</style>