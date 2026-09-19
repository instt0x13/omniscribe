<script lang="ts" generics="T">
  import type { Snippet } from "svelte";

  type Props = {
    items: T[];
    active: T | null;
    /** стабильный ключ элемента — для {#each ... (key)} */
    getKey: (item: T) => string | number;
    /** клик по вкладке */
    onselect: (item: T) => void;
    /** как рисовать содержимое вкладки — решает родитель */
    tab: Snippet<[T]>;
  };

  let { items, active, getKey, onselect, tab }: Props = $props();
</script>

<div class="tabs-header" role="tablist">
  {#each items as item (getKey(item))}
    <div
      class="tab"
      class:active={active === item}
      role="tab"
      tabindex="0"
      aria-selected={active === item}
      onclick={() => onselect(item)}
      onkeydown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onselect(item);
        }
      }}
    >
      {@render tab(item)}
    </div>
  {/each}
</div>

<style>
  .tabs-header {
    display: inline-flex;
    background: var(--panel);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 0.25rem;
    gap: 0.25rem;
  }

  .tab {
    display: flex;
    align-items: center;
    background: transparent;
    color: var(--text);
    padding: 0.25rem;
    font-size: 0.875rem;
    border-radius: calc(var(--radius) - 2px);
    &.active {
      background: var(--primary);
      color: #ffffff;
    }
    &:hover {
      background: color-mix(in srgb, var(--primary) 30%, transparent);
      color: var(--text);
    }
    &:focus-visible {
      outline: 2px solid var(--primary);
      outline-offset: 2px;
    }
  }


</style>