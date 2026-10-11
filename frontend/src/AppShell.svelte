<script lang="ts">
  import { Router, Link, Route } from "svelte5-router";
  import {
    LayerBackground,
    LayerApp,
    LayerModal,
    RouteSettings,
    RouteNoteList,
    RouteNotesTabs,
    SettingsAppearance,
    SettingsBackground
  } from "$features";
  import { theme } from "$services";

  theme.init();

  let url = $state("");

  const routePages = [
    { path: "/note/list", title: "Список", icon: "📑", component: RouteNoteList },
    { path: "/note/tabs", title: "Вкладки", icon: "🗂️", component: RouteNotesTabs }
  ];

  const settingsSection = [
    { title: "Оформление", component: SettingsAppearance },
    { title: "Фон", component: SettingsBackground }
  ];
</script>

<LayerBackground zindex={-1}/>

<Router {url}>
  <LayerApp zindex={0}>
    {#snippet header()}
      <h1 class="brand">OmniScribe</h1>
    {/snippet}

    {#snippet sidebar()}
      <nav><ul class="column">
        {#each routePages as r}
          <li><Link to={r.path} class="maxW">
            {#snippet children(active)}
              <button class:active class="maxW">{r.icon} {r.title}</button>
            {/snippet}
          </Link></li>
        {/each}
      </ul></nav>
    {/snippet}

    {#snippet footer()}
      <Link to="/settings">
        {#snippet children(active)}
          <button class:active class="set-ico">⚙️</button>
        {/snippet}
      </Link>
    {/snippet}

    <!-- Маршруты определяются здесь -->
    <Route path="/settings">
      <RouteSettings settings={settingsSection}></RouteSettings>
    </Route>
    
    {#each routePages as r}
      <Route path={r.path} component={r.component} />
    {/each}

    <!-- Маршрут по умолчанию (домашняя страница или редирект) -->
    <Route path="/">
      <RouteNoteList /> <!-- или любой другой компонент по умолчанию -->
    </Route>
  </LayerApp>
</Router>

<LayerModal zindex={1000} />

<style>
  .brand { font-size: 1.25rem; margin: 0; }

  .column {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    align-content: stretch;
    gap: 0.3rem;
  }

  li, ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .maxW {
    width: 100%;
  }

  button {
    justify-content: start;
  }

  .set-ico {
    padding: 0;

  }

  .active {
    background-color: var(--primary-hover);
    color: var(--primary-text);
  }
</style>