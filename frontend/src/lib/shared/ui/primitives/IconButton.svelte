<script lang="ts">
  import type { Snippet } from "svelte";
  import type { HTMLButtonAttributes } from "svelte/elements";

  interface Props extends HTMLButtonAttributes {
    children?: Snippet;
    label: string; // для aria-label, т.к. содержимое — иконка
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
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2rem;
    height: 2rem;
    padding: 0;
    background: transparent;
    border: none;
    color: white;
    font-size: 1.25rem;
    line-height: 1;
    user-select: none;
    cursor: pointer;
    border-radius: 50%;
    transition: background 0.15s ease;
  }

  .icon-btn:hover {
    background: rgba(255, 255, 255, 0.25);
  }

  .icon-btn:focus-visible {
    outline: 2px solid rgba(255, 255, 255, 0.6);
    outline-offset: 2px;
  }

  .icon-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
</style>