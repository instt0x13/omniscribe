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