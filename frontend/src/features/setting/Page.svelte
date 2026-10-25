<script lang="ts">
  import type { SettingsSection } from "$types";

  interface Props {
    sections: SettingsSection[]
  }
  let { sections }: Props = $props();
</script>

<div class="settings">
  {#each sections as section}
    {@const PageComponent = section.component}
    <section class="settings__group {section.title}-settings__group">
      <h2 class="title">{section.title}</h2>
      <div>
        <PageComponent />
      </div>
    </section>
  {/each}
</div>

<style>
  .settings {
    display: flex;
    flex-direction: column;
    gap: var(--space-lg);
  }

  /* --- Контейнер всех секций --- */
  .settings__group {
    position: relative;              /* чтобы title позиционировался относительно секции */
    overflow: visible;
    border: 1px solid var(--border);
    background-color: var(--panel);
    margin-top: 0.5rem;
    padding: var(--space);
    padding-top: calc(var(--space) + 0.5rem);
    border-radius: var(--radius);
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
    letter-spacing: 0.03rem;
    text-transform: uppercase;
    color: var(--text);
    background: var(--bg);
    border: 1px solid var(--border);
    border-radius: var(--radius);
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