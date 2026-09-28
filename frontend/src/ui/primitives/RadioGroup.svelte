<script lang="ts" generics="K extends PropertyKey, T">
  import type { Snippet } from "svelte";

  type Props = {
    direction: "horizontal" | "vertical";
    items: Map<K, T> | Record<K, T>;
    active: K | null;
    onselect: (key: K) => void;
    /** Snippet получает значение и ключ — как в твоём ChoiceList. */
    item: Snippet<[T, K]>;
    /** Имя группы для нативного radio. Опционально. */
    name?: string;
  };

  let {
    direction,
    items,
    active,
    onselect,
    item,
    name = crypto.randomUUID(),
  }: Props = $props();

  // Один раз конвертируем в [K, T][] — {#each} работает с массивами,
  // а Map/Record — нет.
  let entries = $derived(
    items instanceof Map
      ? ([...items.entries()] as [K, T][])
      : (Object.entries(items) as [K, T][])
  );
</script>

{#if entries.length !== 0}
  <div
    class="radio-group"
    class:radio-group--horizontal={direction === "horizontal"}
    class:radio-group--vertical={direction === "vertical"}
    role="radiogroup"
  >
    {#each entries as [key, value] (key)}
      <label class="radio-option">
        <input
          type="radio"
          {name}
          value={String(key)}
          checked={active === key}
          onchange={() => onselect(key)}
        />
        <span class="radio-visual">
          {@render item(value, key)}
        </span>
      </label>
    {/each}
  </div>
{/if}

<style>
  .radio-group {
    display: flex;
    gap: 0.25rem;
    padding: 0.25rem;
  }

  .radio-group--horizontal {
    flex-direction: row;
  }

  .radio-group--vertical {
    flex-direction: column;
  }

  .radio-option {
    position: relative;
    display: inline-flex;
    cursor: pointer;
    border-radius: var(--radius);
  }

  /* Скрываем нативный input, но оставляем его фокусируемым.
     opacity:0, а не display:none — иначе клавиатура сломается. */
  .radio-option input {
    position: absolute;
    opacity: 0;
    pointer-events: none;
    width: 1px;
    height: 1px;
  }

  .radio-visual {
    display: flex;
    align-items: center;
    width: 100%;
    padding: 0.1rem 0.3rem;
    border: 1px solid transparent;
    border-radius: var(--radius);
    transition: background 0.12s, color 0.12s;
  }

  .radio-option:hover .radio-visual {
    color: var(--muted);
    background: var(--border);
  }

  /* Активный — нативный :checked + селектор */
  .radio-option input:checked + .radio-visual {
    color: var(--backdrop-text);
    background: var(--primary);
  }

  /* Фокус — визуально показываем, но через :focus-visible,
     чтобы не мигало при клике мышью */
  .radio-option input:focus-visible + .radio-visual {
    outline: 2px solid var(--primary);
    outline-offset: 2px;
  }
</style>