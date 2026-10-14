<script lang="ts">
  import type { Snippet } from "svelte";

  interface Props {
    leading: Snippet;
    collapsed?: boolean;
    active?: boolean;
    reverse?: boolean;
    hoverable?: boolean;
    children?: Snippet;
  }

  let {
    leading,
    children,
    collapsed = false,
    active = false,
    reverse = false,
    hoverable = false
  }: Props = $props();
</script>

<span class="item" class:active class:reverse class:hoverable>
  <span class="leading" class:collapsed>{@render leading()}</span>
  <span class="content" class:collapsed>{@render children?.()}</span>
</span>

<style>
  .item {
    display: flex;
    width: 100%;
    flex-direction: row;
    flex-wrap: nowrap;
    align-items: center;
    gap: var(--space);
    border-radius: var(--radius);
    container-type: inline-size;
  }
  .item.reverse {
    flex-direction: row-reverse;
  }
  .item.hoverable {
    padding: var(--space);
  }
  .item.hoverable:hover {
    background-color: var(--surface-hover);
  }
  .item.active {
    background-color: var(--primary-active);
    color: var(--primary-text);
  }
  .item.hoverable.active:hover {
    background-color: var(--primary-hover);
  }

  .leading {
    font-size: calc(var(--font-size) * 1.3);
  }
  .leading.collapsed {
    flex: 1;
    aspect-ratio: 1 / 1;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 75cqw;
    line-height: 1;
  }

  .content {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .content.collapsed {
    display: none;
  }
</style>