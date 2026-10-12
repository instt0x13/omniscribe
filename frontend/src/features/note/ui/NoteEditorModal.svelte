<script lang="ts">
  import { Modal, Icon, GhostButton } from "$ui";
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
    <div class="modal-top">
      <div class="modal-top-left">
        <h3 class="note-id">ID: {session.entity.isNew ? " (новая)" : session.entity.id}</h3>
      </div>
      <div class="modal-top-right">
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
      </div>
    </div>
  {/snippet}
</Modal>

<style>
  .modal-top {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    align-content: center;
  }
</style>