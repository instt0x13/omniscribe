<script lang="ts">
  import type { Snippet } from "svelte";

  interface Props {
    onclose: () => void;
    children?: Snippet;
  }

  let { onclose, children }: Props = $props();
</script>

<div class="modal-overlay" onclick={onclose} role="presentation">
  <div class="modal-content" onclick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
    {@render children?.()}
  </div>
</div>

<style>
  .modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.4);
    display: grid;
    place-items: center;
    z-index: 100;
  }

  .modal-content {
    background: var(--panel);
    padding: 1.5rem;
    border-radius: var(--radius);
    width: min(100% - 2rem, 650px);
    max-height: 85vh;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
</style>
