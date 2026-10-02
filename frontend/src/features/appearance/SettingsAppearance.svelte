<script lang="ts">
  import { settings, theme } from "$services";
  import { ChoiceList, GhostText } from "$ui";

  const modes = {
    system: { icon: "🌗", title: "Системная" },
    light: { icon: "☀️", title: "Светлая" },
    dark: { icon: "🌙", title: "Тёмная" },
  } as const satisfies Record<string, { icon: string; title: string }>;

  type Mode = keyof typeof modes;

  let mode = $derived(
    settings.get(theme.nameSetting.mode, "system") as Mode
  );

  function setMode(newMode: Mode) {
    theme.setMode(newMode);
    settings.set(theme.nameSetting.mode, newMode);
  }

  const variables = [
    { name: "--hue",       title: "Оттенок",                 min: 0,  max: 360, step: 1,    unit: "",   default: 220 },
    { name: "--primary-h", title: "Оттенок основного цвета", min: 0,  max: 360, step: 1,    unit: "",   default: 220 },
    { name: "--sat",       title: "Насыщенность",            min: 0,  max: 100, step: 1,    unit: "%",  default: 40 },
    { name: "--primary-s", title: "Насыщенность основного",  min: 0,  max: 100, step: 1,    unit: "%",  default: 80 },
    { name: "--alpha",     title: "Прозрачность",            min: 0,  max: 1,   step: 0.01, unit: "",   default: 0.8 },
    { name: "--contrast",  title: "Контрастность",           min: 0.7,  max: 1,   step: 0.01, unit: "",   default: 1 },
    { name: "--radius",    title: "Скругление",              min: 0,  max: 32,  step: 1,    unit: "px", default: 8 },
    { name: "--font-size", title: "Размер шрифта",           min: 12, max: 24,  step: 1,    unit: "px", default: 16 },
  ] as const;

  type Variable = typeof variables[number];

  function getValue(variable: Variable): number {
    if (typeof document === "undefined") return variable.default;

    const raw = getComputedStyle(document.documentElement)
      .getPropertyValue(variable.name)
      .trim();

    if (!raw) return variable.default;

    const value = Number.parseFloat(raw);
    return Number.isFinite(value) ? value : variable.default;
  }

  function toCssValue(variable: Variable, value: number): string {
    const clamped = Math.min(variable.max, Math.max(variable.min, value));

    if (variable.name === "--font-size" && variable.unit === "px") {
      const rootPx = 16;
      return `${clamped / rootPx}rem`;
    }

    return `${clamped}${variable.unit}`;
  }

  function setValue(variable: Variable, value: number) {
    theme.set(variable.name, toCssValue(variable, value));
    settings.set(theme.nameSetting.state, theme.toJSON());
  }

  function resetTheme() {
    theme.reset();
    settings.set(theme.nameSetting.state, theme.toJSON());
  }
</script>

<section class="theme-settings">
  <ChoiceList
    direction="horizontal"
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

  <div class="theme-variables">
    {#each variables as variable (variable.name)}
      {@const value = getValue(variable)}

      <div class="theme-variable">
        <div class="theme-variable__header">
          <GhostText>{variable.title}</GhostText>

          <label class="theme-variable__value">
            <input
              type="number"
              min={variable.min}
              max={variable.max}
              step={variable.step}
              value={value}
              oninput={(event) => {
                const input = event.currentTarget as HTMLInputElement;
                setValue(variable, Number(input.value));
              }}
            />
            {#if variable.unit}
              <span>{variable.unit}</span>
            {/if}
          </label>
        </div>

        <input
          class="theme-variable__range"
          type="range"
          min={variable.min}
          max={variable.max}
          step={variable.step}
          value={value}
          oninput={(event) => {
            const input = event.currentTarget as HTMLInputElement;
            setValue(variable, Number(input.value));
          }}
        />
      </div>
    {/each}
  </div>

  <button type="button" onclick={resetTheme}>
    Сбросить настройки темы
  </button>
</section>

<style>
  .theme-settings {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    width: 100%;
    max-width: 720px;
  }

  .theme-variables {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 1rem;
  }

  .theme-variable {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .theme-variable__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
  }

  .theme-variable__value {
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }

  .theme-variable__value input {
    width: 4.5rem;
  }

  .theme-variable__range {
    width: 100%;
  }
</style>