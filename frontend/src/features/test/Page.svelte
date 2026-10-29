<script lang="ts">
  import { Button } from "$ui";
</script>

<div class="test-wrap">
  <section>
    <h2>Кнопки</h2>
    <div class="test-buttons">
      <h3>default</h3>
      <Button variant="default" size="md">Обычная</Button>
      <Button variant="default" size="sm">Маленькая</Button>
      <Button variant="default" size="lg">Большая</Button>
      <Button square variant="default" size="md">О</Button>
      <Button square variant="default" size="sm">М</Button>
      <Button square variant="default" size="lg">Б</Button>
    </div>
    <div class="test-buttons">
      <h3>ghost</h3>
      <Button variant="ghost" size="md">Обычная</Button>
      <Button variant="ghost" size="sm">Маленькая</Button>
      <Button variant="ghost" size="lg">Большая</Button>
      <Button square variant="ghost" size="md">О</Button>
      <Button square variant="ghost" size="sm">М</Button>
      <Button square variant="ghost" size="lg">Б</Button>
    </div>
    <div class="test-buttons">
      <h3>primary</h3>
      <Button variant="primary" size="md">Обычная</Button>
      <Button square variant="primary" size="md">О</Button>
      <Button variant="primary" size="sm">Маленькая</Button>
      <Button square variant="primary" size="sm">М</Button>
      <Button variant="primary" size="lg">Большая</Button>
      <Button square variant="primary" size="lg">Б</Button>
    </div>
  </section>
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
  .test-wrap > section {
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
  }

  .test-buttons {
    display: flex;
    justify-content: start;
    align-items: center;
    gap: 1rem;
    padding: 0.3rem;
    border: 1px solid var(--border);
    border-radius: var(--radius);
  }
</style>