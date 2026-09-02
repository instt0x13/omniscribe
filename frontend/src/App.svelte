<script lang="ts">
  import { marked } from "marked";
  import page from "page";
  import { fetchNotes, createNote, updateNote, type Note } from "$lib/shared/api/notes";
  
  import { Modal, ThemeToggle } from "$lib/shared/ui";
  import { NotePreview, NoteForm, NoteView } from "$lib/features/notes";

  let notes = $state<Note[]>([]);
  let activeNoteId = $state<number | null>(null);

  let currentNote = $derived(
    activeNoteId !== null ? notes.find((n) => n.id === activeNoteId) ?? null : null
  );

  marked.setOptions({ gfm: true, breaks: true });

  async function loadNotes() {
    try { notes = await fetchNotes(); } 
    catch (err) { console.error(err); }
  }

  async function handleCreate(data: { title: string; content: string }) {
    await createNote(data);
    await loadNotes();
  }

  async function handleUpdate(data: { title: string; content: string }) {
    if (!activeNoteId) return;
    await updateNote(activeNoteId, data);
    await loadNotes();
  }

  function copyText(text: string) {
    navigator.clipboard.writeText(text)
      .then(() => alert("Скопировано! 🎉"))
      .catch(() => alert("Ошибка копирования"));
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

  <NoteForm onsubmit={handleCreate} />

  <div class="notes-list">
    {#each notes as note (note.id)}
      <NotePreview 
        title={note.title} 
        content={note.content} 
        onopen={() => page(`/note/${note.id}`)}
        oncopy={() => copyText(note.content)} 
      />
    {/each}
  </div>
</main>

{#if currentNote}
  <Modal onclose={() => page("/")}>
    <NoteView
      note={currentNote}
      onsave={handleUpdate}
      onclose={() => page("/")}
      oncopy={copyText}
    />
  </Modal>
{/if}

<style>
  .subtitle {
    color: var(--muted);
  }

  .notes-list {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }
</style>