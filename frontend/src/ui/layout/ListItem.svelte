<script lang="ts">
  import type { Snippet } from "svelte";

  type Props = {
    active?: boolean;
    children?: Snippet;
  };

  let { active = false, children }: Props = $props();
</script>

<li class="list-item" class:active>
  {@render children?.()}
</li>

<style>
  .list-item {
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
    text-decoration: none;
    cursor: pointer;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .list-item:hover {
    color: var(--muted);
    background: var(--border);
  }

  .list-item.active {
    color: var(--backdrop-text);
    background: var(--primary);
  }

  .list-item:focus-visible {
    outline: 2px solid var(--primary);
    outline-offset: 2px;
  }
</style>