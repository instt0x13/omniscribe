<script lang="ts">
  import page from "page";

  import { Header } from "$lib/shared/ui";
  import { ThemeToggle } from "$lib/features/theme";
  import { NoteList, notesStore } from "$lib/features/note";

  page("/", () => {
    notesStore.setActiveNoteId(null);
  });

  page("/note/:id", (ctx) => {
    notesStore.setActiveNoteId(Number(ctx.params.id));
  });

  $effect(() => {
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
    <h2>Заметки</h2>
  {/snippet}
</Header>

<main>
  <NoteList />
</main>

<style>
  .brand h1 {
    font-size: 1.25rem;
    margin: 0;
  }

  main {
    padding-top: 1.5rem;
  }
</style>