<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLButtonAttributes } from 'svelte/elements';

  type Variant = 'default' | 'primary' | "ghost";
  type Size = 'md' | 'sm' | 'lg';

  interface Props extends HTMLButtonAttributes {
    variant?: Variant;
    size?: Size;
    square?: boolean;  // новый проп
    children?: Snippet;
  }

  let {
    variant = 'default',
    size = 'md',
    square = false,  // по умолчанию не квадратная
    type = 'button',
    class: className = '',
    children,
    ...rest
  }: Props = $props();
</script>

<button
  {type}
  class="btn {className}"
  class:btn--primary={variant === 'primary'}
  class:btn--ghost={variant === 'ghost'}
  class:btn--sm={size === 'sm'}
  class:btn--lg={size === 'lg'}
  class:btn--square={square}  // добавляем класс для квадрата
  {...rest}
>
  {@render children?.()}
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
    font-weight: 500;
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
  .btn--ghost {
    color: currentColor;
    background: transparent;
    border: none;
  }
  .btn--ghost:hover {
    background: color-mix(in srgb, currentColor 20%, transparent);
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

  /* квадратный режим */
  .btn--square {
    aspect-ratio: 1 / 1;
    padding: 0;  /* убираем паддинги чтобы контент центрировался */
    overflow: hidden;
  }
  
  /* комбинируем с размерами для правильной высоты */
  .btn--square.btn--sm {
    font-size: 1.5rem;
    width: 2rem;
    height: 2rem;
  }
  .btn--square {
    font-size: 2rem;
    width: 2.5rem;
    height: 2.5rem;
  }
  .btn--square.btn--lg {
    font-size: 2.5rem;
    width: 3rem;
    height: 3rem;
  }
</style>