<script lang="ts">
  import { theme } from "$services";

  const space  = theme.space;  // px
  const radius = theme.radius; // px

  // отступ: узкий → широкий (горизонтально)
  const spaceTrack = $derived(
    `linear-gradient(to right,
      hsl(var(--hue) calc(var(--sat) * 0.4) 50% / 0.15),
      hsl(var(--hue) var(--sat) 50% / 0.9))`
  );

  // округление: острый → скруглённый (вертикально)
  const radiusTrack = $derived(
    `linear-gradient(to right,
      hsl(var(--hue) calc(var(--sat) * 0.4) 50% / 0.15),
      hsl(var(--hue) var(--sat) 50% / 0.9))`
  );
</script>

<div class="space-card">
  <!-- превью -->
  <div class="space-card__preview">
    <span class="space-card__title">Отступ</span>

    <div class="space-card__demo">
      <div class="space-card__demo-inner">Aa</div>
    </div>

    <span class="space-card__values">
      {space.value}<span class="space-card__unit">{space.meta.unit}</span>
      {radius.value}<span class="space-card__unit">{radius.meta.unit}</span>
    </span>
  </div>

  <!-- округление: вертикальный ползунок справа -->
  <div class="space-card__vertical">
    <input
      class="space-card__range"
      type="range"
      min={radius.meta.min}
      max={radius.meta.max}
      step={radius.meta.step}
      bind:value={radius.value}
      style:--track={radiusTrack}
      aria-label="Округление"
    />
  </div>

  <!-- отступ: горизонтальный ползунок снизу -->
  <input
    class="space-card__range space-card__horizontal"
    type="range"
    min={space.meta.min}
    max={space.meta.max}
    step={space.meta.step}
    bind:value={space.value}
    style:--track={spaceTrack}
    aria-label="Отступ"
  />
</div>

<style>
  .space-card {
    --size: 8rem;
    --bar: 1rem;
    --gap: var(--space);

    display: grid;
    grid-template-columns: var(--size) var(--bar);
    grid-template-rows: var(--size) var(--bar);
    gap: var(--gap);
  }

  /* ─── превью ───────────────────────────────── */
  .space-card__preview {
    grid-area: 1 / 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: calc(var(--space) / 2);
    /* внутренний отступ = --space, демонстрирует значение */
    padding: var(--space);
    /* скругление карточки = --radius */
    border-radius: var(--radius);
    background: var(--surface-hover);
    box-shadow: var(--shadow-sm);
    overflow: hidden;
    transition: padding 0.06s linear, border-radius 0.06s linear;
  }

  .space-card__title {
    font-size: 1rem;
    font-weight: 600;
  }

  .space-card__values {
    display: flex;
    gap: 0.4rem;
    font-size: 0.85rem;
    font-variant-numeric: tabular-nums;
    opacity: 0.85;
  }

  .space-card__unit {
    margin-left: 0.1rem;
    font-size: 0.75rem;
    opacity: 0.6;
  }

  /* ─── демо-блок: показывает --space + --radius ─ */
  .space-card__demo {
    flex: 1;
    min-height: 0;
    display: flex;
    overflow: hidden;
  }

  .space-card__demo-inner {
    flex: 1;
    min-width: 0;
    min-height: 0;
    display: grid;
    place-items: center;
    overflow: hidden;
    /* скругление = --radius */
    border-radius: var(--radius);
    background: var(--primary);
    color: var(--primary-text);
    font-weight: 600;
    line-height: 1;
    transition: border-radius 0.06s linear;
  }

  /* ─── общие стили ползунков ────────────────── */
  .space-card__range {
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

  .space-card__range::-webkit-slider-runnable-track {
    -webkit-appearance: none;
    height: 100%;
    background: transparent;
    border: none;
  }
  .space-card__range::-moz-range-track {
    height: 100%;
    background: transparent;
    border: none;
  }

  .space-card__range::-webkit-slider-thumb {
    -webkit-appearance: none;
    box-sizing: border-box;
    width: var(--bar);
    height: var(--bar);
    border-radius: 50%;
    background: var(--text);
    border: 2px solid var(--border);
    box-shadow: var(--shadow-sm);
  }
  .space-card__range::-moz-range-thumb {
    box-sizing: border-box;
    width: var(--bar);
    height: var(--bar);
    border-radius: 50%;
    background: var(--text);
    border: 2px solid var(--border);
    box-shadow: var(--shadow-sm);
  }

  /* ─── горизонтальный (отступ) ──────────────── */
  .space-card__horizontal {
    grid-area: 2 / 1;
    width: var(--size);
    height: var(--bar);
  }

  /* ─── вертикальный (округление) ────────────── */
  .space-card__vertical {
    grid-area: 1 / 2;
    position: relative;
    width: var(--bar);
    height: var(--size);
  }
  .space-card__vertical .space-card__range {
    position: absolute;
    top: 50%;
    left: 50%;
    width: var(--size);
    height: var(--bar);
    transform: translate(-50%, -50%) rotate(-90deg);
  }
</style>