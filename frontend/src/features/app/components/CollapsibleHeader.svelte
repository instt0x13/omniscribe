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
    gap: 0.25rem;
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
    position: absolute;
    right: -0.9rem;
    font-size: 1.5rem;
    transform: scaleX(0.8);
    transition: var(--transition);
  }
  .bth-collapsed:hover {
    transform: scaleX(1.5);
  }

  .brand {
    display: flex;
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    gap: 0.3rem;
    padding: 0.5rem;
    background-color: var(--surface);
    border-radius: var(--radius);
    border: 1px solid var(--border);
  }
  .brand:hover {
    background-color: var(--surface-hover);
    border-color: var(--border-hover);
  }
  .brand.collapsed {
    aspect-ratio: 1 / 1;
  }
  .brand.active.collapsed {
    background-color: var(--primary);
    border-color: var(--primary-border);
  }
  .brand:hover.active.collapsed {
    background-color: var(--primary-hover);
    border-color: var(--primary-border-hover);
  }

  .icon-brand {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2rem;
    line-height: 1;
  }
  .icon-brand.collapsed {
    width: 100%;
    flex: 1;
    aspect-ratio: 1 / 1;
    font-size: 75cqw;
  }
  
  .title-brand {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.2rem;
    line-height: 1;
    padding: var(--space-sm);
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