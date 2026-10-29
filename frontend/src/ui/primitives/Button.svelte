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
    gap: 0.5rem;
    padding: 0.5rem 1rem;
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
    padding: 0.4rem 0.8rem;
    font-size: 0.8em;
  }
  .btn--lg {
    gap: 0.6rem;
    padding: 0.6rem 1.2rem;
    font-size: 1.2em;
  }

  /* квадратный режим */
  .btn--square {
    aspect-ratio: 1 / 1;
    padding: 0;  /* убираем паддинги чтобы контент центрировался */
    overflow: hidden;
  }
  
  /* комбинируем с размерами для правильной высоты */
  .btn--square.btn--sm {
    font-size: 1.2rem;
    height: calc(1.6rem + 2px);
  }
  .btn--square {
    font-size: 1.5rem;
    height: calc(2rem + 2px);
  }
  .btn--square.btn--lg {
    font-size: 1.8rem;
    height: calc(2.4rem + 2px);
  }
</style>