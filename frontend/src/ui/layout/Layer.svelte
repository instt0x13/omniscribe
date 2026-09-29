<script lang="ts">
    import type { Snippet } from "svelte";
    import type { HTMLAttributes } from "svelte/elements";

  interface Props extends HTMLAttributes<HTMLDivElement> {
    zindex: number,
    children?: Snippet
  }
  let { 
    zindex, 
    children,
    class: className,
    ...rest 
  }: Props = $props();
</script>

<div
  {...rest}
  class={["layer", className]}
  style:z-index={zindex}
  >
  {@render children?.()}
</div>

<style>
  .layer {
    position: relative;
  }
</style>