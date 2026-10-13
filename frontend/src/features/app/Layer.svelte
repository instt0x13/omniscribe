<script lang="ts">
  import { Layer } from "$ui";
  import type { RoutePage } from "$types";
  import { Link, Route, Router } from "svelte5-router";

  interface Props {
    zindex: number;
    routePages: RoutePage[];
  }

  let { zindex, routePages }: Props = $props();

  let collapsed = $state(false);
</script>

<Layer class="app" {zindex}>
  <Router>
    <div class="app-shell row">
      <aside class="app-sidebar column padding-2 gap-2" class:collapsed>
        <header class="side-header row gap-5 middle around">
          <button onclick={() => (collapsed = !collapsed)}>
            {collapsed ? "▶" : "◀"}
          </button>
          <h1 class="brand truncate">OmniScribe</h1>
        </header>
        <div class="side-content grow">
          <nav aria-label="Основная навигация">
            <ul class="column gap-1">
              {#each routePages as route}
                <li>
                  <Link to={route.path}>
                    {#snippet children(active)}
                      <span class="nav-item full" class:active>
                        <span class="nav-icon">{route.icon}</span>
                        <span class="nav-title" class:collapsed>{route.title}</span>
                      </span>
                    {/snippet}
                  </Link>
                </li>
              {/each}
            </ul>
          </nav>
        </div>
        <footer class="side-footer">
          <Link to="/settings">
            {#snippet children(active)}
              <span class="icon-btn" class:active aria-label="Настройки">⚙️</span>
            {/snippet}
          </Link>
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
  }

  .side-header, .side-footer {
    overflow: hidden;
  }

  .app-sidebar {
    background: var(--panel);
    border-right: 2px solid var(--border);
    max-width: calc(var(--font-size) * 16);
    transition: max-width var(--transition) ;
  }
  .app-sidebar.collapsed {
    max-width: calc(var(--font-size) * 4);
  }

  .app-content {
    padding: calc(var(--space) * 3);
    overflow: visible;
  }

  .brand {
    font-size: calc(var(--font-size) * 1.25);
  }

  .nav-item {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: calc(var(--space) * 2);
    padding: calc(var(--space) * 2) calc(var(--space) * 3);
    border-radius: var(--radius);
    color: var(--text);
    cursor: pointer;
    width: 100%;
    transition: all var(--transition);
    position: relative;
    z-index: 1;
  }

  .nav-item:hover {
    width: 12rem;
    background: var(--surface-hover);
  }

  .nav-item.active {
    background: var(--primary-active);
    color: var(--primary-text);
  }

  .nav-item.active:hover {
    background: var(--primary-hover);
  }

  .nav-icon {
    flex-shrink: 0;
    font-size: 1.1em;
    line-height: 1;
  }

  .nav-title,
  .nav-item:hover .nav-title.collapsed {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    transform-origin: left center;
    transition: all 0.3s ease;
    max-width: 100%;
    opacity: 1;
    transform: scaleX(1);
  }

  .nav-title.collapsed {
    max-width: 0;
    opacity: 0;
    transform: scaleX(0.8);
  }

  .icon-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: calc(var(--space) * 10);
    height: calc(var(--space) * 10);
    border-radius: var(--radius);
    font-size: 1.25rem;
    line-height: 1;
    cursor: pointer;
    transition: background var(--transition);
  }

  .icon-btn:hover {
    background: var(--surface-hover);
  }

  .icon-btn.active {
    background: var(--primary-hover);
  }
</style>