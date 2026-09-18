<script lang="ts">
  import type { Snippet } from "svelte";

  interface Props {
    left?: Snippet;
    center?: Snippet;
    right?: Snippet;
  }

  let { left, center, right }: Props = $props();
</script>

<header class="app-header">
  <div class="header-section left">
    {@render left?.()}
  </div>

  <div class="header-section center">
    {@render center?.()}
  </div>

  <div class="header-section right">
    {@render right?.()}
  </div>
</header>

<style>
  .app-header {
    position: sticky;
    top: 0;
    z-index: 100;
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding: 0.75rem 1.5rem;
    background: var(--panel);
    border-bottom: 1px solid var(--border);
    backdrop-filter: blur(8px);
  }

  .header-section {
    display: flex;
    align-items: center;
    flex: 1;

    &.left {
      justify-content: flex-start;
    }

    &.center {
      justify-content: center;
    }

    &.right {
      justify-content: flex-right;
      justify-content: flex-end;
    }
  }
</style>