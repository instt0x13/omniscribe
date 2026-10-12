<script lang="ts">
  import { GhostButton, Icon } from "$ui";

  import Modal from "./Modal.svelte";

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
  {#snippet top()}
    <div class="confirm-buttons">
      <GhostButton label="Согласиться" onclick={onconfirm}>
        <Icon name="check" />
      </GhostButton>
      <GhostButton label="Отказаться" onclick={oncancel}>
        <Icon name="chevronRight" />
      </GhostButton>
    </div>
  {/snippet}
</Modal>

<style>
  .confirm-buttons {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
    gap: var(--space);
  }
</style>