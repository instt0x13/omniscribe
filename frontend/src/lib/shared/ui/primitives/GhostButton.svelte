<script lang="ts">
  import type { Snippet } from "svelte";
  import type { HTMLButtonAttributes } from "svelte/elements";

  interface Props extends HTMLButtonAttributes {
    children?: Snippet;
    label?: string;
  }

  let {
    children,
    label,
    type = "button",
    class: className,
    ...rest
  }: Props = $props();
</script>

<button
  {...rest}
  {type}
  class={["ghost-btn", className]}
  aria-label={label}
>
  {@render children?.()}
</button>

<style>
  .ghost-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.375rem;
    min-width: 2rem;
    min-height: 2rem;
    padding: 0.25rem;
    background: transparent;
    border: none;
    color: inherit;
    font: inherit;
    font-size: 1.25rem;
    line-height: 1;
    user-select: none;
    cursor: pointer;
    border-radius: 999px; /* pill — корректно и для иконки, и для текста */
  }

  .ghost-btn:hover {
    background: color-mix(in srgb, currentColor 20%, transparent);
  }

  .ghost-btn:focus-visible {
    outline: 2px solid currentColor;
    outline-offset: 2px;
  }

  .ghost-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
</style>