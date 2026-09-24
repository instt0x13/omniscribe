<script lang="ts">
  import { onMount } from 'svelte';
  import { readTheme, watchTheme, FALLBACK_THEME, type ThemeColors } from './theme';

  let canvas: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D | null = null;

  interface P { x: number; y: number; vx: number; vy: number; r: number; c: string; }

  const COUNT = 60;
  const MAX_DIST2 = 150 * 150;
  const SPEED = 0.35;
  const MOUSE_R = 160;
  const MOUSE_R2 = MOUSE_R * MOUSE_R;

  let particles: P[] = [];
  let w = 0, h = 0;
  let mx = -1e4, my = -1e4;
  let theme: ThemeColors = FALLBACK_THEME;
  let raf = 0;
  let running = false;
  let reduced = false;

  function build() {
    const c = [theme.primary, theme.text, theme.muted];
    particles = Array.from({ length: COUNT }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * SPEED,
      vy: (Math.random() - 0.5) * SPEED,
      r: Math.random() * 2 + 1,
      c: c[(Math.random() * 3) | 0],
    }));
  }

  function resize() {
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = w;
    canvas.height = h;
    for (const p of particles) {
      if (p.x > w) p.x = w;
      if (p.y > h) p.y = h;
    }
  }

  function draw() {
    if (!ctx) return;
    ctx.clearRect(0, 0, w, h);

    const da = theme.isDark ? 0.85 : 0.7;
    const la = theme.isDark ? 0.25 : 0.18;

    for (const p of particles) {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > w) p.vx = -p.vx;
      if (p.y < 0 || p.y > h) p.vy = -p.vy;

      const dx = p.x - mx, dy = p.y - my;
      const d2 = dx * dx + dy * dy;
      if (d2 < MOUSE_R2 && d2 > 1) {
        const d = Math.sqrt(d2);
        const f = (MOUSE_R - d) / MOUSE_R;
        p.x += (dx / d) * f * 2.5;
        p.y += (dy / d) * f * 2.5;
      }
    }

    // связи
    ctx.lineWidth = 1;
    for (let i = 0; i < COUNT; i++) {
      const a = particles[i];
      for (let j = i + 1; j < COUNT; j++) {
        const b = particles[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < MAX_DIST2) {
          ctx.globalAlpha = (1 - Math.sqrt(d2) / 150) * la;
          ctx.strokeStyle = a.c;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }

    // точки
    ctx.globalAlpha = da;
    for (const p of particles) {
      ctx.fillStyle = p.c;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, 6.2832);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    if (running) raf = requestAnimationFrame(draw);
  }

  function onPointer(e: PointerEvent) { mx = e.clientX; my = e.clientY; }

  function start() { if (!running) { running = true; raf = requestAnimationFrame(draw); } }
  function stop()  { running = false; cancelAnimationFrame(raf); }

  onMount(() => {
    ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    theme = readTheme();
    reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    resize();
    build();
    if (reduced) draw(); else start();

    const onVis = () => document.hidden ? stop() : (reduced ? draw() : start());
    const onResize = () => { resize(); if (reduced) draw(); };

    window.addEventListener('resize', onResize);
    window.addEventListener('pointermove', onPointer, { passive: true });
    document.addEventListener('visibilitychange', onVis);

    const unwatch = watchTheme((c) => {
      theme = c;
      const cols = [c.primary, c.text, c.muted];
      for (const p of particles) p.c = cols[(Math.random() * 3) | 0];
      if (!running) draw();
    });

    return () => {
      stop();
      window.removeEventListener('resize', onResize);
      window.removeEventListener('pointermove', onPointer);
      document.removeEventListener('visibilitychange', onVis);
      unwatch();
    };
  });
</script>

<canvas bind:this={canvas} class="bg"></canvas>

<style>
  .bg {
    position: fixed; inset: 0; z-index: -1; display: block;
    pointer-events: none; background: var(--bg);
  }
</style>