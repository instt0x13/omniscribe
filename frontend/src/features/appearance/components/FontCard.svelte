<script lang="ts">
  import { theme } from "$services";

  const fontSize   = theme.fontSize;
  const fontFamily = theme.fontFamily;

  function nudge(delta: number) {
    const { min, max } = fontSize.meta;
    const next = fontSize.value + delta;
    fontSize.value = Math.round(Math.min(max, Math.max(min, next)) * 100) / 100;
  }
</script>

<div class="font-card">
  <!-- превью -->
  <div class="font-card__preview" style:font-family={fontFamily.css}>
    <span class="font-card__title">Шрифт</span>
    <span class="font-card__example" style:font-size={fontSize.css}>Aa</span>
    <span class="font-card__values">
      {fontSize.value}<span class="font-card__unit">{fontSize.meta.unit}</span>
    </span>
  </div>

  <!-- вертикальный ползунок на всю правую колонку -->
  <div class="font-card__slider">
    <input
      class="font-card__range"
      type="range"
      min={fontSize.meta.min}
      max={fontSize.meta.max}
      step={fontSize.meta.step}
      bind:value={fontSize.value}
      aria-label="Размер шрифта"
    />
  </div>

  <!-- нижняя строка: select + [−] [+] -->
  <div class="font-card__bottom">
    <div class="font-card__select-wrap">
      <select
        class="font-card__select"
        bind:value={fontFamily.value}
        aria-label="Семейство шрифта"
      >
        {#each fontFamily.options as family (family)}
          <option value={family}>{family}</option>
        {/each}
      </select>
    </div>

    <button
      type="button"
      class="font-card__btn"
      onclick={() => nudge(-fontSize.meta.step)}
      aria-label="Уменьшить"
    >−</button>

    <button
      type="button"
      class="font-card__btn"
      onclick={() => nudge(fontSize.meta.step)}
      aria-label="Увеличить"
    >+</button>
  </div>
</div>

<style>
  /* ─── Сетка карточки ─────────────────────────────── */
  .font-card {
    display: grid;
    grid-template-columns: var(--size) var(--bar);
    grid-template-rows: var(--size) var(--bar);
    gap: var(--gap);
  }

  /* ─── Превью ─────────────────────────────────────── */
  .font-card__preview {
    grid-area: 1 / 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: var(--space);
    overflow: hidden;
    background: var(--surface);
    border-radius: var(--radius);
    box-shadow: var(--shadow-sm);
  }

  .font-card__title {
    font-size: 1rem;
    font-weight: 600;
  }

  .font-card__example {
    line-height: 1;
    font-weight: 600;
    transition: font-size 0.06s linear;
  }

  .font-card__values {
    font-size: 0.85rem;
    font-variant-numeric: tabular-nums;
    opacity: 0.85;
  }

  .font-card__unit {
    margin-left: 0.1rem;
    font-size: 0.75rem;
    opacity: 0.6;
  }

  /* ─── Вертикальный ползунок (вся правая колонка) ─── */
  .font-card__slider {
    grid-area: 1 / 2;
    position: relative;
  }

  .font-card__slider::before {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(to top, var(--surface), var(--surface-hover));
    border-radius: calc(var(--radius) / 2);
    pointer-events: none;
  }

  .font-card__range {
    position: absolute;
    top: 50%;
    left: 50%;
    width: var(--size);   /* после rotate(-90deg) — это визуальная высота */
    height: var(--bar);   /* после rotate(-90deg) — это визуальная ширина */
    transform: translate(-50%, -50%) rotate(-90deg);
    margin: 0;
    padding: 0;
    border: none;
    background: transparent;
    box-shadow: none;
    cursor: pointer;
    -webkit-appearance: none;
    appearance: none;
  }

  .font-card__range::-webkit-slider-runnable-track,
  .font-card__range::-moz-range-track {
    height: 100%;
    background: transparent;
    border: none;
  }

  .font-card__range::-webkit-slider-thumb,
  .font-card__range::-moz-range-thumb {
    box-sizing: border-box;
    width: var(--bar);
    height: var(--bar);
    border: 2px solid var(--border);
    border-radius: 50%;
    background: var(--text);
    box-shadow: var(--shadow-sm);
    -webkit-appearance: none;
    appearance: none;
  }

  /* ─── Нижняя строка: select + [−] [+] ────────────── */
  .font-card__bottom {
    grid-area: 2 / 1;
    display: flex;
    gap: 2px;
    height: var(--bar);
  }

  .font-card__select-wrap {
    position: relative;
    flex: 1 1 auto;
    min-width: 0;
    height: 100%;
  }

  .font-card__select-wrap::after {
    content: "▾";
    position: absolute;
    top: 50%;
    right: 0.3rem;
    transform: translateY(-50%);
    font-size: 0.5rem;
    opacity: 0.6;
    pointer-events: none;
  }

  .font-card__select {
    width: 100%;
    height: 100%;
    padding: 0 0.9rem 0 0.35rem;
    border: none;
    border-radius: calc(var(--radius) / 2);
    background: var(--surface);
    color: var(--text);
    box-shadow: var(--shadow-sm);
    font: inherit;
    font-size: 0.7rem;
    line-height: 1;
    cursor: pointer;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    -webkit-appearance: none;
    appearance: none;
  }

  .font-card__select:hover {
    background: var(--surface-hover);
  }

  .font-card__btn {
    flex: 0 0 var(--bar);
    height: 100%;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    border: none;
    border-radius: calc(var(--radius) / 2);
    background: var(--surface);
    color: var(--text);
    box-shadow: var(--shadow-sm);
    font-size: 0.75rem;
    font-weight: 700;
    line-height: 1;
    cursor: pointer;
    transition: background-color 0.15s, color 0.15s;
  }

  .font-card__btn:hover {
    background: var(--surface-hover);
  }
</style>