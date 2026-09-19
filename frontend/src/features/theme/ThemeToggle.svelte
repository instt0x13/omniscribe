<script lang="ts">
  import { Tabs } from "$shared/ui";
    import GhostText from "../../shared/ui/primitives/GhostText.svelte";


  const modes = [
    {id:"system", icon:"🌗", title:"Системная"},
    {id:"light", icon:"☀️", title:"Светлая"},
    {id:"dark", icon:"🌙", title:"Тёмная"}
  ];
  type Mode = typeof modes[number]["id"];

  let mode = $state<Mode>(
    (typeof window !== "undefined" && (localStorage.getItem("theme-mode") as Mode)) || "system"
  );

  // $effect обновляет тему и следит за изменением режима
  $effect(() => {
    localStorage.setItem("theme-mode", mode);

    const applyTheme = () => {
      let activeTheme = mode;
      if (mode === "system") {
        const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        activeTheme = isDark ? "dark" : "light";
      }
      document.documentElement.setAttribute("data-theme", activeTheme);
    };

    applyTheme();

    // Слушатель системной смены темы OS, если выбран режим "system"
    if (mode === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      mediaQuery.addEventListener("change", applyTheme);
      return () => mediaQuery.removeEventListener("change", applyTheme);
    }
  });
</script>

<Tabs
  items={modes}
  active={modes.find((m) => m.id === mode) ?? modes[0]}
  getKey={(m) => m.id}
  onselect={(m) => (mode = m.id)}
>
  {#snippet tab(m)}
    <GhostText>
      {m.icon}
      {#if m.id === mode}
        {" " + m.title}
      {/if}
    </GhostText>
  {/snippet}
</Tabs>