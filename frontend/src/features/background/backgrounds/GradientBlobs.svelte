<div class="bg" aria-hidden="true"></div>

<style>
  .bg {
    position: fixed;
    inset: 0;
    overflow: hidden;
    background: color-mix(in srgb, var(--primary) 10%, var(--bg));
  }

  /* blob'ы */
  .bg::before {
    content: "";
    position: absolute;
    inset: -60%;
    background:
      radial-gradient(circle 35vmax at 40% 40%, hsl(from var(--primary) h s l / 1), transparent 40%),
      radial-gradient(circle 45vmax at 60% 60%, hsl(from var(--accent) h s l / 1),  transparent 40%),
      radial-gradient(circle 65vmax at 50% 45%, hsl(from var(--text) h s l / 1),   transparent 40%);
    opacity: 0.5;
    animation: drift 40s ease-in-out infinite alternate;
    will-change: transform;
  }

  @keyframes drift {
    0% {
      transform: translate(-3%, -3%) rotate(0deg) scale(1);
    }
    50% {
      transform: translate(3%, 4%) rotate(180deg) scale(1.15);
    }
    100% {
      transform: translate(-4%, 2%) rotate(360deg) scale(0.95);
    }
  }

  @media (prefers-color-scheme: dark) {
    .bg::after  { opacity: 0; }
    .bg::before { opacity: 0.35; }
  }

  @media (prefers-reduced-motion: reduce) {
    .bg::before { animation: none; }
  }
</style>