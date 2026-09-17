<script lang="ts">
  import { Modal, Icon, GhostButton, SplitRow } from "$lib/shared/ui";
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
    <SplitRow>
      {#snippet right()}
        {#if session.isInEditMode}
          {#if session.isDirty && session.isValid}
          <GhostButton label="Сохранить" onclick={handleSave}>
            <Icon name="check" />
          </GhostButton>
          {/if}
          {#if session.isDirty}
            <GhostButton label="Отмена" onclick={handleCancel}>
              Отмена
            </GhostButton>
          {:else if session.entity.isNew}
            <GhostButton label="Выйти" onclick={onclose}>
              <Icon name="close" />
            </GhostButton>
          {:else}
            <GhostButton label="Назад" onclick={() => (session.isManuallyEditing = false)}>
              <Icon name="chevronRight" />
            </GhostButton>
          {/if}
        {:else}
          <GhostButton label="Редактировать" onclick={() => (session.isManuallyEditing = true)}>
            <Icon name="edit"/>
          </GhostButton>
          <GhostButton label="Выйти" onclick={onclose}>
            <Icon name="close" />
          </GhostButton>
        {/if}
      {/snippet}
    </SplitRow>
  {/snippet}
</Modal>