<script lang="ts">
  import type { Snippet } from "svelte";
  import { Layer } from "$ui";

  interface Props {
    zindex: number;
    collapsed: boolean;
    header?: Snippet;
    sidebar?: Snippet;
    footer?: Snippet;
    children?: Snippet;
  }

  let { zindex, collapsed, header, sidebar, footer, children }: Props = $props();
</script>

<Layer class="app" {zindex}>
  <div class="app-shell row">
    <aside class="app-sidebar column padding-2 gap-2" class:collapsed>
      <header class="side-header row gap-5 middle around">
        {@render header?.()}
      </header>
      <div class="side-content grow">
        {@render sidebar?.()}
      </div>
      <footer class="side-footer">
        {@render footer?.()}
      </footer>
    </aside>

    <main class="app-content grow">
      {@render children?.()}
    </main>
  </div>
</Layer>

<style>
  .app-shell {
    block-size: 100dvh;
    width: 100%;
    overflow: hidden;
  }

  .side-header, .side-footer {
    overflow: hidden;
  }

  .app-sidebar {
    background: var(--panel);
    border-right: 2px solid var(--border);
    max-width: calc(var(--font-size) * 16);
    transition: max-width var(--transition) ;
  }
  .app-sidebar.collapsed {
    max-width: calc(var(--font-size) * 4);
  }

  .app-content {
    padding: calc(var(--space) * 3);
    overflow: visible;
  }

</style>