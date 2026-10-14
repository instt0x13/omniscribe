<script lang="ts">
  import { Button, Layer } from "$ui";
  import type { RoutePage } from "$types";
  import { Link, Route, Router } from "svelte5-router";
  import CollapsibleItem from "./ui/CollapsibleItem.svelte";

  interface Props {
    zindex: number;
    routePages: RoutePage[];
  }

  let { zindex, routePages }: Props = $props();

  const settingsRoutePage = $derived(routePages.find((v) => v.id === "settings"));

  let collapsed = $state(false);
</script>

<Layer class="app" {zindex}>
  <Router>
    <div class="app-shell" class:collapsed>
      <aside class="shell-side">
        <header class="side-header">
          <CollapsibleItem reverse {collapsed}>
            {#snippet leading()}
              <button class="btn-collapsed surface" class:active={collapsed} class:collapsed
                onclick={() => (collapsed = !collapsed)}
              >
                {collapsed ? "❯" : "❮"}
              </button>
            {/snippet}
              <Link to="/" aria-label="Главная">
                {#snippet children(active)}
                  <h1 class="brand surface" class:active>OmniScribe</h1>
                {/snippet}
              </Link>
          </CollapsibleItem>
          
        </header>
        <nav class="side-navigation" aria-label="Основная навигация">
          <ul class="navigation-items">
            {#each routePages as route}
              <li class="navigagion-item">
                <Link to={route.path}>
                  {#snippet children(active)}
                    <CollapsibleItem hoverable {collapsed} {active}>
                      {#snippet leading()}
                        {route.icon}
                      {/snippet}
                      {route.title}
                    </CollapsibleItem>
                  {/snippet}
                </Link>
              </li>
            {/each}
          </ul>
        </nav>
        <footer class="side-footer">
          <CollapsibleItem {collapsed}>
            {#snippet leading()}
              <Link to="/settings" aria-label="Настройки">
                {#snippet children(active)}
                  <span class="icon surface" class:active>
                    {settingsRoutePage?.icon}
                  </span>
                {/snippet}
              </Link>
            {/snippet}
          </CollapsibleItem>
        </footer>
      </aside>
      <main class="app-content grow">
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
    grid-template: 1fr / calc(var(--font-size) * 13) 1fr;
  }
  .app-shell.collapsed {
    grid-template-columns: calc(var(--font-size) * 3) 1fr;
  }

  .shell-side {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    background: var(--panel);
    padding: var(--space);
    gap: calc(var(--space) * 3);
  }

  .side-header, .side-footer {
    overflow: hidden;
  }
  .side-navigation {
    flex-grow: 1;
  }
  .navigation-items {
    display: flex;
    flex-direction: column;
    gap: calc(var(--space) * 1);
  }

  .app-content {
    padding: calc(var(--space) * 3);
    overflow: auto;
  }

  .btn-collapsed {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: center;
    align-items: center;
    aspect-ratio: 1 / 1; 
    font-size: calc(var(--font-size) * 1.25);
    width: calc(var(--font-size) * 2.5);
    line-height: 1;
  }
  .btn-collapsed.collapsed {
    font-size: calc(var(--font-size) * 1);
    width: calc(var(--font-size) * 2);
  }

  .surface {
    padding: var(--space);
    background-color: var(--surface);
    border-radius: var(--radius);
    border: 1px solid var(--border);
  }
  .surface:hover {
    background-color: var(--surface-hover);
  }
  .surface.active {
    color: var(--primary-text);
    background-color: var(--primary-active);
  }
  .surface:hover.active {
    background-color: var(--primary-hover);
  }

  .icon {
    flex: 1;
    aspect-ratio: 1 / 1;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: calc(var(--font-size) * 1.2);
    line-height: 1;
  }

  .brand {
    font-size: calc(var(--font-size) * 1.25);
  }
</style>