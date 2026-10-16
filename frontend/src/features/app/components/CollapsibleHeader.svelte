<script lang="ts">
  import { Link } from "svelte5-router";
  import type { RoutePage } from "$types";

  interface Props {
    routePageHome?: RoutePage;
    collapsed?: boolean;
  }

  let {
    routePageHome,
    collapsed = $bindable(false),
  }: Props = $props();
</script>

<header class="header" class:collapsed>
  {#if routePageHome}
    <Link to={routePageHome.path} aria-label="Главная">
      {#snippet children(active)}
        <span class="brand" class:collapsed class:active>
          <span class="icon-brand" class:collapsed>
            {routePageHome.icon ?? "⬤"}
          </span>
          <h1 class="title-brand" class:collapsed class:active>OmniScribe</h1>
        </span>
      {/snippet}
    </Link>
  {/if}
  <button class="bth-collapsed" class:collapsed onclick={() => (collapsed = !collapsed)}>
    {collapsed ? "❯" : "❮"}
  </button>
</header>

<style>
  .header {
    position: relative;
    display: flex;
    width: 100%;
    flex-direction: row;
    flex-wrap: nowrap;
    align-items: center;
    justify-content: end;
    gap: var(--space);
    border-radius: var(--radius);
    container-type: inline-size;
  }
  .header.collapsed {
    justify-content: start;
  }

  .header.collapsed > :global(a) {
    width: 100%;
  }

  .bth-collapsed {
    font-size: calc(var(--font-size) * 1.5)
  }

  .brand {
    display: flex;
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    gap: calc(var(--space) * 1.8);
    padding: var(--space);
    background-color: var(--surface);
    border-radius: var(--radius);
    border: 1px solid var(--border);
  }
  .brand:hover {
    background-color: var(--surface-hover);
  }
  .brand.active.collapsed {
    background-color: var(--primary);
  }
  .brand:hover.active.collapsed {
    background-color: var(--primary-hover);
  }

  .icon-brand {
    font-size: calc(var(--font-size) * 2);
    line-height: 1;
  }
  .icon-brand.collapsed {
    width: 100%;
    flex: 1;
    aspect-ratio: 1 / 1;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 75cqw;
  }
  
  .title-brand {
    font-size: calc(var(--font-size) * 1.25);
    padding: var(--space);
    border-radius: var(--radius);
  }
  .title-brand.active {
    color: var(--primary-text);
    background-color: var(--primary);
  }
  .title-brand.collapsed {
    display: none;
  }
  .brand:hover .title-brand.active {
    background-color: var(--primary-hover);
  }
</style>