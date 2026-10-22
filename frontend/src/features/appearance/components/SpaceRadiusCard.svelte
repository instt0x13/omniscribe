<script lang="ts">
  import { theme } from "$services";

  const space  = theme.space;  // px
  const radius = theme.radius; // px

  // Локальное состояние для "призрачного" размера во время перетаскивания
  let previewSpace = $state(space.value);

  // Синхронизируем локальный стейт, если тема изменилась извне
  $effect(() => {
    previewSpace = space.value;
  });

  // Обработчик движения ползунка (только визуал)
  const handleInput = (e: Event) => {
    const target = e.target as HTMLInputElement;
    previewSpace = Number(target.value);
  };

  // Обработчик отпускания ползунка (применение к теме)
  const handleChange = (e: Event) => {
    const target = e.target as HTMLInputElement;
    space.value = Number(target.value);
  };
</script>

<div class="space-card" style="--preview-space: {previewSpace}{space.meta.unit}">
  <!-- превью -->
  <div class="space-card__preview">
    <span class="space-card__value">
      {previewSpace}<span class="space-card__unit">{space.meta.unit}</span>
    </span>

    <div class="space-card__demo">
      <span class="space-card__value">
        {radius.value}<span class="space-card__unit">{radius.meta.unit}</span>
      </span>
    </div>
  </div>

  <!-- отступ: вертикальный ползунок справа -->
  <div class="space-card__vertical">
    <button
      type="button"
      class="space-card__btn space-card__btn-top"
      onclick={() => space.value += space.meta.step}
      aria-label="Увеличить отступ"
    >+</button>

    <input
      class="space-card__range"
      type="range"
      min={space.meta.min}
      max={space.meta.max}
      step={space.meta.step}
      value={previewSpace} 
      oninput={handleInput}
      onchange={handleChange}
      aria-label="Отступ"
    />

    <button
      type="button"
      class="space-card__btn space-card__btn-bottom"
      onclick={() => space.value -= space.meta.step}
      aria-label="Уменьшить отступ"
    >−</button>
  </div>

  <!-- округление: горизонтальный ползунок снизу -->
  <div class="space-card__horizontal">
    <button
      type="button"
      class="space-card__btn space-card__btn-left"
      onclick={() => radius.value -= radius.meta.step}
      aria-label="Уменьшить округление"
    >−</button>

    <input
      class="space-card__range"
      type="range"
      min={radius.meta.min}
      max={radius.meta.max}
      step={radius.meta.step}
      bind:value={radius.value}
      aria-label="Округление"
    />

    <button
      type="button"
      class="space-card__btn space-card__btn-right"
      onclick={() => radius.value += radius.meta.step}
      aria-label="Увеличить округление"
    >+</button>
  </div>
</div>

<style>
  .space-card {
    display: grid;
    grid-template-columns: var(--size) var(--bar);
    grid-template-rows: var(--size) var(--bar);
    gap: var(--gap);
  }

  /* ─── превью ───────────────────────────────── */
  .space-card__preview {
    position: relative;
    grid-area: 1 / 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: end;
    gap: 0.1rem;
    padding-top: calc(var(--preview-space) * 1.5);
    padding-left: calc(var(--preview-space) * 0.5);
    padding-bottom: var(--preview-space);
    border-radius: var(--radius);
    background: var(--surface);
    box-shadow: var(--shadow-sm);
    overflow: hidden;
    transition: padding 0.06s linear, border-radius 0.06s linear;
  }

  .space-card__value {
    display: flex;
    gap: 0.2rem;
    font-size: 1rem;
    font-variant-numeric: tabular-nums;
    opacity: 0.85;
    padding-right: 0.5rem;
  }

  .space-card__unit {
    margin-left: 0.1rem;
    font-size: 0.8rem;
    opacity: 0.6;
  }

  /* ─── демо-блок ─ */
  .space-card__demo {
    flex-grow: 1;
    width: 100%;
    min-width: 0;
    min-height: 0;
    display: flex;
    overflow: hidden;
    justify-content: end;
    border-radius: var(--radius) 0 0 var(--radius);
    background: var(--surface-hover);
    color: var(--text);
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
    background: transparent;
    cursor: pointer;
    z-index: 1; /* Чтобы ползунок был поверх фона, но под кнопками если что */
  }

  .space-card__range::-webkit-slider-runnable-track,
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

  /* ─── Кнопки ───────────────────────────────── */
  .space-card__btn {
    position: absolute;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: none;
    border-radius: calc(var(--radius) / 2);
    color: var(--text);
    box-shadow: var(--shadow-sm);
    font-size: 0.75rem;
    font-weight: 700;
    line-height: 1;
    cursor: pointer;
    transition: background-color 0.15s, color 0.15s;
    z-index: 2;
    width: var(--bar);
    height: var(--bar);
  }

  /* ─── горизонтальный (Радиус) ─────────────── */
  .space-card__horizontal {
    position: relative;
    grid-area: 2 / 1;
    width: var(--size);
    height: var(--bar);
    border-radius: var(--radius-sm);
    background: linear-gradient(to right, var(--surface), var(--surface-hover));
    box-shadow: var(--shadow-sm);
  }

  .space-card__horizontal .space-card__range {
    position: absolute;
    width: calc(var(--size) * 0.7);
    height: var(--bar);
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  .space-card__btn-left {
    left: 0;
    top: 50%;
    transform: translateY(-50%);
  }

  .space-card__btn-right {
    right: 0;
    top: 50%;
    transform: translateY(-50%);
  }

  /* ─── вертикальный (Отступ) ───────────────── */
  .space-card__vertical {
    position: relative;
    grid-area: 1 / 2;
    width: var(--bar);
    height: var(--size);
    border-radius: var(--radius-sm);
    background: linear-gradient(to top, var(--surface), var(--surface-hover));
    box-shadow: var(--shadow-sm);
  }

  .space-card__vertical .space-card__range {
    position: absolute;
    top: 50%;
    left: 50%;
    width: calc(var(--size) * 0.7);
    height: var(--bar);
    transform: translate(-50%, -50%) rotate(-90deg);
  }

  .space-card__btn-top {
    top: 0;
    left: 50%;
    transform: translateX(-50%);
  }

  .space-card__btn-bottom {
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
  }
</style>