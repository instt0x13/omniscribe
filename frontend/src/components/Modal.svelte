<script lang="ts">
  import type { Snippet } from "svelte";

  interface Props {
    onclose: () => void;
    children?: Snippet;
  }

  let { onclose, children }: Props = $props();
  let dialogEl = $state<HTMLDialogElement | null>(null);

  // Автоматически открываем dialog при монтировании компонента
  $effect(() => {
    dialogEl?.showModal();
  });

  // Закрытие по клику на фон (::backdrop)
  function handleBackdropClick(e: MouseEvent) {
    if (e.target === dialogEl) {
      onclose();
    }
  }
</script>

<dialog 
  bind:this={dialogEl} 
  onclick={handleBackdropClick}
  onclose={onclose}
>
  <div class="modal-content">
    {@render children?.()}
  </div>
</dialog>

<style>
  .modal-content {
    background: var(--panel);
    padding: 1.5rem;
    border-radius: var(--radius);
    width: min(calc(100vw - 2rem), 650px);
    max-height: 85vh;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
</style>