<script lang="ts" generics="T">
  import type { Snippet } from "svelte";
  import type { HTMLAttributes } from "svelte/elements";

  interface Props extends HTMLAttributes<HTMLUListElement> {
    direction?: "horizontal" | "vertical",
    children?: Snippet,
  };

  let {
    direction = "vertical",
    children,
    class: className,
    ...rest
  }: Props = $props();
</script>

<ul
  class="list"
  class:list--horizontal={direction === "horizontal"}
  class:list--vertical={direction === "vertical"}
>
  {@render children?.()}
</ul>

<style>
  .list {
    list-style: none;
    margin: 0;
    padding: 0.25rem;
    display: flex;
    gap: 0.25rem;
  }

  .list--horizontal { flex-direction: row; }
  .list--vertical   { flex-direction: column; }
</style>