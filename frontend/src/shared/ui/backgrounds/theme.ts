export interface ThemeColors {
  bg: string;
  panel: string;
  text: string;
  muted: string;
  primary: string;
  border: string;
  isDark: boolean;
}

const readVar = (el: HTMLElement, name: string, fallback: string) =>
  getComputedStyle(el).getPropertyValue(name).trim() || fallback;

export function readTheme(el: HTMLElement = document.documentElement): ThemeColors {
  return {
    bg: readVar(el, '--bg', '#f8fafc'),
    panel: readVar(el, '--panel', '#ffffff'),
    text: readVar(el, '--text', '#0f172a'),
    muted: readVar(el, '--muted', '#64748b'),
    primary: readVar(el, '--primary', '#2563eb'),
    border: readVar(el, '--border', '#e2e8f0'),
    isDark: el.getAttribute('data-theme') === 'dark',
  };
}

/** Подписка на смену data-theme / class / style на <html> */
export function watchTheme(cb: (c: ThemeColors) => void): () => void {
  const el = document.documentElement;
  const notify = () => cb(readTheme(el));

  const mo = new MutationObserver(notify);
  mo.observe(el, { attributes: true, attributeFilter: ['data-theme', 'class', 'style'] });

  // на всякий случай — matchMedia, если тема переключается через prefers-color-scheme
  const mq = window.matchMedia('(prefers-color-scheme: dark)');
  mq.addEventListener?.('change', notify);

  return () => {
    mo.disconnect();
    mq.removeEventListener?.('change', notify);
  };
}

/** '#rrggbb' -> [r, g, b] в 0..1 */
export function hexToRgb01(hex: string): [number, number, number] {
  const m = hex.replace('#', '');
  const s = m.length === 3 ? m.split('').map(c => c + c).join('') : m;
  const n = parseInt(s, 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}

/** '#rrggbb' -> 'r, g, b' */
export function hexToRgb255(hex: string): [number, number, number] {
  const [r, g, b] = hexToRgb01(hex);
  return [r * 255, g * 255, b * 255];
}

/** Смешать два hex, t=0 → a, t=1 → b */
export function mixHex(a: string, b: string, t: number): string {
  const [ar, ag, ab] = hexToRgb255(a);
  const [br, bg, bb] = hexToRgb255(b);
  const r = Math.round(ar + (br - ar) * t);
  const g = Math.round(ag + (bg - ag) * t);
  const bl = Math.round(ab + (bb - ab) * t);
  return `rgb(${r} ${g} ${bl})`;
}