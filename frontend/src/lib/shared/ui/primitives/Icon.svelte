<script lang="ts">
  import type { SVGAttributes } from "svelte/elements";

  const icons = {
    close: "M6 6l12 12M18 6L6 18",
    check: "M5 13l4 4L19 7",
    plus: "M12 5v14M5 12h14",
    minus: "M5 12h14",
    chevronLeft: "M15 6l-6 6 6 6",
    chevronRight: "M9 6l6 6-6 6",
    arrowLeft: "M19 12H5M12 19l-7-7 7-7",
    arrowRight: "M5 12h14M12 5l7 7-7 7",
    search: "M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM21 21l-4.35-4.35",
    menu: "M3 6h18M3 12h18M3 18h18",
    trash: "M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14",
    edit: "M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z",
    info: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM12 16v-4M12 8h.01",
    warning: "M12 9v4M12 17h.01M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z",
    eye: "M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z",
  } as const;

  type IconName = keyof typeof icons;

  interface Props extends SVGAttributes<SVGSVGElement> {
    name: IconName;
    size?: number | string;
    strokeWidth?: number;
  }

  let {
    name,
    size = 24,
    strokeWidth = 2,
    class: className,
    ...rest
  }: Props = $props();

  let path = $derived(icons[name]);
</script>

<svg
  {...rest}
  xmlns="http://www.w3.org/2000/svg"
  width={size}
  height={size}
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width={strokeWidth}
  stroke-linecap="round"
  stroke-linejoin="round"
  class={["icon", className]}
  aria-hidden="true"
>
  <path d={path} />
</svg>

<style>
  .icon {
    display: inline-block;
    flex-shrink: 0;
    vertical-align: middle;
  }
</style>