<script lang="ts">
  import { theme } from "$services";

  const alpha      = theme.alpha;    // 0..1
  const intensity = theme.intensity; // 0..1

  // прозрачность: прозрачный → плотный (горизонтально)
  const alphaTrack = $derived(
    `linear-gradient(to right,
      transparent,
      var(--surface))`
  );

  // контрастность: приглушённый → резкий (вертикально)
  // градиент рисуется по оси слайдера (до rotate), затем вся полоса поворачивается
  const intensityTrack = $derived(
    `linear-gradient(to left, 
      var(--surface), 
      var(--surface-hover))`
  );
</script>

<div class="opacity-card">
  <!-- превью -->
  <div class="opacity-card__preview opacity-bg-image">
    <div class="opacity-card__demo opacity-bg-image">
      <div class="opacity-card__labels">
        <span class="label-intensity">Интенсивность</span>
        <span class="label-alpha">Прозрачность</span>
      </div>
    </div>
  </div>

  <!-- контрастность: вертикальный ползунок справа -->
  <div class="opacity-card__vertical">
    <input
      class="opacity-card__range"
      type="range"
      min={intensity.meta.min}
      max={intensity.meta.max}
      step={intensity.meta.step}
      bind:value={intensity.value}
      style:--track={intensityTrack}
      aria-label="Яркость"
    />
  </div>

  <!-- прозрачность: горизонтальный ползунок снизу -->
  <div class="opacity-card__horizontal opacity-bg-image">
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
</div>

<style>
  .opacity-card {
    display: grid;
    grid-template-columns: var(--size) var(--bar);
    grid-template-rows: var(--size) var(--bar);
    gap: var(--gap);
  }

  .opacity-bg-image {
    --bg-opacity-color: hsl(from var(--border-hover) h s l / min(max(0.1, var(--alpha)), 0.6));
    background-image: 
      linear-gradient(45deg,  var(--bg-opacity-color) 25%, transparent 25%),
      linear-gradient(-45deg, var(--bg-opacity-color) 25%, transparent 25%),
      linear-gradient(45deg,  transparent 75%, var(--bg-opacity-color) 75%),
      linear-gradient(-45deg, transparent 75%, var(--bg-opacity-color) 75%);
    background-size: 8px 8px;
    background-position: 0 0, 0 4px, 4px -4px, -4px 0;
  }



  /* ─── превью ───────────────────────────────── */
  .opacity-card__preview {
    grid-area: 1 / 1;
    display: flex;
    border-radius: var(--radius);
    box-shadow: var(--shadow-sm);
    overflow: hidden;
  }

  /* ─── демо-слой: клетка + цвет с alpha ─────── */
  .opacity-card__demo {
    position: relative;
    flex: 1;
    flex-direction: column;
    justify-content: space-between;
    gap: calc(var(--space) / 2);
    background: linear-gradient(45deg, 
      hsl(from var(--surface) h s l / min(max(0.2, var(--alpha)), 0.7)) 50%, 
      hsl(from var(--surface-hover) h s l / min(max(0.4, calc(var(--alpha) * 0.8)), 0.9)) 50%);
    min-height: 0;
    overflow: hidden;
  }
  
  /* Контейнер для текста поверх демо-слоя */
  .opacity-card__labels {
    position: absolute;
    inset: 0; /* Растягиваем на весь блок */
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-size: 0.7rem; /* Мелкий шрифт, чтобы не орал */
    font-weight: 600;
    color: var(--text);
    text-shadow: var(--shadow-sm);
    white-space: nowrap;
    transform: rotate(45deg); /* Поворот по часовой */
  }

  .opacity-card__labels span {
    padding: var(--space-sm);
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
    border-radius: calc(var(--radius) / 2);
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
    transform: translate(-50%, -50%) rotate(90deg);
  }
</style>