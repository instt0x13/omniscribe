<script lang="ts">
  import { Link } from "svelte5-router";
  import type { RoutePage } from "$types";

  interface Props {
    routePageSettings?: RoutePage;
    collapsed?: boolean;
  }

  let {
    routePageSettings,
    collapsed = false,
  }: Props = $props();
</script>

<footer class="footer" class:collapsed>
  {#if routePageSettings}
    <Link to={routePageSettings.path} aria-label="Настройки">
      {#snippet children(active)}
        <span class="icon-setting" class:collapsed class:active>
          {routePageSettings.icon ?? "⚙️"}
        </span>
      {/snippet}
    </Link>
  {/if}
</footer>

<style>
  .footer {
    position: relative;
    display: flex;
    width: 100%;
    flex-direction: row;
    flex-wrap: nowrap;
    align-items: center;
    justify-content: end;
    gap: var(--space);
    border-radius: var(--radius);
    font-size: 1.2rem;
    container-type: inline-size;
  }
  .footer.collapsed {
    justify-content: start;
  }

  .footer.collapsed > :global(a) {
    width: 100%;
  }

  .icon-setting {
    display: flex;
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    gap: calc(var(--space) * 1.8);
    padding: var(--space);
    line-height: 1;
    background-color: var(--surface);
    border-radius: var(--radius);
    border: 1px solid var(--border);
  }
  .icon-setting:hover {
    background-color: var(--surface-hover);
  }
  .icon-setting.active {
    background-color: var(--primary);
  }
  .icon-setting:hover.active {
    background-color: var(--primary-hover);
  }
  .icon-setting.collapsed {
    flex: 1;
    aspect-ratio: 1 / 1;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 50cqw;
  }
</style>