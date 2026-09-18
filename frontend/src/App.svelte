<script lang="ts">
  import page from "page";

  import { Header, Button } from "$shared/ui";
  import { NoteList, NotesTabs } from "$features/note";
  import { ThemeToggle } from "$features/theme";

  let mode = $state<"list" | "tabs">("list");

    page("/", () => {
    page.redirect("/"+mode);
  });

  page("/list", () => {
    mode = "list";
  });

  page("/tabs", () => {
    mode = "tabs";
  });

  //page("/note/:id", (ctx) => {
  //  notesStore.setActiveNoteId(Number(ctx.params.id));
  //});

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
    <Button onclick={() => mode = mode === "list" ? "tabs" : "list"}>
      {#if mode === "list"}
        Вкладки 🗂️
      {:else if mode === "tabs"}
        Список 📑
      {/if}
    </Button>
  {/snippet}
</Header>

<main>
  {#if mode === "list"}
    <NoteList />
  {:else if mode === "tabs"}
    <NotesTabs />
  {/if}
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