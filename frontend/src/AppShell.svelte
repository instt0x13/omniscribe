<script lang="ts">
  import { Router, Link, Route } from "svelte5-router";
  import { Background, App, Note, Setting, Appearance, Modal } from "$features";
  import { theme } from "$services";

  theme.init();

  const routePages = [
    { path: "/note/list", title: "Список", icon: "📑", component: Note.RouteList },
    { path: "/note/tabs", title: "Вкладки", icon: "🗂️", component: Note.RouteTabs }
  ];

  const routeSetings = { path: "/settings", title: "Настройки", icon: "⚙️", component: Setting.Route };
  const settingsSection = [
    { title: "Оформление", component: Appearance.Settings },
    { title: "Фон", component: Background.Settings }
  ];

  let collapsed = $state(false);
</script>

<Router>

  <Background.Layer zindex={-1} />

  <App.Layer zindex={0} collapsed={collapsed}>
    {#snippet header()}
      <button onclick={() => (collapsed = !collapsed)}>
        {collapsed ? "▶" : "◀"}
      </button>
      <h1 class="brand truncate">OmniScribe</h1>
    {/snippet}

    {#snippet sidebar()}
      <nav aria-label="Основная навигация">
        <ul class="column gap-1">
          {#each routePages as r}
            <li>
              <Link to={r.path}>
                {#snippet children(active)}
                  <span class="nav-item full" class:active>
                    <span class="nav-icon">{r.icon}</span>
                    <span class="nav-title" class:collapsed>{r.title}</span>
                  </span>
                {/snippet}
              </Link>
            </li>
          {/each}
        </ul>
      </nav>
    {/snippet}

    {#snippet footer()}
      <Link to="/settings">
        {#snippet children(active)}
          <span class="icon-btn" class:active aria-label="Настройки">⚙️</span>
        {/snippet}
      </Link>
    {/snippet}

    <Route path="/settings">
      <Setting.Route settings={settingsSection} />
    </Route>

    {#each routePages as r}
      <Route path={r.path} component={r.component} />
    {/each}

    <Route path="/">
      <!-- или любой другой компонент по умолчанию -->
    </Route>
  </App.Layer>

  <Modal.Layer zindex={1000} />

</Router>

<style>
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