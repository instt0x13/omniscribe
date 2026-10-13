<script lang="ts">
  interface Props {
    icon: string;
    title: string;
    collapsed?: boolean;
    active?: boolean;
  }

  let { icon, title, collapsed = false, active = false }: Props = $props();
</script>

<span class="nav-item full" class:active class:collapsed>
  <span class="nav-icon">{icon}</span>
  <span class="nav-title">{title}</span>
</span>

<style>
  .nav-item {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: calc(var(--space) * 2);
    padding: calc(var(--space) * 1.8);
    border-radius: var(--radius);
    color: var(--text);
    cursor: pointer;
    width: 100%;
    transition: all var(--transition);
    position: relative;
    z-index: 1;
  }

  .nav-item:hover {
    width: 8rem;
    background: var(--surface-hover);
  }

  .nav-item.active {
    background: var(--primary-active);
    color: var(--primary-text);
  }

  .nav-item.active:hover {
    background: var(--primary-hover);
  }

  .nav-icon {
    flex-shrink: 0;
    font-size: calc(var(--font-size) * 1.2);
  }

  .nav-title,
  .nav-item:hover.collapsed .nav-title {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    transform-origin: left center;
    transition: all 0.3s ease;
    max-width: 100%;
    opacity: 1;
    transform: scaleX(1);
  }

  .collapsed .nav-title {
    max-width: 0;
    opacity: 0;
    transform: scaleX(0.8);
  }
</style>
