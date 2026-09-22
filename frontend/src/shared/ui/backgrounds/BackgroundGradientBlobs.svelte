<script lang="ts">
  import { onMount } from 'svelte';
  import { readTheme, watchTheme, type ThemeColors } from './theme';

  interface Props {
    /** Основной цвет фона. По умолчанию берётся --bg темы */
    base?: string;
    /** Набор цветов «пятен». По умолчанию берётся из темы */
    colors?: [string, string, string];
    /** Базовая прозрачность пятен */
    opacity?: number;
  }

  let { base, colors, opacity = 0.6 }: Props = $props();

  let theme: ThemeColors = readTheme();
  const themeValues = $derived.by(() => {
    const t = theme;
    // В тёмной теме пятна — primary/text/muted, в светлой — primary + два оттенка
    const auto: [string, string, string] = t.isDark
      ? [t.primary, t.text, t.muted]
      : [t.primary, t.muted, t.border];
    return {
      base: base ?? t.bg,
      colors: colors ?? auto,
      // в светлой теме screen даёт «выбеливание» — опускаем плотность
      opacity: opacity * (t.isDark ? 1 : 0.55),
    };
  });

  onMount(() => watchTheme((c) => (theme = c)));

  // radial-gradient как дешёвая альтернатива filter: blur()
  const blobStyle = (c: string) =>
    `radial-gradient(circle at center, ${c} 0%, ${c}00 65%)`;
</script>

<div class="gradient-bg" style:background={themeValues.base}>
  <div class="blob blob-1" style:background={blobStyle(themeValues.colors[0])} style:opacity={themeValues.opacity}></div>
  <div class="blob blob-2" style:background={blobStyle(themeValues.colors[1])} style:opacity={themeValues.opacity}></div>
  <div class="blob blob-3" style:background={blobStyle(themeValues.colors[2])} style:opacity={themeValues.opacity}></div>
</div>

<style>
  .gradient-bg {
    position: fixed;
    inset: 0;
    z-index: -1;
    overflow: hidden;
    /* filter убран — размытие уже «внутри» градиента */
    transition: background 0.4s ease;
  }
  .blob {
    position: absolute;
    width: 60vmax;
    height: 60vmax;
    border-radius: 50%;
    /* screen оставлен только для тёмной темы, см. media ниже */
    mix-blend-mode: screen;
    will-change: transform;
    /* ускоряем слой заранее */
    transform: translateZ(0);
  }
  /* На светлой теме screen выбеливает — переключаемся на multiply/normal */
  @media (prefers-color-scheme: light) {
    .blob { mix-blend-mode: multiply; }
  }
  /* Если тема задаётся через data-theme на <html> — ловим через :global на body */
  :global([data-theme="light"]) .blob { mix-blend-mode: multiply; }
  :global([data-theme="dark"]) .blob  { mix-blend-mode: screen; }

  .blob-1 { top: -10%; left: -10%; animation: move1 20s ease-in-out infinite; }
  .blob-2 { bottom: -20%; right: -10%; animation: move2 25s ease-in-out infinite; }
  .blob-3 { top: 30%; left: 40%; animation: move3 30s ease-in-out infinite; }

  @keyframes move1 {
    0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
    50%      { transform: translate3d(30vw, 20vh, 0) scale(1.2); }
  }
  @keyframes move2 {
    0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
    50%      { transform: translate3d(-25vw, -15vh, 0) scale(1.3); }
  }
  @keyframes move3 {
    0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
    50%      { transform: translate3d(-20vw, 25vh, 0) scale(0.9); }
  }

  @media (prefers-reduced-motion: reduce) {
    .blob { animation: none; }
  }
</style>