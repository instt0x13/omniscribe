<script lang="ts">
  import type { Snippet } from "svelte";

  interface Props {
    left?: Snippet;
    center?: Snippet;
    right?: Snippet;
    align?: "center" | "start" | "end" | "stretch";
    gap?: string;
    class?: string;
  }

  let {
    left,
    center,
    right,
    align = "center",
    gap = "0.75rem",
    class: className = "",
  }: Props = $props();
</script>

<div class="split-row {className}" style:--split-gap={gap} style:--split-align={align}>
  <div class="section left">{@render left?.()}</div>
  <div class="section center">{@render center?.()}</div>
  <div class="section right">{@render right?.()}</div>
</div>

<style>
  .split-row {
    display: flex;
    align-items: var(--split-align);
    justify-content: space-between;
    width: 100%;
    gap: var(--split-gap);
  }

  .section {
    display: flex;
    align-items: center;
    flex: 1;
    min-width: 0; /* чтобы длинный контент не ломал разметку */
  }

  .section.left {
    justify-content: flex-start;
  }

  .section.center {
    justify-content: center;
  }

  .section.right {
    justify-content: flex-end;
  }
</style>