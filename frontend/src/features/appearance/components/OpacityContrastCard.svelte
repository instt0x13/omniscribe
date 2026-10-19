<script lang="ts">
  import { theme } from "$services";

  const alpha    = theme.alpha;    // 0..1
  const contrast = theme.contrast; // 0..1

  // прозрачность: прозрачный → плотный (горизонтально)
  const alphaTrack = $derived(
    `linear-gradient(to right,
      hsl(var(--hue) var(--sat) 50% / 0),
      hsl(var(--hue) var(--sat) 50% / 1))`
  );

  // контрастность: приглушённый → резкий (вертикально)
  // градиент рисуется по оси слайдера (до rotate), затем вся полоса поворачивается
  const contrastTrack = $derived(
    `linear-gradient(to right,
      hsl(var(--hue) 40% 60%),
      hsl(var(--hue) 90% 20%))`
  );
</script>

<div class="opacity-card">
  <!-- превью -->
  <div class="opacity-card__preview">
    <span class="opacity-card__title">Прозрачность</span>

    <div class="opacity-card__demo">
      <div class="opacity-card__checker"></div>
      <div class="opacity-card__color"></div>
    </div>

    <span class="opacity-card__values">
      {Math.round(alpha.value * 100)}<span class="opacity-card__unit">%</span>
      {Math.round(contrast.value * 100)}<span class="opacity-card__unit">%</span>
    </span>
  </div>

  <!-- контрастность: вертикальный ползунок справа -->
  <div class="opacity-card__vertical">
    <input
      class="opacity-card__range"
      type="range"
      min={contrast.meta.min}
      max={contrast.meta.max}
      step={contrast.meta.step}
      bind:value={contrast.value}
      style:--track={contrastTrack}
      aria-label="Контрастность"
    />
  </div>

  <!-- прозрачность: горизонтальный ползунок снизу -->
  <input
    class="opacity-card__range opacity-card__horizontal"
    type="range"
    min={alpha.meta.min}
    max={alpha.meta.max}
    step={alpha.meta.step}
    bind:value={alpha.value}
    style:--track={alphaTrack}
    aria-label="Прозрачность"
  />
</div>

<style>
  .opacity-card {
    --size: 8rem;
    --bar: 1rem;
    --gap: var(--space);

    display: grid;
    grid-template-columns: var(--size) var(--bar);
    grid-template-rows: var(--size) var(--bar);
    gap: var(--gap);
  }

  /* ─── превью ───────────────────────────────── */
  .opacity-card__preview {
    grid-area: 1 / 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: calc(var(--space) / 2);
    padding: var(--space);
    border-radius: var(--radius);
    background: var(--surface-hover);
    box-shadow: var(--shadow-sm);
    overflow: hidden;
  }

  .opacity-card__title {
    font-size: 1rem;
    font-weight: 600;
  }

  /* ─── демо-слой: клетка + цвет с alpha ─────── */
  .opacity-card__demo {
    position: relative;
    flex: 1;
    min-height: 0;
    border-radius: calc(var(--radius) / 2);
    overflow: hidden;
  }

  .opacity-card__checker {
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(45deg,  var(--border-strong) 25%, transparent 25%),
      linear-gradient(-45deg, var(--border-strong) 25%, transparent 25%),
      linear-gradient(45deg,  transparent 75%, var(--border-strong) 75%),
      linear-gradient(-45deg, transparent 75%, var(--border-strong) 75%);
    background-size: 8px 8px;
    background-position: 0 0, 0 4px, 4px -4px, -4px 0;
  }

  /* --primary уже содержит alpha (--surface-a) и зависит от --contrast */
  .opacity-card__color {
    position: absolute;
    inset: 0;
    background: var(--primary);
  }

  .opacity-card__values {
    display: flex;
    gap: 0.4rem;
    font-size: 0.85rem;
    font-variant-numeric: tabular-nums;
    opacity: 0.85;
  }

  .opacity-card__unit {
    margin-left: 0.1rem;
    font-size: 0.75rem;
    opacity: 0.6;
  }

  /* ─── общие стили ползунков ────────────────── */
  .opacity-card__range {
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

  .opacity-card__range::-webkit-slider-runnable-track {
    -webkit-appearance: none;
    height: 100%;
    background: transparent;
    border: none;
  }
  .opacity-card__range::-moz-range-track {
    height: 100%;
    background: transparent;
    border: none;
  }

  .opacity-card__range::-webkit-slider-thumb {
    -webkit-appearance: none;
    box-sizing: border-box;
    width: var(--bar);
    height: var(--bar);
    border-radius: 50%;
    background: var(--text);
    border: 2px solid var(--border);
    box-shadow: var(--shadow-sm);
  }
  .opacity-card__range::-moz-range-thumb {
    box-sizing: border-box;
    width: var(--bar);
    height: var(--bar);
    border-radius: 50%;
    background: var(--text);
    border: 2px solid var(--border);
    box-shadow: var(--shadow-sm);
  }

  /* ─── горизонтальный (прозрачность) ────────── */
  .opacity-card__horizontal {
    grid-area: 2 / 1;
    width: var(--size);
    height: var(--bar);
  }

  /* ─── вертикальный (контрастность) ─────────── */
  .opacity-card__vertical {
    grid-area: 1 / 2;
    position: relative;
    width: var(--bar);
    height: var(--size);
  }
  .opacity-card__vertical .opacity-card__range {
    position: absolute;
    top: 50%;
    left: 50%;
    width: var(--size);
    height: var(--bar);
    transform: translate(-50%, -50%) rotate(-90deg);
  }
</style>