<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLButtonAttributes } from 'svelte/elements';

  type Variant = 'default' | 'accent' | 'primary';
  type Size = 'md' | 'sm' | 'lg';

  interface Props extends HTMLButtonAttributes {
    variant?: Variant;
    size?: Size;
    children: Snippet;
  }

  let {
    variant = 'default',
    size = 'md',
    type = 'button',
    class: className = '',
    children,
    ...rest
  }: Props = $props();
</script>

<button
  {type}
  class="btn {className}"
  class:btn--accent={variant === 'accent'}
  class:btn--primary={variant === 'primary'}
  class:btn--sm={size === 'sm'}
  class:btn--lg={size === 'lg'}
  {...rest}
>
  {@render children()}
</button>

<style>
  .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.8rem;
    padding: 0.35rem 0.8rem;
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
  .btn--accent {
    background: var(--accent);
    border: 1px solid var(--accent-border);
  }
  .btn--accent:hover  {
    background: var(--accent-hover);
    border: 1px solid var(--accent-border-hover);
  }
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
    padding: 0.2rem 0.6rem;
    font-size: 0.85em;
  }
  .btn--lg {
    gap: 1.2rem;
    padding: 0.6rem 1.2rem;
    font-size: 1.15em;
  }
</style>