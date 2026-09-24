<script lang="ts">
  import { settings } from "$shared/services";
</script>

<div>
  {#each settings.pages as page}
    {@const PageComponent = page.component}
    <section class="settings {page.title}-settings">
      <h2 class="title">{page.title}</h2>
      <div>
        <PageComponent />
      </div>
    </section>
  {/each}
</div>

<style>
  /* --- Контейнер всех секций --- */
  .settings {
    position: relative;              /* чтобы title позиционировался относительно секции */
    overflow: visible;
    border: 1px solid var(--border);
    background-color: var(--panel);
    margin-top: 1rem;
    padding: 1rem 0.75rem 0.75rem;
    border-radius: var(--radius);
  }

  .settings:hover {
    border-color: hsl(var(--hue) calc(var(--sat) * 0.8) calc(30% + var(--mode) * 55%) / var(--alpha));
  }

  /* --- Заголовок секции --- */
  .title {
    position: absolute;
    top: 0;
    left: 0.6rem;
    transform: translateY(-50%);     /* «висит» на верхней границе */
    display: inline-block;
    font-size: 0.75rem;
    padding: 0.1rem 0.45rem;
    margin: 0;
    font-weight: 600;
    letter-spacing: 0.03em;
    text-transform: uppercase;
    color: var(--text);
    background: var(--bg);
    border: 1px solid var(--border);
    border-radius: calc(var(--radius) * 1.2);
    white-space: nowrap;
  }

  /* --- Внутренний контейнер для контента страницы --- */
  .settings > div {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    margin-top: 0.5rem;
  }
</style>