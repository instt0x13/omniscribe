<script lang="ts">
  import { GhostButton, Icon, SplitRow } from "$shared/ui";

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
    {#snippet top()}
      <SplitRow>
      {#snippet right()}
        <GhostButton label="Согласиться" onclick={onconfirm}>
          <Icon name="check" />
        </GhostButton>
        <GhostButton label="Отказаться" onclick={oncancel}>
          <Icon name="chevronRight" />
        </GhostButton>
      {/snippet}
      </SplitRow>
    {/snippet}
</Modal>