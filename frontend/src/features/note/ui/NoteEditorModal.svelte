<script lang="ts">
  import { Modal, Icon, GhostButton, SplitRow } from "$shared/ui";
  import { NoteEditorSession } from "../classes/NoteEditorSession.svelte";
  import NoteCard from "./NoteEditor.svelte";

  interface Props {
    session: NoteEditorSession,
    onclose: () => void,
    onsave: () => void,
    oncancel: () => void
  }
  let { session, onclose, onsave, oncancel }: Props = $props();
</script>

<Modal onrequestclose={onclose}>
  <NoteCard session={session} />
  {#snippet top()}
    <SplitRow>
      {#snippet left()}
        <h3 class="note-id">ID: {session.entity.isNew ? " (новая)" : session.entity.id}</h3>
      {/snippet}
      {#snippet right()}
        {#if session.isInEditMode}
          {#if session.isDirty && session.isValid}
          <GhostButton label="Сохранить" onclick={onsave}>
            <Icon name="check" />
          </GhostButton>
          {/if}
          {#if session.isDirty}
            <GhostButton label="Отмена" onclick={oncancel}>
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