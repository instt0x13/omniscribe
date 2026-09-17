<script lang="ts">
  import { Modal, Icon, IconButton } from "$lib/shared/ui";
  import { NoteEditorSession } from "../classes/NoteEditorSession.svelte";
  import NoteCard from "./NoteCard.svelte";

  interface Props {
    session: NoteEditorSession,
    onclose: () => void,
    onsave?: () => void,
    oncancel?: () => void
  }
  let { session, onclose, onsave, oncancel }: Props = $props();

  
  function handleCopy() {
    navigator.clipboard.writeText(session.entity.content)
      .then(() => alert("Скопировано! 🎉"));
  }
  
  async function handleSave() {
    const ok = await session.save();
    if (ok) onsave?.();
  }

  function handleCancel() {
    session.cancel();
    oncancel?.();
  }
</script>

<Modal onrequestclose={onclose}>
  <NoteCard session={session} onsave={onsave} />
  {#snippet top()}
      <div class="button-group">
        {#if session.isInEditMode}
          {#if session.isDirty && session.isValid}
          <IconButton label="Сохранить" onclick={handleSave}>
            <Icon name="check" />
          </IconButton>
          {/if}
          {#if session.isDirty}
            <IconButton label="Отмена" onclick={handleCancel}>
              Отмена
            </IconButton>
          {:else if session.entity.isNew}
            <IconButton label="Выйти" onclick={onclose}>
              <Icon name="close" />
            </IconButton>
          {:else}
            <IconButton label="Назад" onclick={() => (session.isManuallyEditing = false)}>
              <Icon name="chevronRight" />
            </IconButton>
          {/if}
        {:else}
          <IconButton label="Редактировать" onclick={() => (session.isManuallyEditing = true)}>
            <Icon name="edit"/>
          </IconButton>
          <IconButton label="Выйти" onclick={onclose}>
            <Icon name="close" />
          </IconButton>
        {/if}
      </div>
  {/snippet}
</Modal>

<style>
  .button-group {
    margin-left: auto;
  }
</style>