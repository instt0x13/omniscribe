<script lang="ts">
  import { marked } from "marked";
  import page from "page";

  import { Modal, ThemeToggle, Button, Header } from "$lib/shared/ui";
  import { NotePreview, NoteCard, notesStore, NoteItem } from "$lib/features/note";

  marked.setOptions({ gfm: true, breaks: true });

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

<Header>
  {#snippet left()}
    <ThemeToggle />
  {/snippet}

  {#snippet center()}
    <div class="brand">
      <h1>OmniScribe</h1>
    </div>
  {/snippet}

  {#snippet right()}
    <Button onclick={() => notesStore.openCreateModal()}>
      + Создать заметку
    </Button>
  {/snippet}
</Header>

<main>
  <div class="notes-list">
    {#each notesStore.notes as note (note.id)}
      <NotePreview 
        {note} 
        onopen={() => page(`/note/${note.id}`)} 
      />
    {/each}
  </div>
</main>

<!-- Модальные окна -->
{#if notesStore.isCreating}
  <Modal onclose={() => notesStore.closeCreateModal()}>
    <NoteCard noteItem={new NoteItem({ id: 0, title: "", content: "" })} />
  </Modal>
{/if}

{#if notesStore.currentNote}
  <Modal onclose={() => page("/")}>
    <NoteCard noteItem={new NoteItem(notesStore.currentNote)} />
  </Modal>
{/if}

<style>
  .brand h1 {
    font-size: 1.25rem;
    margin: 0;
  }

  main {
    padding-top: 1.5rem;
  }

  .notes-list {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }
</style>