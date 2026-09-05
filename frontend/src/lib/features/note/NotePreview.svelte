<script lang="ts">
  import { Button } from "$lib/shared/ui";
  import type { Note } from "./noteTypes";

  interface Props {
    note: Note;
    onopen: () => void; // Вызываем событие клика
  }

  let { note, onopen }: Props = $props();

  function handleCopy() {
    navigator.clipboard.writeText(note.content)
      .then(() => alert("Скопировано! 🎉"))
      .catch(() => alert("Ошибка копирования"));
  }
</script>

<div class="note-preview">
  <div 
    class="note-title" 
    onclick={onopen} 
    role="button" 
    tabindex="0" 
    onkeydown={(e) => e.key === 'Enter' && onopen()}
  >
    <span>{note.title}</span>
  </div>
  <Button variant="icon" onclick={handleCopy} title="Скопировать">📋</Button>
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