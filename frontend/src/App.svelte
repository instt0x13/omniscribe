<script lang="ts">
  import page from "page";

  import { 
    Tabs, AppLayout, GhostText, GhostButton, SplitRow, 
    BackgroundGradientBlobs, BackgroundParticle, BackgroundShader, 
    ChoiceList

  } from "$shared/ui";

  import { NoteList, NotesTabs } from "$features/note";
  import { ThemeToggle } from "$features/theme";

  const modes = ["list", "tabs"];
  type Mode = typeof modes[number];
  let mode = $state<Mode>("list");

  const bgs = ["none", "GradientBlobs", "Particles", "Shader"];
  type Bg = typeof bgs[number];
  let bg = $state<Bg>("none");

  page("/", () => {
    page.redirect("/" + mode);
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

{#if bg === "GradientBlobs"}
  <BackgroundGradientBlobs />
{:else if bg === "Particles"}
  <BackgroundParticle />
{:else if bg === "Shader"}
  <BackgroundShader />
{/if}

<AppLayout>
  {#snippet header()}
    <div class="brand">
      <h1>OmniScribe</h1>
    </div>
  {/snippet}
  
  {#snippet sidebar()}
    <ThemeToggle />
    <ChoiceList
      items={bgs}
      active={bg}
      getKey={(b) => b}
      onselect={(b) => {bg = b;}}
    >
      {#snippet item(b)}
          <GhostText>{b}</GhostText>
      {/snippet}
    </ChoiceList>
    <ChoiceList
      direction="vertical"
      items={modes}
      active={mode}
      getKey={(m) => m}
      onselect={(m) => {page.show("/"+m); mode = m;}}
    >
      {#snippet item(m)}
        {#if m === "tabs"}
          <GhostText>🗂️ Вкладки</GhostText>
        {:else if m === "list"}
          <GhostText>📑 Список</GhostText>
        {/if}
      {/snippet}
    </ChoiceList>
    <GhostButton>Пункты меню</GhostButton><br>
    <GhostButton>Пункты меню</GhostButton><br>
    <GhostButton>Пункты меню</GhostButton><br>
    <GhostButton>Пункты меню</GhostButton><br>
    <GhostText>Пункты меню</GhostText><br>
    <GhostText>Пункты меню</GhostText><br>
    <GhostText>Пункты меню</GhostText><br>
    <GhostText>Пункты меню</GhostText><br>
  {/snippet}

  {#if mode === "list"}
    <NoteList />
  {:else if mode === "tabs"}
    <NotesTabs />
  {/if}
</AppLayout>

<style>
  .brand h1 {
    font-size: 1.25rem;
    margin: 0;
  }
</style>
