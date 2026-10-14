<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLButtonAttributes } from 'svelte/elements';

  type Variant = 'default' | 'primary';
  type Size = 'md' | 'sm' | 'lg';

  interface Props extends HTMLButtonAttributes {
    variant?: Variant;
    size?: Size;
    iconLeft?: Snippet;
    iconRight?: Snippet;
    children: Snippet;
  }

  let {
    variant = 'default',
    size = 'md',
    type = 'button',
    class: className = '',
    iconLeft,
    iconRight,
    children,
    ...rest
  }: Props = $props();
</script>

<button
  {type}
  class="btn {className}"
  class:btn--primary={variant === 'primary'}
  class:btn--sm={size === 'sm'}
  class:btn--lg={size === 'lg'}
  {...rest}
>
  {#if iconLeft}<span class="btn__icon">{@render iconLeft()}</span>{/if}
  {@render children()}
  {#if iconRight}<span class="btn__icon">{@render iconRight()}</span>{/if}
</button>

<style>
  .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: calc(var(--space) * 2);
    padding: calc(var(--space) * 2) calc(var(--space) * 4);
    background: var(--surface);
    color: var(--text);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    font-size: var(--font-size);
    font-weight: 500;
    line-height: var(--line-height);
    cursor: pointer;
    user-select: none;
    transition:
      background var(--transition),
      border-color var(--transition),
      color var(--transition),
      box-shadow var(--transition),
      opacity var(--transition);
  }

  .btn:hover {
    background: var(--surface-hover);
    border-color: var(--border-strong);
  }

  .btn:active {
    box-shadow: inset 0 1px 2px hsl(var(--shadow-color) / 0.12);
  }

  .btn:disabled {
    opacity: var(--disabled-opacity);
    cursor: not-allowed;
    background: var(--disabled-bg);
  }

  /* варианты */
  .btn--primary {
    background: var(--primary);
    color: var(--primary-text);
    border-color: transparent;
  }
  .btn--primary:hover  { background: var(--primary-hover); }
  .btn--primary:active { background: var(--primary-active); }

  /* размеры */
  .btn--sm {
    padding: calc(var(--space)) calc(var(--space) * 3);
    font-size: 0.875em;
  }
  .btn--lg {
    padding: calc(var(--space) * 3) calc(var(--space) * 5);
    font-size: 1.125em;
  }

  .btn__icon {
    display: inline-flex;
    align-items: center;
  }
</style>