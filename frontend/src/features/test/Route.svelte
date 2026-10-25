<script lang="ts">
  import { Button } from "$ui";
</script>

<div class="test-wrap">
  <h2>Кнопки</h2>
  <div class="test-buttons">
    <Button size="md">Обычная</Button>
    <Button size="sm">Маленькая</Button>
    <Button size="lg">Большая</Button>
  </div>
</div>

<style>
  .test-wrap {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: var(--space);
    background-color: var(--panel);
    border: 1px solid var(--border);
    border-radius: var(--radius);
  }
</style>