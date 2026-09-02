<script lang="ts">
  type Mode = "system" | "light" | "dark";

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

<div class="theme-toggle">
  <button class:active={mode === "system"} onclick={() => (mode = "system")}>
    💻 Системная
  </button>
  <button class:active={mode === "light"} onclick={() => (mode = "light")}>
    ☀️ Светлая
  </button>
  <button class:active={mode === "dark"} onclick={() => (mode = "dark")}>
    🌙 Тёмная
  </button>
</div>

<style>
  .theme-toggle {
    display: inline-flex;
    background: var(--panel);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 0.25rem;
    gap: 0.25rem;
  }

  .theme-toggle button {
    background: transparent;
    color: var(--text);
    padding: 0.4rem 0.75rem;
    font-size: 0.875rem;
    border-radius: calc(var(--radius) - 2px);
  }

  .theme-toggle button.active {
    background: var(--primary);
    color: #ffffff;
  }
</style>