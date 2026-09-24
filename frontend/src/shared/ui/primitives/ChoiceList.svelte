<script lang="ts" generics="T, K extends PropertyKey">
  import type { Snippet } from "svelte";

  type Props = {
    direction: "horizontal" | "vertical";
    items: Record<K, T>;
    active: K | null;
    /** клик по вкладке */
    onselect: (key: K) => void;
    /** как рисовать содержимое вкладки — решает родитель */
    item: Snippet<[T, K]>;
  };

  let { direction, items, active, onselect, item }: Props = $props();
</script>

{#if Object.keys(items).length !== 0}
  <div
    class="list"
    class:list--horizontal={direction === "horizontal"}
    class:list--vertical={direction === "vertical"}
    role="tablist"
  >
    <ul class="list-body">
      {#each Object.entries(items) as [key, value]}
      {@const typedKey = key as K}
        <li>
          <div
            class="list-item"
            class:active={active === typedKey}
            role="tab"
            tabindex="0"
            aria-selected={active === typedKey}
            onclick={() => onselect(typedKey)}
            onkeydown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onselect(typedKey);
              }
            }}
          >
            {@render item(value as T, typedKey)}
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