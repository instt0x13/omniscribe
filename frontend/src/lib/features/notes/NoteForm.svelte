<script lang="ts">
  import {Button} from "$lib/shared/ui";

  interface Props {
    onsubmit: (data: { title: string; content: string }) => Promise<void>;
  }

  let { onsubmit }: Props = $props();
  let title = $state("");
  let content = $state("");

  async function handleSubmit() {
    if (!title.trim()) return;
    await onsubmit({ title, content });
    title = "";
    content = "";
  }
</script>

<form class="input-group" onsubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
  <input bind:value={title} placeholder="Заголовок..." />
  <textarea bind:value={content} placeholder="Контент (Markdown)" rows="3"></textarea>
  <Button type="submit">Добавить заметку</Button>
</form>

<style>
  .input-group {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    margin-bottom: 2rem;
  }
</style>