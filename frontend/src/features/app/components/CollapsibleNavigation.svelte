<script lang="ts">
  import { Link } from "svelte5-router";
  import type { RoutePage } from "$types";

  interface Props {
    routePagesNav?: RoutePage[];
    collapsed?: boolean;
  }

  let {
    routePagesNav,
    collapsed = false,
  }: Props = $props();
</script>

{#if routePagesNav}
  <nav class="navigation" aria-label="Основная навигация">
    <ul class="navigation-items">
      {#each routePagesNav as route}
        <li class="navigagion-item">
          <Link to={route.path}>
            {#snippet children(active)}
              <span class="item" class:active>
                <span class="leading" class:collapsed>{route.icon}</span>
                <span class="content" class:collapsed>{route.title}</span>
              </span>
            {/snippet}
          </Link>
        </li>
      {/each}
    </ul>
  </nav>
{/if}


<style>
  .navigation {
    flex-grow: 1;
  }
  .navigation-items {
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
  }

  .item {
    display: flex;
    width: 100%;
    flex-direction: row;
    flex-wrap: nowrap;
    align-items: center;
    gap: 0.3rem;
    border-radius: var(--radius);
    container-type: inline-size;
    padding: 0.3rem;
  }
  .item:hover {
    background-color: var(--surface-hover);
  }
  .item.active {
    background-color: var(--primary);
    color: var(--primary-text);
  }
  .item.active:hover {
    background-color: var(--primary-hover);
  }

  .leading {
    font-size: 1.3rem;
  }
  .leading.collapsed {
    flex: 1;
    aspect-ratio: 1 / 1;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 75cqw;
    line-height: 1;
  }

  .content {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .content.collapsed {
    display: none;
  }
</style>