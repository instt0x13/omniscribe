<script lang="ts">
  import type { Snippet } from "svelte";

  interface Props {
    top?: Snippet;
    center?: Snippet;
    bottom?: Snippet;
    align?: "start" | "center" | "end" | "stretch";
    gap?: string;
    class?: string;
  }

  let {
    top,
    center,
    bottom,
    align = "stretch",
    gap = "0.75rem",
    class: className = "",
  }: Props = $props();
</script>

<div class="split-column {className}" style:--split-gap={gap} style:--split-align={align}>
  <div class="section top">{@render top?.()}</div>
  <div class="section center">{@render center?.()}</div>
  <div class="section bottom">{@render bottom?.()}</div>
</div>

<style>
  .split-column {
    display: flex;
    flex-direction: column;
    align-items: var(--split-align);
    justify-content: space-between;
    width: 100%;
    height: 100%;
    gap: var(--split-gap);
  }

  .section {
    display: flex;
    flex-direction: column;
    flex: 1;
    min-height: 0; /* чтобы длинный контент не ломал разметку */
    width: 100%;
  }

  .section.top {
    justify-content: flex-start;
  }

  .section.center {
    justify-content: center;
  }

  .section.bottom {
    justify-content: flex-end;
  }
</style>