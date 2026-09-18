<script lang="ts">
  import type { Snippet } from "svelte";

  interface Props {
    onrequestclose: () => void;
    children?: Snippet;
    top?: Snippet;
    bottom?: Snippet;
    left?: Snippet;
    right?: Snippet;
  }

  let { onrequestclose, children, top, bottom, left, right }: Props = $props();

  function setupDialog(node: HTMLDialogElement) {
    node.showModal();
  }
</script>

<dialog
  use:setupDialog
  onkeydown={(e) => {
    if (e.key === "Escape") {
      e.preventDefault();
      e.stopPropagation();
      onrequestclose();
    }
  }}
  onclick={(e) => {
    if (e.target === e.currentTarget) {
      onrequestclose();
    }
  }}
>
  <div class="modal-wrapper">
    {#if top}<div class="modal-zone zone-top">{@render top()}</div>{/if}
    {#if bottom}<div class="modal-zone zone-bottom">{@render bottom()}</div>{/if}
    {#if left}<div class="modal-zone zone-left">{@render left()}</div>{/if}
    {#if right}<div class="modal-zone zone-right">{@render right()}</div>{/if}

    <div class="modal-content">
      {@render children?.()}
    </div>
  </div>
</dialog>

<style>
  dialog {
    background: transparent;
    border: none;
    padding: 0;
    overflow: visible;
    max-width: none;
    max-height: none;
  }

  dialog::backdrop {
    background: rgba(0, 0, 0, 0.7);
    backdrop-filter: blur(4px);
  }

  .modal-wrapper {
    position: relative;
    display: inline-flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  /* Базовые стили для внешних зон */
  .modal-zone {
    color: var(--backdrop-text);
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  /* Позиционирование по сторонам */
  .zone-top {
    bottom: calc(100% + 0.75rem);
    left: 0;
    right: 0;
  }

  .zone-bottom {
    top: calc(100% + 0.75rem);
    left: 0;
    right: 0;
  }

  .zone-left {
    right: calc(100% + 0.75rem);
    top: 0;
    bottom: 0;
  }

  .zone-right {
    left: calc(100% + 0.75rem);
    top: 0;
    bottom: 0;
  }

  .modal-content {
    background: var(--panel);
    padding: 1.5rem;
    border-radius: var(--radius);
    width: max-content;
    max-height: 85vh;
    max-width: 68vw;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    overflow-y: auto;
  }
</style>