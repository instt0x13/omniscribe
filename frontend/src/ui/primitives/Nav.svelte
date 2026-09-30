<script lang="ts">
  import type { Snippet } from "svelte";

  type Props = {
    direction: "horizontal" | "vertical";
    /** Массив представлений. Порядок = порядок отображения. */
    items: readonly any[];
    /** Имя поля с ключем/id/name */
    key: string;
    /** id активного элемента. */
    active: string | null;
    /** Клик по элементу. */
    onselect: (key: string) => void;
    /** Как рисовать содержимое элемента. */
    item: Snippet<[any]>;
  };

  let { direction, items, key, active, onselect, item }: Props = $props();
</script>

{#if items.length !== 0}
  <nav
    class="nav"
    class:nav--horizontal={direction === "horizontal"}
    class:nav--vertical={direction === "vertical"}
  >
    <ul class="nav-list">
      {#each items as item (item[key])}
        {@const isActive = active === item[key]}
        <li>
          <button
            type="button"
            class="nav-item"
            class:active={isActive}
            aria-current={isActive ? "page" : undefined}
            onclick={() => onselect(item[key])}
          >
            {@render item(item)}
          </button>
        </li>
      {/each}
    </ul>
  </nav>
{/if}

<style>
  .nav-list {
    list-style: none;
    margin: 0;
    padding: 0.25rem;
    display: flex;
    gap: 0.25rem;
  }

  .nav--horizontal .nav-list { flex-direction: row; }
  .nav--vertical   .nav-list { flex-direction: column; }

  .nav-item {
    display: flex;
    align-items: center;
    width: 100%;
    padding: 0.1rem 0.3rem;
    border: 1px solid transparent;
    border-radius: var(--radius);
    background: transparent;
    color: inherit;
    font: inherit;
    text-align: left;
    cursor: pointer;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .nav-item:hover {
    color: var(--muted);
    background: var(--border);
  }

  .nav-item.active {
    color: var(--backdrop-text);
    background: var(--primary);
  }

  .nav-item:focus-visible {
    outline: 2px solid var(--primary);
    outline-offset: 2px;
  }
</style>