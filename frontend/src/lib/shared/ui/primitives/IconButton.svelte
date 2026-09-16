<script lang="ts">
  import type { Snippet } from "svelte";
  import type { HTMLButtonAttributes } from "svelte/elements";

  interface Props extends HTMLButtonAttributes {
    children?: Snippet;
    label: string;
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
  class={["icon-btn", className]}
  aria-label={label}
>
  {@render children?.()}
</button>

<style>
  .icon-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 2rem;
    height: 2rem;
    padding: 0;
    background: transparent;
    border: none;
    color: inherit;
    font-size: 1.25rem;
    line-height: 1;
    user-select: none;
    cursor: pointer;
    border-radius: 50%;
  }

  .icon-btn:hover {
    background: currentColor;
    background: color-mix(in srgb, currentColor 20%, transparent);
  }

  .icon-btn:focus-visible {
    outline: 2px solid currentColor;
    outline-offset: 2px;
  }

  .icon-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
</style>