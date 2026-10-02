<script lang="ts">
  import type { Snippet } from "svelte";
  import { Layer } from "$ui";

  interface Props {
    zindex: number,
    header?: Snippet,
    sidebar?: Snippet,
    footer?: Snippet,
    children?: Snippet
  }
  let { zindex, header, sidebar, footer, children }: Props = $props();
</script>

<Layer class="app" zindex={zindex}>
  <div class="app-shell">
    <header class="app-header rb bb">
      {#if header}{@render header()}{/if}
    </header>

    <aside class="app-sidebar rb">
      {#if sidebar}{@render sidebar()}{/if}
    </aside>

    <main class="app-content">
      {#if children}{@render children()}{/if}
    </main>

    <footer class="app-footer rb tb">
      {#if footer}{@render footer()}{/if}
    </footer>
  </div>
</Layer>

<style>
  .rb { border-right: 2px solid var(--border); }
  .bb { border-bottom: 1px dotted var(--border); }
  .tb { border-top: 1px dotted var(--border); }

  .app-shell {
    display: grid;
    grid-template-areas:
      "header  content"
      "sidebar content"
      "status  content";
    grid-template-columns: var(--sidebar-width, 240px) 1fr;
    grid-template-rows: var(--header-height, 56px) 1fr var(--status-height, 24px);
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
  }

  .app-sidebar {
    grid-area: sidebar;
    overflow-y: auto;
    padding: 0.1rem 0.2rem;
    background: var(--panel);
  }

  .app-content {
    grid-area: content;
    overflow: auto;
    min-width: 0;
    min-height: 0;
    padding: 0.75rem;
  }

  .app-footer {
    grid-area: status;
    display: flex;
    align-items: center;
    overflow: hidden;
    padding: 0.1rem 0.2rem;
    background: var(--panel);
  }
</style>