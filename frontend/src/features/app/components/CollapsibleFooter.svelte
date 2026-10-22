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
    gap: 0.3rem;
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
    aspect-ratio: 1 / 1;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    gap: 0.2rem;
    padding: 0.3rem;
    line-height: 1;
    background-color: var(--surface);
    border-radius: var(--radius);
    border: 1px solid var(--border);
  }
  .icon-setting:hover {
    background-color: var(--surface-hover);
    border-color: var(--border-hover);
  }
  .icon-setting.active {
    background-color: var(--primary);
    border-color: var(--primary-border);
  }
  .icon-setting:hover.active {
    background-color: var(--primary-hover);
    border-color: var(--primary-border-hover);
  }
  .icon-setting.collapsed {
    flex: 1;
    font-size: 50cqw;
  }
</style>