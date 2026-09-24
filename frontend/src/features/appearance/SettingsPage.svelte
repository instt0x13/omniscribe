<script lang="ts">
  import { settings } from "$shared/services";
  import { ChoiceList, GhostText } from "$shared/ui";

  const modes = {
    system: { icon: "🌗", title: "Системная" },
    light: { icon: "☀️", title: "Светлая" },
    dark: { icon: "🌙", title: "Тёмная" },
  } as const satisfies Record<string, {
    icon: string,
    title: string
  }>;

  type Mode = keyof typeof modes;

  let mode = $derived(settings.get("theme-mode", "system") as Mode);

  function setMode(newMode: Mode) {
    settings.set("theme-mode", newMode);
  }

  // Реактивный эффект применения темы в DOM
  $effect(() => {
    const currentMode = mode;

    const applyTheme = () => {
      let activeTheme = currentMode;
      if (currentMode === "system") {
        const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        activeTheme = isDark ? "dark" : "light";
      }
      document.documentElement.setAttribute("data-theme", activeTheme);
    };

    applyTheme();

    if (currentMode === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      mediaQuery.addEventListener("change", applyTheme);
      return () => mediaQuery.removeEventListener("change", applyTheme);
    }
  });
</script>

<ChoiceList direction="horizontal"
  items={modes}
  active={mode}
  onselect={(key) => setMode(key)}
>
  {#snippet item(item, key)}
    <GhostText>
      {item.icon}
      {#if key === mode}
        {" " + item.title}
      {/if}
    </GhostText>
  {/snippet}
</ChoiceList>