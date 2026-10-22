<script lang="ts">
  import { Layer } from "$ui";
  import type { RoutePage } from "$types";
  import { Route, Router } from "svelte5-router";
  import CollapsibleHeader from "./components/CollapsibleHeader.svelte";
  import CollapsibleFooter from "./components/CollapsibleFooter.svelte";
  import CollapsibleNavigation from "./components/CollapsibleNavigation.svelte";

  interface Props {
    zindex: number;
    routePages: RoutePage[];
  }

  let { zindex, routePages }: Props = $props();

  const routePageHome = $derived(routePages.find((v) => v.id === "home"));
  const routePageSettings = $derived(routePages.find((v) => v.id === "settings"));

  const DETACHED = ["home", "settings"] as const;
  const routePagesNav = $derived(
    routePages.filter((route) => !DETACHED.includes(route.id as (typeof DETACHED)[number])),
  );

  let collapsed = $state(false);
</script>

<Layer class="app" {zindex}>
  <Router>
    <div class="app-shell" class:collapsed>
      <aside class="shell-side" class:collapsed>
        <CollapsibleHeader routePageHome={routePageHome} bind:collapsed />
        <CollapsibleNavigation routePagesNav={routePagesNav} {collapsed} />
        <CollapsibleFooter routePageSettings={routePageSettings} {collapsed} />
      </aside>
      <main class="app-content">
        {#each routePages as route}
          <Route path={route.path} component={route.component} {...route.props} />
        {/each}
      </main>
    </div>
  </Router>
</Layer>

<style>
  .app-shell {
    block-size: 100dvh;
    width: 100%;
    overflow: hidden;

    display: grid;
    grid-template: 1fr / calc(13rem + var(--space)) 1fr;
  }
  .app-shell.collapsed {
    grid-template-columns: calc(3rem + var(--space)) 1fr;
  }

  .shell-side {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    border-right: 2px solid var(--border);
    background: var(--panel);
    padding: var(--space);
    gap: var(--space-lg);
  }
  .shell-side.collapsed {
    padding: var(--space-sm);
  }

  .app-content {
    flex-grow: 1;
    padding: var(--space-lg);
    overflow: auto;
  }
</style>