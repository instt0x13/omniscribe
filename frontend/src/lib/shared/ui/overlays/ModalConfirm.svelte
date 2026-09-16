<script lang="ts">
  import { Button } from "$lib/shared/ui";

  import { default as Modal } from "./Modal.svelte";

  interface Props {
    message?: String;
    onconfirm: () => void;
    oncancel: () => void;
  }

  let { message, onconfirm, oncancel }: Props = $props();
</script>

<Modal onrequestclose={oncancel}>
  <div class="confirm-dialog">
    <p>{message}</p>
  </div>
    {#snippet bottom()}
      <div class="button-group">
        <Button variant="primary" onclick={onconfirm}>
          Да
        </Button>
        <Button variant="secondary" onclick={oncancel}>
          Нет
        </Button>
      </div>
    {/snippet}
</Modal>