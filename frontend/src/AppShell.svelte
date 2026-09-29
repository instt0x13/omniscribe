<script lang="ts">
  import page from "page";
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

  let activePath = $state("/")
  
  // Синхронизация с URL
  page("/*", (ctx) => { activePath = ctx.path; });

  $effect(() => {
    page.start();
    return () => page.stop();
  });
</script>

<LayerBackground zindex={-1}/>

<LayerApp zindex={0}
  pathroute={activePath}
  onselectroute={(path) => page.show(path)}
  routes={[
    { path: "/note/list", title: "Список", icon: "📑", component: RouteNoteList },
    { path: "/note/tabs", title: "Вкладки", icon: "🗂️", component: RouteNotesTabs }
  ]}
  pathsettings="/settngs"
>
  {#snippet pagesettings()}
    <RouteSettings settings={[
      { title: "Оформление", component: SettingsAppearance },
      { title: "Фон", component: SettingsBackground }
    ]}/>
  {/snippet}
</LayerApp>

<LayerModal zindex={1000} />