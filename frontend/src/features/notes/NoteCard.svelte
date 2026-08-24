<script lang="ts">
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
  <button class="btn-icon" onclick={oncopy} title="Скопировать">📋</button>
</div>