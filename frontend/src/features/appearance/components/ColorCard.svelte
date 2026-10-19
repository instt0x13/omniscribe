<script lang="ts">
  import { theme } from "$services";

  type Role = "primary" | "accent";

  let { role }: { role: Role } = $props();

  const CONFIG = {
    accent: {
      title: "Основной",
      hue:   theme.hue,
      sat:   theme.sat,
      lightness:  "var(--surface-l-hover)",
      background: "var(--surface-hover)",
      color:      "var(--text)",
    },
    primary: {
      title: "Акцентный",
      hue:   theme.primaryH,
      sat:   theme.primaryS,
      lightness:  "var(--primary-l)",
      background: "var(--primary)",
      color:      "var(--primary-text)",
    },
  } as const;

  const cfg = $derived(CONFIG[role]);

  const title      = $derived(cfg.title);
  const hue        = $derived(cfg.hue);
  const sat        = $derived(cfg.sat);
  const lightness  = $derived(cfg.lightness);
  const background = $derived(cfg.background);
  const color      = $derived(cfg.color);

  const HUE_STOPS = $derived(
    Array.from(
      { length: 13 },
      (_, i) => `hsl(${i * 30} ${sat.meta.max}% ${lightness})`
    ).join(", ")
  );

  const hueTrack = $derived(`linear-gradient(to right, ${HUE_STOPS})`);

  const satTrack = $derived(
    `linear-gradient(to right,
      hsl(var(${hue.meta.name}) ${sat.meta.min}% ${lightness}),
      hsl(var(${hue.meta.name}) ${sat.meta.max}% ${lightness}))`
  );
</script>

<div class="color-card">
  <div class="color-card__preview" style:background style:color>
    <span class="color-card__title">{title}</span>
    <span class="color-card__values">
      {hue.value}<span class="color-card__unit">°</span>
      {sat.value}<span class="color-card__unit">%</span>
    </span>
  </div>

  <!-- насыщенность: вертикальный ползунок справа -->
  <div class="color-card__sat">
    <input
      class="color-card__range"
      type="range"
      min={sat.meta.min}
      max={sat.meta.max}
      step={sat.meta.step}
      bind:value={sat.value}
      style:--track={satTrack}
      aria-label="Насыщенность"
    />
  </div>

  <!-- оттенок: горизонтальный ползунок снизу -->
  <input
    class="color-card__range color-card__hue"
    type="range"
    min={hue.meta.min}
    max={hue.meta.max}
    step={hue.meta.step}
    bind:value={hue.value}
    style:--track={hueTrack}
    aria-label="Оттенок"
  />
</div>

<style>
  .color-card {
    --size: 8rem;
    --bar: 1rem;
    --gap: var(--space);

    display: grid;
    grid-template-columns: var(--size) var(--bar);
    grid-template-rows: var(--size) var(--bar);
    gap: var(--gap);
  }

  /* --- превью --- */
  .color-card__preview {
    grid-area: 1 / 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: var(--space);
    border-radius: var(--radius);
    box-shadow: var(--shadow-sm);
    transition: background 0.06s linear, color 0.06s linear;
    overflow: hidden;
  }

  .color-card__title {
    font-size: 1rem;
    font-weight: 600;
  }

  .color-card__values {
    font-size: 0.85rem;
    font-variant-numeric: tabular-nums;
    opacity: 0.85;
  }

  .color-card__unit {
    margin-left: 0.1rem;
    font-size: 0.75rem;
    opacity: 0.6;
  }

  /* --- общие стили ползунков --- */
  .color-card__range {
    -webkit-appearance: none;
    appearance: none;
    margin: 0;
    padding: 0;
    border: none;
    border-radius: calc(var(--radius) / 2);
    background: var(--track);
    box-shadow: var(--shadow-sm);
    cursor: pointer;
  }

  .color-card__range::-webkit-slider-runnable-track {
    -webkit-appearance: none;
    height: 100%;
    background: transparent;
    border: none;
  }
  .color-card__range::-moz-range-track {
    height: 100%;
    background: transparent;
    border: none;
  }

  .color-card__range::-webkit-slider-thumb {
    -webkit-appearance: none;
    box-sizing: border-box;
    width: var(--bar);
    height: var(--bar);
    border-radius: 50%;
    background: var(--text);
    border: 2px solid var(--border);
    box-shadow: var(--shadow-sm);
  }
  .color-card__range::-moz-range-thumb {
    box-sizing: border-box;
    width: var(--bar);
    height: var(--bar);
    border-radius: 50%;
    background: var(--text);
    border: 2px solid var(--border);
    box-shadow: var(--shadow-sm);
  }

  /* --- горизонтальный (оттенок) --- */
  .color-card__hue {
    grid-area: 2 / 1;
    width: var(--size);
    height: var(--bar);
  }

  /* --- вертикальный (насыщенность) --- */
  .color-card__sat {
    grid-area: 1 / 2;
    position: relative;
    width: var(--bar);
    height: var(--size);
  }
  .color-card__sat .color-card__range {
    position: absolute;
    top: 50%;
    left: 50%;
    width: var(--size);
    height: var(--bar);
    transform: translate(-50%, -50%) rotate(-90deg);
  }
</style>