<script lang="ts">
  import { onMount } from 'svelte';
  import { readTheme, watchTheme, FALLBACK_THEME, type ThemeColors } from './theme';

  let canvas: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D | null = null;

  interface Point { x: number; y: number; }
  interface Particle extends Point {
    vx: number;
    vy: number;
    r: number;
    color: string;
  }

  const CONFIG = {
    count: 80,
    maxDist: 150,
    speed: 0.4,
    mouseRadius: 180,
  };

  let particles: Particle[] = [];
  let mouse: Point = { x: -1000, y: -1000 };
  let width = 0;
  let height = 0;
  let theme: ThemeColors = FALLBACK_THEME;
  let raf = 0;
  let running = false;
  let reducedMotion = false;

  const palette = () => [theme.primary, theme.text, theme.muted];
  const lineAlpha = () => (theme.isDark ? 0.25 : 0.18);
  const dotAlpha = () => (theme.isDark ? 0.85 : 0.7);

  function resize(): void {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);

    // если окно уменьшилось — подтягиваем частицы внутрь
    for (const p of particles) {
      if (p.x > width) p.x = width;
      if (p.y > height) p.y = height;
    }
  }

  function initParticles(): void {
    const colors = palette();
    particles = Array.from({ length: CONFIG.count }, (): Particle => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * CONFIG.speed,
      vy: (Math.random() - 0.5) * CONFIG.speed,
      r: Math.random() * 2 + 1,
      color: colors[(Math.random() * colors.length) | 0],
    }));
  }

  function draw(): void {
    if (!ctx) return;
    ctx.clearRect(0, 0, width, height);

    const da = dotAlpha();
    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;

      const dx = p.x - mouse.x;
      const dy = p.y - mouse.y;
      const dist = Math.hypot(dx, dy);
      if (dist < CONFIG.mouseRadius && dist > 0) {
        const force = (CONFIG.mouseRadius - dist) / CONFIG.mouseRadius;
        p.x += (dx / dist) * force * 2;
        p.y += (dy / dist) * force * 2;
      }

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = da;
      ctx.fill();
    }

    const la = lineAlpha();
    for (let i = 0; i < particles.length; i++) {
      const a = particles[i];
      for (let j = i + 1; j < particles.length; j++) {
        const b = particles[j];
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d < CONFIG.maxDist) {
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = a.color;
          ctx.globalAlpha = (1 - d / CONFIG.maxDist) * la;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }
    ctx.globalAlpha = 1;
    if (running) raf = requestAnimationFrame(draw);
  }

  const onMouseMove = (e: MouseEvent) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  };

  onMount(() => {
    ctx = canvas.getContext('2d');
    if (!ctx) return;

    theme = readTheme();

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    reducedMotion = reduced.matches;

    resize();
    initParticles();

    running = !reducedMotion;
    if (running) raf = requestAnimationFrame(draw);
    else draw(); // один кадр

    const onVis = () => {
      if (document.hidden) {
        running = false;
        cancelAnimationFrame(raf);
      } else if (reducedMotion) {
        // перерисуем статичный кадр — вдруг был resize
        resize();
        draw();
      } else {
        running = true;
        raf = requestAnimationFrame(draw);
      }
    };

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', onMouseMove);
    document.addEventListener('visibilitychange', onVis);

    const unwatch = watchTheme((c) => {
      theme = c;
      initParticles();
      if (!running) draw();
    });

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('visibilitychange', onVis);
      unwatch();
    };
  });
</script>

<canvas bind:this={canvas} class="bg"></canvas>

<style>
  .bg {
    position: fixed;
    inset: 0;
    z-index: -1;
    display: block;
    pointer-events: none;
    /* фон из темы, а не хардкод */
    background: var(--bg);
    transition: background 0.3s ease;
  }
</style>