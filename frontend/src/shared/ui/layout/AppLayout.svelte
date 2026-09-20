<script lang="ts">
  import type { Snippet } from "svelte";

  interface Props {
    header?: Snippet;
    sidebar?: Snippet;
    statusbar?: Snippet;
    children?: Snippet;
  }

  let { header, sidebar, statusbar, children }: Props = $props();
</script>

<div class="app-shell">
  <header class="app-header">
    {#if header}{@render header()}{/if}
  </header>

  <aside class="app-sidebar">
    {#if sidebar}{@render sidebar()}{/if}
  </aside>

  <main class="app-content">
    {#if children}{@render children()}{/if}
  </main>
  
  <footer class="app-statusbar">
    {#if statusbar}{@render statusbar()}{/if}
  </footer>
</div>

<style>
  .app-shell {
    display: grid;
    grid-template-areas:
      "header  header"
      "sidebar content"
      "sidebar  status";
    grid-template-columns: var(--sidebar-width, 240px) 1fr;
    grid-template-rows: var(--header-height, 56px) 1fr var(--status-height, 16px);
    height: 100vh;
    width: 100vw;
    overflow: hidden;
    box-sizing: border-box;
  }

  .app-header {
    grid-area: header;
    display: flex;
    align-items: center;
    overflow: hidden;
    justify-content: space-between;
    width: 100%;
    padding: 0.75rem 1.5rem;
    background: var(--panel);
    border-bottom: 1px solid var(--border);
  }

  .app-sidebar {
    grid-area: sidebar;
    overflow-y: auto;
    padding: 0.1rem 0.2rem;
    background: var(--panel);
    border-right: 1px solid var(--border);
  }

  .app-content {
    grid-area: content;
    overflow: auto;
    min-width: 0;
    min-height: 0;
    padding: 0.75rem;
  }

  .app-statusbar {
    grid-area: status;
    display: flex;
    align-items: center;
    overflow: hidden;
    padding: 0.1rem 0.2rem;
    background: var(--panel);
    border-top: 1px solid var(--border);
  }
</style>