<script lang="ts">
  import { Button } from "$lib/shared/ui";

  import { default as Dialog } from "../primitives/Dialog.svelte";

  interface Props {
    content?: String;
    onconfirm: () => void;
    oncancel: () => void;
  }

  let { content, onconfirm, oncancel }: Props = $props();
</script>

<Dialog open={true} onrequestclose={oncancel}>
  <div class="confirm-dialog">
    <p>{content}</p>
    <div class="button-group">
      <Button variant="primary" onclick={onconfirm}>
        Да
      </Button>
      <Button variant="secondary" onclick={oncancel}>
        Нет
      </Button>
    </div>
  </div>
</Dialog>