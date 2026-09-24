<script lang="ts">
  import type { Component } from "svelte";
  import page from "page";
  import { AppLayout, GhostText,  ChoiceList } from "$shared/ui";
  import { ModalHost } from "$features/modal";
  import { BackgroundShow } from "$features/background";
  import { NoteList, NotesTabs } from "$features/note";
  import { SettingsPage } from "$features/settings";
  import { init } from "$features/appearance";

  const modules = {
    main: { title: "", component: null},
    settings: { title: "Настройки", component: SettingsPage},
    list: { title: "📑 Список", component: NoteList},
    tabs: { title: "🗂️ Вкладки", component: NotesTabs},
  } as const satisfies Record<string, { 
    title: string, 
    component: Component | null
  }>;

  type Module = keyof typeof modules;

  let module = $state<Module>("main");

  page("/", () => {
    page.redirect("/" + module);
  });

  page("/:id", (ctx) => {
    module = ctx.params.id;
  });

  $effect(() => {
    page.start();
    return () => page.stop();
  });
</script>

<BackgroundShow />
<ModalHost />

<AppLayout>
  {#snippet header()}
    <div class="brand">
      <h1>OmniScribe</h1>
    </div>
  {/snippet}
  
  {#snippet sidebar()}
    <ChoiceList direction="vertical"
      items={modules}
      active={module}
      onselect={(key) => {page.show("/"+key); module = key;}}
    >
      {#snippet item(module, key)}
        <GhostText>{module.title || key}</GhostText>
      {/snippet}
    </ChoiceList>
  {/snippet}

  {#each Object.entries(modules) as [key, value]}
    {#if key === module}
      {@const ModuleComponent = value.component}
      <ModuleComponent />
    {/if}
  {/each}
</AppLayout>

<style>
  .brand h1 {
    font-size: 1.25rem;
    margin: 0;
  }
</style>
