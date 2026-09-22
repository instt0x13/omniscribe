<script lang="ts">
  import { onMount } from 'svelte';
  import {
    readTheme,
    watchTheme,
    colorToRgb01,
    FALLBACK_THEME,
    type ThemeColors,
  } from './theme';

  interface Props {
    /** Основной цвет фона. По умолчанию берётся --bg темы */
    base?: string;
    /** Набор цветов «пятен». По умолчанию берётся из темы */
    colors?: [string, string, string];
    /** Базовая прозрачность пятен */
    opacity?: number;
  }

  let { base, colors, opacity = 0.6 }: Props = $props();

  let theme: ThemeColors = FALLBACK_THEME;

  const themeValues = $derived.by(() => {
    const t = theme;
    const auto: [string, string, string] = t.isDark
      ? [t.primary, t.primaryHover, t.muted]
      : [t.primary, t.primaryHover, t.muted];
    return {
      colors: colors ?? auto,
      opacity: opacity * (t.isDark ? 0.5 : 0.6),
    };
  });

  onMount(() => {
    theme = readTheme();
    return watchTheme((c) => (theme = c));
  });

  const blobStyle = (c: string) => {
    const [r, g, b] = colorToRgb01(c);
    const transparent = `rgba(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)}, 0)`;
    return `radial-gradient(circle at center, ${c} 0%, ${transparent} 65%)`;
  };
</script>

<!-- фон — из CSS-переменной; style:background только если явно передан base -->
<div
  class="gradient-bg"
  style:background={base ? base : undefined}
>
  <div
    class="blob blob-1"
    style:background={blobStyle(themeValues.colors[0])}
    style:opacity={themeValues.opacity}
  ></div>
  <div
    class="blob blob-2"
    style:background={blobStyle(themeValues.colors[1])}
    style:opacity={themeValues.opacity}
  ></div>
  <div
    class="blob blob-3"
    style:background={blobStyle(themeValues.colors[2])}
    style:opacity={themeValues.opacity}
  ></div>
</div>

<style>
  .gradient-bg {
    position: fixed;
    inset: 0;
    z-index: -1;
    overflow: hidden;
    /* фон — как у Particle и Shader, из темы */
    background: var(--bg);
    transition: background 0.4s ease;
  }
  .blob {
    position: absolute;
    width: 60vmax;
    height: 60vmax;
    border-radius: 50%;
    filter: blur(80px);
    will-change: transform;
    transform: translateZ(0);
  }

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