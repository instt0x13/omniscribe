import { css, storage } from "$helpers";
import type { ThemeMode, ThemeVarMeta } from "$types";

const STORAGE_PREFIX = "theme:";

class ThemeVarValue {
  #value: number = $state(0);
  constructor(public readonly meta: ThemeVarMeta) {
    this.#value = meta.default;
  }

  load(): void {
    const raw = storage.get(`${STORAGE_PREFIX}${this.meta.name}`);
    if (raw !== null) {
      this.#value = this.#validate(Number(raw));
      this.apply();
    }
  }

  save(): void {
    storage.set(`${STORAGE_PREFIX}${this.meta.name}`, String(this.#value));
  }

  default() {
    this.#value = this.meta.default;
    this.apply();
    this.save();
  }

  apply() {
    css.setVar(this.meta.name, this.css);
  }

  set value(v: number) {
    this.#value = this.#validate(v);
    this.apply();
    this.save();
  }

  get value(): number {
    return this.#value;
  }

  get css(): string {
    return `${this.#value}${this.meta.unit}`;
  }

  /** Проверяет значение и приводит к допустимому диапазону */
  #validate(v: number): number {
    if (!Number.isFinite(v)) return this.meta.default;
    return Math.min(this.meta.max, Math.max(this.meta.min, v));
  }
}

class ThemeModeValue {
  #value: ThemeMode = $state("system");

  load(): void {
    const raw = storage.get(`${STORAGE_PREFIX}mode`);
    if (raw !== null) {
      this.#value = this.#validate(raw);
      this.apply();
    }
  }

  save(): void {
    storage.set(`${STORAGE_PREFIX}mode`, String(this.#value));
  }

  default() {
    this.#value = "system";
    this.apply();
    this.save();
  }

  apply() {
    if (this.#value === "system") {
      css.removeDataAttr("theme");
    } else {
      css.setDataAttr("theme", this.#value);
    }
  }

  set value(v: ThemeMode) {
    this.#value = v;
    this.apply();
    this.save();
  }

  get value(): ThemeMode {
    return this.#value;
  }

  #validate(v: string): ThemeMode {
    return v === "light" || v === "dark" || v === "system" ? v : this.#value;
  }
}

/** Реестр переменных темы */
const THEME_VARS = {
  hue:      { name: "--hue",       min: 0,  max: 360, step: 1,    default: 220, unit: "deg" },
  sat:      { name: "--sat",       min: 0,  max: 100, step: 1,    default: 70,  unit: "%"   },
  primaryH: { name: "--primary-h", min: 0,  max: 360, step: 1,    default: 220, unit: "deg" },
  primaryS: { name: "--primary-s", min: 0,  max: 100, step: 1,    default: 70,  unit: "%"   },
  alpha:    { name: "--alpha",     min: 0,  max: 1,   step: 0.01, default: 1,   unit: ""    },
  contrast: { name: "--contrast",  min: 0,  max: 1,   step: 0.01, default: 1,   unit: ""    },
  radius:   { name: "--radius",    min: 0,  max: 32,  step: 1,    default: 8,   unit: "px"  },
  fontSize: { name: "--font-size", min: 12, max: 24,  step: 1,    default: 16,  unit: "px"  },
} as const satisfies Record<string, ThemeVarMeta>;

class Theme {
  hue      = new ThemeVarValue(THEME_VARS.hue);
  sat      = new ThemeVarValue(THEME_VARS.sat);
  primaryH = new ThemeVarValue(THEME_VARS.primaryH);
  primaryS = new ThemeVarValue(THEME_VARS.primaryS);
  alpha    = new ThemeVarValue(THEME_VARS.alpha);
  contrast = new ThemeVarValue(THEME_VARS.contrast);
  radius   = new ThemeVarValue(THEME_VARS.radius);
  fontSize = new ThemeVarValue(THEME_VARS.fontSize);
  mode     = new ThemeModeValue();

  #vars() {
    return [
      this.hue,      this.sat,      this.primaryH,
      this.primaryS, this.alpha,    this.contrast,
      this.radius,   this.fontSize, this.mode
    ];
  }
  
  init() { for (const v of this.#vars()) v.load(); }
  reset() { for (const v of this.#vars()) v.default(); }

}

export const theme = new Theme();