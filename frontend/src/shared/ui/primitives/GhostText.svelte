<script lang="ts">
  import type { Snippet } from "svelte";
  import type { HTMLAttributes } from "svelte/elements";

  interface Props extends HTMLAttributes<HTMLSpanElement> {
    children?: Snippet;
    label?: string;
  }

  let {
    children,
    label,
    class: className,
    ...rest
  }: Props = $props();
</script>

<span
  {...rest}
  class={["ghost-text", className]}
  aria-label={label}
>
  {@render children?.()}
</span>

<style>
  .ghost-text {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.375rem;
    min-width: 1.5rem;
    min-height: 1.5rem;
    padding: 0.1rem;
    background: transparent;
    border: none;
    color: inherit;
    font: inherit;
    font-size: 1rem;
    line-height: 1;
    user-select: none;
    border-radius: 999px;
  }
</style>