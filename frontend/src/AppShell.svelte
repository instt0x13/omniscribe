<script lang="ts">
  import { Background, App, Note, Setting, Appearance, Modal } from "$features";
  import { theme } from "$services";
  import type { RoutePage } from "$types";

  theme.init();

  const routePages: RoutePage[] = [
    {
      id: "noteList",
      path: "/note/list",
      title: "Список",
      icon: "📑",
      component: Note.RouteList,
    },
    {
      id: "noteTabs",
      path: "/note/tabs",
      title: "Вкладки",
      icon: "🗂️",
      component: Note.RouteTabs,
    },
    {
      id:"settings",
      path: "/settings",
      title: "Настройки",
      icon: "⚙️",
      component: Setting.Route,
      props: {
        sections: [
          { title: "Оформление", component: Appearance.Settings },
          { title: "Фон", component: Background.Settings },
        ],
      },
    },
  ] as const;
</script>

<Background.Layer zindex={-1} />
<App.Layer zindex={0} routePages={routePages} />
<Modal.Layer zindex={1000} />
