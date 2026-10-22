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
    gap: 0.8rem;
    padding: 0.5rem 0.8rem;
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
    border-color: var(--border-hover);
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
    border: 1px solid var(--primary-border);
    color: var(--primary-text);
  }
  .btn--primary:hover  {
    background: var(--primary-hover);
    border: 1px solid var(--primary-border-hover);
  }

  /* размеры */
  .btn--sm {
    gap: 0.4rem;
    padding: 0.25rem 0.4rem;
    font-size: 0.875em;
  }
  .btn--lg {
    gap: 1.2rem;
    padding: 1rem 1.2rem;
    font-size: 1.125em;
  }

  .btn__icon {
    display: inline-flex;
    align-items: center;
  }
</style>