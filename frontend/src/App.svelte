<script lang="ts">
  import { marked } from "marked";
  import page from "page";

  import { Modal, ThemeToggle, Button } from "$lib/shared/ui";
  import { NotePreview, NoteCard, noteApi, type Note } from "$lib/features/note";

  let notes = $state<Note[]>([]);
  let activeNoteId = $state<number | null>(null);
  
  // Флаг для модального окна создания
  let isCreating = $state(false);

  let currentNote = $derived(
    activeNoteId !== null ? notes.find((n) => n.id === activeNoteId) ?? null : null
  );

  marked.setOptions({ gfm: true, breaks: true });

  async function loadNotes() {
    try {
      notes = await noteApi.fetchNotes();
    } catch (err) {
      console.error(err);
    }
  }

  page("/", () => (activeNoteId = null));
  page("/note/:id", (ctx) => (activeNoteId = Number(ctx.params.id)));

  $effect(() => {
    loadNotes();
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

  <!-- Кнопка вызова модального окна создания -->
  <div class="actions-bar">
    <Button onclick={() => (isCreating = true)}>
      + Создать заметку
    </Button>
  </div>

  <div class="notes-list">
    {#each notes as note (note.id)}
      <NotePreview 
        title={note.title} 
        content={note.content} 
        onopen={() => page(`/note/${note.id}`)}
      />
    {/each}
  </div>
</main>

<!-- 1. Модалка для создания новой заметки -->
{#if isCreating}
  <Modal onclose={() => (isCreating = false)}>
    <NoteCard 
      onreload={loadNotes} 
      onclose={() => (isCreating = false)} 
    />
  </Modal>
{/if}

<!-- 2. Модалка для просмотра/редактирования существенной заметки -->
{#if currentNote}
  <Modal onclose={() => page("/")}>
    <NoteCard
      note={currentNote}
      onclose={() => page("/")}
      onreload={loadNotes}
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