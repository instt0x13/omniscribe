<script lang="ts">
  import type { Snippet } from "svelte";

  interface Props {
    type?: "button" | "submit" | "reset";
    variant?: "primary" | "secondary" | "icon";
    title?: string;
    onclick?: (e: MouseEvent) => void;
    children?: Snippet;
  }

  let {
    type = "button",
    variant = "primary",
    title,
    onclick,
    children
  }: Props = $props();
</script>

<button
  {type}
  {title}
  class="btn-{variant}"
  {onclick}
>
  {@render children?.()}
</button>

<style>
.btn-secondary { background: var(--muted); }

.btn-icon {
  background: transparent;
  padding: 0.4rem;
  color: inherit;
  &:hover { background: var(--border); }
}
</style>