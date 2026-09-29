<script lang="ts">
  import type { Snippet } from "svelte";
  import { AppLayout, GhostText, Layer, SplitRow, ViewList } from "$ui";
  import type { RoutePage } from "$types";

  interface Props {
    zindex: number,
    pathroute: string,
    onselectroute: (path: string) => void,
    routes: RoutePage[],
    pathsettings: string,
    pagesettings: Snippet
  }
  let { zindex, pathroute, onselectroute, routes, pathsettings, pagesettings }: Props = $props();
  
  let activeRoute = $derived(
    routes.find(v => v.path === pathroute) ?? null
  );
</script>

<Layer class="app" zindex={zindex}>
  <AppLayout>
    {#snippet header()}
      <div class="brand">
        <h1>OmniScribe</h1>
      </div>
    {/snippet}

    {#snippet sidebar()}
      <ViewList
        direction="vertical"
        items={routes}
        key="path"
        active={pathroute}
        onselect={(path) => { onselectroute(path); }}
      >
        {#snippet item(view)}
          <GhostText>{view.title}</GhostText>
        {/snippet}
      </ViewList>
    {/snippet}

    {#snippet footer()}
      <SplitRow>{#snippet right()}
        <a href={pathsettings}>⚙️</a>
      {/snippet}</SplitRow>
    {/snippet}

    {#if pathroute === pathsettings}
      {@render pagesettings()}
    {:else if activeRoute}
      {@const Page = activeRoute.component}
      <Page />
    {/if}
  </AppLayout>
</Layer>

<style>
  .brand h1 {
    font-size: 1.25rem;
    margin: 0;
  }
</style>