<script lang="ts">
  import type { Snippet } from "svelte";

  interface Props {
    /** "horizontal" — панели слева/справа, сплит вертикальный.
     *  "vertical"   — панели сверху/снизу, сплит горизонтальный. */
    direction: "horizontal" | "vertical";
    /** Начальная доля первой панели, 0..1 */
    initial?: number;
    /** Минимальный размер панели в процентах */
    min?: number;
    /** Максимальный размер панели в процентах */
    max?: number;
    /** Snippet первой панели */
    first: Snippet;
    /** Snippet второй панели */
    second: Snippet;
    /** Колбэк при изменении доли (0..1) */
    onchange?: (ratio: number) => void;
  }

  let {
    direction,
    initial = 0.5,
    min = 0.1,
    max = 0.9,
    first,
    second,
    onchange,
  }: Props = $props();

  let container = $state<HTMLDivElement | null>(null);
  let ratio = $derived(clamp(initial, min, max));
  let dragging = $state(false);

  function clamp(v: number, lo: number, hi: number) {
    return Math.min(hi, Math.max(lo, v));
  }

  function onPointerDown(e: PointerEvent) {
    e.preventDefault();
    dragging = true;
    // Ловим move/up на window — чтобы не терять события за пределами ручки
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("pointercancel", onPointerUp);
  }

  function onPointerMove(e: PointerEvent) {
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const raw =
      direction === "horizontal"
        ? (e.clientX - rect.left) / rect.width
        : (e.clientY - rect.top) / rect.height;
    ratio = clamp(raw, min, max);
    onchange?.(ratio);
  }

  function onPointerUp() {
    dragging = false;
    window.removeEventListener("pointermove", onPointerMove);
    window.removeEventListener("pointerup", onPointerUp);
    window.removeEventListener("pointercancel", onPointerUp);
  }

  // Обработка стрелок для доступности
  function onKeyDown(e: KeyboardEvent) {
    const step = e.shiftKey ? 0.1 : 0.02;
    let next = ratio;
    if (
      (direction === "horizontal" && e.key === "ArrowLeft") ||
      (direction === "vertical" && e.key === "ArrowUp")
    ) {
      next = ratio - step;
    } else if (
      (direction === "horizontal" && e.key === "ArrowRight") ||
      (direction === "vertical" && e.key === "ArrowDown")
    ) {
      next = ratio + step;
    } else if (e.key === "Home") {
      next = min;
    } else if (e.key === "End") {
      next = max;
    } else {
      return;
    }
    e.preventDefault();
    ratio = clamp(next, min, max);
    onchange?.(ratio);
  }

  $effect(() => {
    // на всякий случай — не оставляем слушатели, если компонент размонтируется
    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerUp);
    };
  });
</script>

<div
  bind:this={container}
  class="splitter {direction}"
  class:dragging
>
  <div class="pane first" style:flex-basis="{ratio * 100}%">
    {@render first()}
  </div>

  <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
  <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
  <div
    class="handle"
    role="separator"
    aria-orientation={direction === "horizontal" ? "vertical" : "horizontal"}
    aria-valuenow={Math.round(ratio * 100)}
    aria-valuemin={Math.round(min * 100)}
    aria-valuemax={Math.round(max * 100)}
    tabindex="0"
    onpointerdown={onPointerDown}
    onkeydown={onKeyDown}
  ></div>

  <div class="pane second" style:flex-basis="{(1 - ratio) * 100}%">
    {@render second()}
  </div>
</div>

<style>
  .splitter {
    display: flex;
    width: 100%;
    height: 100%;
    overflow: hidden;
  }

  .splitter.horizontal {
    flex-direction: row;
  }

  .splitter.vertical {
    flex-direction: column;
  }

  .pane {
    overflow: auto;
    min-width: 0;
    min-height: 0;
  }

  .pane.first {
    flex-grow: 0;
    flex-shrink: 0;
  }

  .pane.second {
    flex-grow: 1;
    flex-shrink: 1;
  }

  /* ===== Ручка ===== */
  .handle {
    flex: 0 0 auto;
    background: var(--border, #e0e0e0);
    transition: background 0.15s;
    touch-action: none; /* чтобы тач не скроллил страницу */
  }

  .splitter.horizontal > .handle {
    width: 6px;
    cursor: col-resize;
  }

  .splitter.vertical > .handle {
    height: 6px;
    cursor: row-resize;
  }

  .handle:hover,
  .dragging .handle {
    background: var(--primary, #4a90e2);
  }

  .handle:focus-visible {
    outline: 2px solid var(--primary, #4a90e2);
    outline-offset: -2px;
  }

  /* Пока тащим — запрещаем выделение текста везде */
  .splitter.dragging {
    user-select: none;
  }
</style>