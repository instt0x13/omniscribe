export interface ThemeColors {
  bg: string;
  panel: string;
  text: string;
  muted: string;
  primary: string;
  primaryHover: string;
  border: string;
  backdrop: string;
  backdropText: string;
  isDark: boolean;
}

/** Базовые параметры, из которых выводятся цвета */
export interface ThemeParams {
  hue: number;
  primaryH: number;
  primaryS: number;
  sat: number;
  mode: number;   // 1 = light, 0 = dark
  radius: number;
}

/** Фолбэк для SSR / случаев, когда CSS ещё не применён */
export const FALLBACK_THEME: ThemeColors = {
  bg: '#f8fafc',
  panel: '#ffffff',
  text: '#0f172a',
  muted: '#64748b',
  primary: '#2563eb',
  primaryHover: '#1d4ed8',
  border: '#e2e8f0',
  backdrop: 'rgba(0, 0, 0, 0.4)',
  backdropText: '#f8fafc',
  isDark: false,
};

const readVar = (el: HTMLElement, name: string, fallback: string) => {
  const v = getComputedStyle(el).getPropertyValue(name).trim();
  return v || fallback;
};

const readNum = (el: HTMLElement, name: string, fallback: number) => {
  const raw = getComputedStyle(el).getPropertyValue(name).trim();
  const n = parseFloat(raw);
  return Number.isFinite(n) ? n : fallback;
};

const isDarkAttr = (el: HTMLElement): boolean => {
  const attr = el.getAttribute('data-theme');
  if (attr === 'dark') return true;
  if (attr === 'light') return false;
  if (typeof window === 'undefined') return false;
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;
};

/** Читает базовые параметры темы из CSS-переменных */
export function readParams(el: HTMLElement = document.documentElement): ThemeParams {
  const dark = isDarkAttr(el);
  return {
    hue: readNum(el, '--hue', 220),
    primaryH: readNum(el, '--primary-h', 220),
    primaryS: readNum(el, '--primary-s', 80),
    sat: readNum(el, '--sat', 40),
    mode: readNum(el, '--mode', dark ? 0 : 1),
    radius: readNum(el, '--radius', 8),
  };
}

/** Считает цвета из базовых параметров (порт CSS-формул) */
export function computeColors(p: ThemeParams): Omit<ThemeColors, 'isDark'> {
  const { hue, primaryH, primaryS, sat, mode } = p;

  const hsl = (h: number, s: number, l: number, a?: number) =>
    a === undefined
      ? `hsl(${h} ${s}% ${l}%)`
      : `hsl(${h} ${s}% ${l}% / ${a})`;

  const neutralS = sat * 0.5;
  const borderS = sat * 0.6;
  const textS = sat * 0.7;

  return {
    // формула: dark_value + mode * (light_value - dark_value)
    bg: hsl(hue, neutralS, 10 + mode * 88),          // 10% → 98%
    panel: hsl(hue, neutralS, 12 + mode * 88),       // 12% → 100%
    border: hsl(hue, borderS, 20 + mode * 70),       // 20% → 90%
    text: hsl(hue, textS, 97 - mode * 85),           // 97% → 12%
    muted: hsl(hue, textS, 60 - mode * 15),          // 60% → 45%
    primary: hsl(primaryH, primaryS, 47 + mode * 8), // 47% → 55%
    primaryHover: hsl(primaryH, primaryS, 53 - mode * 8), // 53% → 45%
    backdrop: hsl(0, 0, 0, 0.7 - mode * 0.3),        // α 0.7 → 0.4
    backdropText: hsl(hue, 30, 97),
  };
}

/** Полный ридер: сначала CSS-переменные, при отсутствии — расчёт */
export function readTheme(el: HTMLElement = document.documentElement): ThemeColors {
  if (typeof window === 'undefined') return FALLBACK_THEME;

  const params = readParams(el);
  const computed = computeColors(params);
  const isDark = params.mode < 0.5;

  return {
    bg: readVar(el, '--bg', computed.bg),
    panel: readVar(el, '--panel', computed.panel),
    text: readVar(el, '--text', computed.text),
    muted: readVar(el, '--muted', computed.muted),
    primary: readVar(el, '--primary', computed.primary),
    primaryHover: readVar(el, '--primary-hover', computed.primaryHover),
    border: readVar(el, '--border', computed.border),
    backdrop: readVar(el, '--backdrop', computed.backdrop),
    backdropText: readVar(el, '--backdrop-text', computed.backdropText),
    isDark,
  };
}

/** Подписка на смену data-theme / class / style на <html> */
export function watchTheme(cb: (c: ThemeColors) => void): () => void {
  if (typeof window === 'undefined') return () => {};

  const el = document.documentElement;
  const notify = () => cb(readTheme(el));

  const mo = new MutationObserver(notify);
  mo.observe(el, {
    attributes: true,
    attributeFilter: ['data-theme', 'class', 'style'],
  });

  const mq = window.matchMedia('(prefers-color-scheme: dark)');
  mq.addEventListener?.('change', notify);

  notify(); // сразу отдаём текущую тему

  return () => {
    mo.disconnect();
    mq.removeEventListener?.('change', notify);
  };
}

/* === Парсеры цветов: работают с hex, rgb(), hsl() === */

function hslToRgb255(h: number, s: number, l: number): [number, number, number] {
  const hh = (((h % 360) + 360) % 360) / 360;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + hh * 12) % 12;
    return l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1));
  };
  return [
    Math.round(f(0) * 255),
    Math.round(f(8) * 255),
    Math.round(f(4) * 255),
  ];
}

/** Любой CSS-цвет → [r, g, b] в 0..255 */
export function parseColorToRgb255(input: string): [number, number, number] {
  const s = input.trim();

  if (s.startsWith('#')) {
    const m = s.slice(1);
    const full = m.length === 3 ? m.split('').map((c) => c + c).join('') : m;
    const n = parseInt(full, 16);
    if (!Number.isFinite(n)) return [0, 0, 0];
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }

  const rgbMatch = s.match(/^rgba?\(([^)]+)\)$/i);
  if (rgbMatch) {
    const parts = rgbMatch[1].split(/[\s,/]+/).filter(Boolean);
    return [
      Math.round(parseFloat(parts[0])),
      Math.round(parseFloat(parts[1])),
      Math.round(parseFloat(parts[2])),
    ];
  }

  const hslMatch = s.match(/^hsla?\(([^)]+)\)$/i);
  if (hslMatch) {
    const parts = hslMatch[1].split(/[\s,/]+/).filter(Boolean);
    const h = parseFloat(parts[0]);
    const sat = parseFloat(parts[1]) / 100;
    const l = parseFloat(parts[2]) / 100;
    return hslToRgb255(h, sat, l);
  }

  // фолбэк: временный элемент, чтобы браузер сам распарсил (напр. named colors)
  if (typeof document !== 'undefined') {
    const el = document.createElement('div');
    el.style.color = s;
    document.body.appendChild(el);
    const computed = getComputedStyle(el).color;
    el.remove();
    if (computed && computed !== s) return parseColorToRgb255(computed);
  }
  return [0, 0, 0];
}

/** Любой CSS-цвет → [r, g, b] в 0..1 */
export function colorToRgb01(input: string): [number, number, number] {
  const [r, g, b] = parseColorToRgb255(input);
  return [r / 255, g / 255, b / 255];
}

/** Алиасы для обратной совместимости */
export function hexToRgb01(hex: string): [number, number, number] {
  return colorToRgb01(hex);
}

export function hexToRgb255(hex: string): [number, number, number] {
  return parseColorToRgb255(hex);
}

/** Смешать два CSS-цвета, t=0 → a, t=1 → b */
export function mixHex(a: string, b: string, t: number): string {
  const [ar, ag, ab] = parseColorToRgb255(a);
  const [br, bg, bb] = parseColorToRgb255(b);
  const r = Math.round(ar + (br - ar) * t);
  const g = Math.round(ag + (bg - ag) * t);
  const bl = Math.round(ab + (bb - ab) * t);
  return `rgb(${r} ${g} ${bl})`;
}