<script lang="ts">
  import {Button} from "$components";

  interface Props {
    title: string;
    content: string;
    onopen: () => void;
    oncopy: () => void;
  }

  let { title, onopen, oncopy }: Props = $props();
</script>

<div class="note-preview">
  <div class="note-title" onclick={onopen} role="button" tabindex="0" onkeydown={(e) => e.key === 'Enter' && onopen()}>
    <span>{title}</span>
  </div>
  <Button variant="icon" onclick={oncopy} title="Скопировать">📋</Button>
</div>

<style>
  .note-preview {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.75rem 1rem;
    background: var(--panel);
    border: 1px solid var(--border);
    border-radius: var(--radius);
  }

  .note-title {
    flex-grow: 1;
    font-weight: 600;
    cursor: pointer;
    &:hover { color: var(--primary); }
  }
  
</style>