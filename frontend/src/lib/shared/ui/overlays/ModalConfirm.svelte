<script lang="ts">
  import { Button } from "$lib/shared/ui";
  import Icon from "../primitives/Icon.svelte";
  import IconButton from "../primitives/GhostButton.svelte";

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
      <div class="button-group">
        <IconButton label="Согласиться" onclick={onconfirm}>
          <Icon name="check" />
        </IconButton>
        <IconButton label="Отказаться" onclick={oncancel}>
          <Icon name="arrowRight" />
        </IconButton>
      </div>
    {/snippet}
</Modal>

<style>
  .button-group {
    margin-left: auto;
  }
</style>