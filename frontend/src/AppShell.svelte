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
  import { GhostText, List, ListItem, Nav } from "$ui";
  import { settings, theme } from "$services";

  // Для SSR (можно оставить пустой строкой, если SSR не используется)
  let url = $state("");

  const routePages = [
    { path: "/note/list", title: "Список", icon: "📑", component: RouteNoteList },
    { path: "/note/tabs", title: "Вкладки", icon: "🗂️", component: RouteNotesTabs }
  ];

  const settingsSection = [
    { title: "Оформление", component: SettingsAppearance },
    { title: "Фон", component: SettingsBackground }
  ];

  theme.setMode(settings.get(theme.nameSetting.mode));
  theme.fromJSON(settings.get(theme.nameSetting.state));
</script>

<LayerBackground zindex={-1}/>

<Router {url}>
  <LayerApp zindex={0}>
    {#snippet header()}
      <h1 class="brand">OmniScribe</h1>
    {/snippet}

    {#snippet sidebar()}
      <nav>
        <List direction="vertical">
          {#each routePages as r}
            <Link to={r.path}>
              {#snippet children(active)}
                <ListItem active={active}>
                  {r.icon} {r.title}
                </ListItem>
              {/snippet}
            </Link>
          {/each}
        </List>
      </nav>
    {/snippet}

    {#snippet footer()}
      <Link to="/settings">⚙️</Link>
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
</style>