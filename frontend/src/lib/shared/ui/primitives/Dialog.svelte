<script lang="ts">
  import type { Snippet } from "svelte";

  interface Props {
    open: boolean;
    onrequestclose: () => void;   // «пользователь хочет закрыть»
    children?: Snippet;
  }
  let { open, onrequestclose, children }: Props = $props();

  let dialogEl = $state<HTMLDialogElement | null>(null);

  $effect(() => {
    if (!dialogEl) return;
    if (open && !dialogEl.open) dialogEl.showModal();
    if (!open && dialogEl.open) dialogEl.close();
  });

  function handleBackdropClick(e: MouseEvent) {
    if (e.target === dialogEl) onrequestclose();
  }
</script>

<dialog
  bind:this={dialogEl}
  onclick={handleBackdropClick}
  oncancel={(e) => { e.preventDefault(); onrequestclose(); }}
  onclose={onrequestclose}
>
  <div class="modal-wrapper">
    <button class="close-btn" onclick={onrequestclose} aria-label="Закрыть">✕</button>
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
    display: inline-block;
  }

  .close-btn {
    position: absolute;
    top: -3rem;
    right: 0;
    width: 2rem;
    height: 2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    background: transparent;
    border: none;
    color: white;
    font-size: 1.25rem;
    line-height: 1;
    user-select: none;
    cursor: pointer;
    border-radius: 50%;
    &:hover {
      background: rgba(255, 255, 255, 0.25);
    }
  }

  .modal-content {
    background: var(--panel);
    padding: 1.5rem;
    border-radius: var(--radius);
    width: min(calc(100vw - 2rem), 650px);
    max-height: 85vh;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    overflow-y: auto;
  }
</style>
