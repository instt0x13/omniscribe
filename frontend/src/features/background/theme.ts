// frontend/src/shared/ui/backgrounds/theme.ts

export interface ThemeColors {
  bg: string; panel: string; text: string; muted: string;
  primary: string; primaryHover: string; border: string;
  backdrop: string; backdropText: string; isDark: boolean;
}

export const FALLBACK_THEME: ThemeColors = {
  bg: '#f8fafc', panel: '#ffffff', text: '#0f172a', muted: '#64748b',
  primary: '#2563eb', primaryHover: '#1d4ed8', border: '#e2e8f0',
  backdrop: 'rgba(0,0,0,.4)', backdropText: '#f8fafc', isDark: false,
};

const VARS = {
  bg: '--bg', panel: '--panel', text: '--text', muted: '--muted',
  primary: '--primary', primaryHover: '--primary-hover', border: '--border',
  backdrop: '--backdrop', backdropText: '--backdrop-text',
} as const;

export function readTheme(el = document.documentElement): ThemeColors {
  if (typeof window === 'undefined') return FALLBACK_THEME;
  const cs = getComputedStyle(el);
  const t = {} as ThemeColors;
  for (const k in VARS) {
    const key = k as keyof typeof VARS;
    t[key] = cs.getPropertyValue(VARS[key]).trim() || FALLBACK_THEME[key];
  }
  const attr = el.getAttribute('data-theme');
  t.isDark = attr === 'dark'
    || (attr !== 'light' && !!window.matchMedia?.('(prefers-color-scheme: dark)').matches);
  return t;
}

/* === Один watcher на всё приложение === */

type Listener = (t: ThemeColors) => void;
let current: ThemeColors | null = null;
const listeners = new Set<Listener>();
let watching = false;

function emit() {
  current = readTheme();
  for (const l of listeners) l(current);
}

function startWatching() {
  if (watching || typeof window === 'undefined') return;
  watching = true;
  const el = document.documentElement;
  // только data-theme — этого достаточно в 99% случаев
  new MutationObserver(emit).observe(el, {
    attributes: true, attributeFilter: ['data-theme'],
  });
  // style может меняться при переключении через inline — оставим, но редко
  window.matchMedia?.('(prefers-color-scheme: dark)').addEventListener?.('change', emit);
  emit();
}

export function watchTheme(cb: Listener): () => void {
  if (!listeners.size) startWatching();
  else if (current) cb(current);       // мгновенно отдаём кэш
  listeners.add(cb);
  return () => listeners.delete(cb);
}

/* === Кэш цветов === */

const rgbCache = new Map<string, [number, number, number]>();

export function colorToRgb01(input: string): [number, number, number] {
  const hit = rgbCache.get(input);
  if (hit) return hit;

  let out: [number, number, number] = [0, 0, 0];
  if (input.charCodeAt(0) === 35 /* # */) {
    const m = input.slice(1);
    const full = m.length === 3 ? m[0]+m[0]+m[1]+m[1]+m[2]+m[2] : m;
    const n = parseInt(full, 16);
    if (n === n) out = [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
  } else if (typeof document !== 'undefined') {
    const el = document.createElement('div');
    el.style.color = input;
    document.body.appendChild(el);
    const c = getComputedStyle(el).color;
    el.remove();
    const p = c.match(/[\d.]+/g);
    if (p) out = [+p[0] / 255, +p[1] / 255, +p[2] / 255];
  }
  rgbCache.set(input, out);
  return out;
}