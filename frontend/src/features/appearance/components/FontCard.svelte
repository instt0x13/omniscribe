<script lang="ts">
  import { theme } from "$services";

  const fontSize   = theme.fontSize;
  const fontFamily = theme.fontFamily;

  // Локальное состояние для "призрачного" размера во время перетаскивания
  let previewSize = $state(fontSize.value);

  // Синхронизируем локальный стейт, если тема изменилась извне (например, сбросили настройки)
  $effect(() => {
    previewSize = fontSize.value;
  });

  // Обработчик движения ползунка (только визуал)
  const handleInput = (e: Event) => {
    const target = e.target as HTMLInputElement;
    previewSize = Number(target.value);
  };

  // Обработчик отпускания ползунка (применение к теме)
  const handleChange = (e: Event) => {
    const target = e.target as HTMLInputElement;
    fontSize.value = Number(target.value);
  };
</script>

<div class="font-card">
  <!-- превью -->
  <div class="font-card__preview" style:font-family={fontFamily.css}>
    <div class="font-card__demo">
      <!-- Используем previewSize вместо fontSize.css -->
      <span class="font-card__example" style:font-size={`${previewSize}${fontSize.meta.unit}`}>
        Aa<span class="font-card__scaled" style:font-size={`${previewSize}${fontSize.meta.unit}`}>Aa</span>
      </span>
    </div>
    <span class="font-card__values">
      {previewSize}<span class="font-card__unit">{fontSize.meta.unit}</span>
    </span>
  </div>

  <!-- вертикальный ползунок на всю правую колонку -->
  <div class="font-card__slider">
    <span class="font-card__label-min">a</span>
    
    <input
      class="font-card__range"
      type="range"
      min={fontSize.meta.min}
      max={fontSize.meta.max}
      step={fontSize.meta.step}
      value={previewSize} 
      oninput={handleInput}
      onchange={handleChange}
      aria-label="Размер шрифта"
    />
    
    <span class="font-card__label-max">A</span>
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
      onclick={() => fontSize.value -= fontSize.meta.step}
      aria-label="Уменьшить"
    >−</button>

    <button
      type="button"
      class="font-card__btn"
      onclick={() => fontSize.value += fontSize.meta.step}
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

  .font-card__demo {
    display: flex;
    flex-grow: 1;
    flex-direction: column;
    justify-content: center;
  }

  .font-card__example {
    position: relative;
    line-height: 1;
    font-weight: 600;
    transition: font-size 0.06s linear;
  }

  .font-card__scaled {
    position: absolute;
    transform: scale(5);
    opacity: 0.15;
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
    border-radius: var(--radius-sm);
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

  .font-card__range::-webkit-slider-thumb {
    -webkit-appearance: none;
    box-sizing: border-box;
    width: var(--bar);
    height: var(--bar);
    border-radius: 50%;
    background: var(--text);
    border: 2px solid var(--border);
    box-shadow: var(--shadow-sm);
  }
  .font-card__range::-moz-range-thumb {
    box-sizing: border-box;
    width: var(--bar);
    height: var(--bar);
    border-radius: 50%;
    background: var(--text);
    border: 2px solid var(--border);
    box-shadow: var(--shadow-sm);
  }
  
  /* ─── Метки размера шрифта ─────────────────────── */
  .font-card__label-min,
  .font-card__label-max {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    font-weight: 600;
    color: var(--text-subtle);
    pointer-events: none; /* Чтобы не перекрывали клик по треку */
    opacity: 0.7;
  }

  .font-card__label-min {
    bottom: 0;
    font-size: 0.55rem;
  }

  .font-card__label-max {
    top: 0;
    font-size: 0.85rem;
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
    border-radius: var(--radius-sm);
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
    border-radius: var(--radius-sm);
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