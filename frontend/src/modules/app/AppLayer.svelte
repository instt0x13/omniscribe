<script lang="ts">
  import page from "page";
  import { AppLayout, GhostText, ViewList } from "$ui";
  import { routeViews } from "$views";

  let activeId = $state<string | null>(null);

  // Автовыбор первой страницы, если ничего не выбрано
  $effect(() => {
    if (!activeId && routeViews.items.length > 0) {
      activeId = routeViews.items[0].id;
    }
  });

  // Синхронизация с URL
  page("/", () => page.redirect("/" + (activeId ?? "")));
  page("/:id", (ctx) => { activeId = ctx.params.id; });

  $effect(() => {
    page.start();
    return () => page.stop();
  });

  let activeView = $derived(
    routeViews.items.find(v => v.id === activeId) ?? null
  );
</script>

<AppLayout>
  {#snippet header()}
    <div class="brand">
      <h1>OmniScribe</h1>
    </div>
  {/snippet}

  {#snippet sidebar()}
    <ViewList
      direction="vertical"
      items={routeViews.items}
      active={activeId}
      onselect={(id) => { activeId = id; page.show("/" + id); }}
    >
      {#snippet item(view)}
        <GhostText>{view.title}</GhostText>
      {/snippet}
    </ViewList>
  {/snippet}

  {#if activeView}
    {@const Page = activeView.component}
    <Page />
  {/if}
</AppLayout>

<style>
  .brand h1 {
    font-size: 1.25rem;
    margin: 0;
  }
</style>