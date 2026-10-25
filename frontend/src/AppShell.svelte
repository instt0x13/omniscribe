<script lang="ts">
  import { Background, App, Note, Setting, Appearance, Modal, Test } from "$features";
  import { theme } from "$services";
  import type { RoutePage } from "$types";

  theme.init();

  const routePages: RoutePage[] = [
    {
      id: "home",
      path: "/",
      title: "Домашняя",
    },
    {
      id: "noteList",
      path: "/note/list",
      title: "Список",
      icon: "📑",
      component: Note.PageList,
    },
    {
      id: "noteTabs",
      path: "/note/tabs",
      title: "Вкладки",
      icon: "🗂️",
      component: Note.PageTabs,
    },
    {
      id: "test",
      path: "/test",
      title: "ест",
      icon: "Т",
      component: Test.Page,
    },
    {
      id:"settings",
      path: "/settings",
      title: "Настройки",
      icon: "⚙️",
      component: Setting.Page,
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
