<script lang="ts" generics="T">
  import type { Snippet } from "svelte";

  type Props = {
    items: T[];
    active: T | null;
    /** стабильный ключ элемента — для {#each ... (key)} */
    getKey: (item: T) => string | number;
    /** клик по элементу */
    onselect: (item: T) => void;
    /** как рисовать содержимое элемента — решает родитель */
    item: Snippet<[T]>;
    /** направление списка */
    direction?: "horizontal" | "vertical";
  };

  let {
    items,
    active,
    getKey,
    onselect,
    item,
    direction = "horizontal"
  }: Props = $props();
</script>

{#if items.length > 0}
  <div
    class="list"
    class:list--horizontal={direction === "horizontal"}
    class:list--vertical={direction === "vertical"}
    role="tablist"
  >
    <ul class="list-body">
      {#each items as entry (getKey(entry))}
        <li>
          <div
            class="list-item"
            class:active={active === entry}
            role="tab"
            tabindex="0"
            aria-selected={active === entry}
            onclick={() => onselect?.(entry)}
            onkeydown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onselect?.(entry);
              }
            }}
          >
            {@render item(entry)}
          </div>
        </li>
      {/each}
    </ul>
  </div>
{/if}

<style>
  /* ===== Общий контейнер ===== */
  .list-body {
    list-style: none;
    margin: 0;
    padding: 0.25rem;
    display: flex;
    gap: 0.25rem;
  }

  /* ===== Единый стиль кнопки для обоих вариантов ===== */
  .list-item {
    width: 100%;
    text-align: left;
    padding: 0.1rem 0.3rem;
    border: 1px solid transparent;
    border-radius: var(--radius);
    background: transparent;
    color: inherit;
    cursor: pointer;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    &.active {
      color: var(--backdrop-text);
      background: var(--primary);
    }
    &:hover {
      color: var(--muted);
      background: var(--border);
    }
    &:focus-visible {
      outline: 2px solid var(--primary);
      outline-offset: 2px;
    }
  }

  /* ===== Горизонтальный режим ===== */
  .list--horizontal {
    display: inline-flex;
  }

  .list--horizontal .list-body {
    flex-direction: row;
  }

  /* ===== Вертикальный режим ===== */
  .list--vertical {
    overflow-y: auto;
  }

  .list--vertical .list-body {
    flex-direction: column;
  }
</style>