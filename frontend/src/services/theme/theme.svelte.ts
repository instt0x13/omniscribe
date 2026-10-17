import type { ThemeVarMeta } from "$types";
import { ThemeModeValue } from "./classes/ThemeModeValue.svelte";
import { ThemeVarValue } from "./classes/ThemeVarValue.svelte";

/** Реестр переменных темы */
const THEME_VARS = {
  hue:      { name: "--hue",       min: 0,    max: 360,  step: 1,    default: 220, unit: "deg" },
  sat:      { name: "--sat",       min: 0,    max: 100,  step: 1,    default: 70,  unit: "%"   },
  primaryH: { name: "--primary-h", min: 0,    max: 360,  step: 1,    default: 220, unit: "deg" },
  primaryS: { name: "--primary-s", min: 0,    max: 100,  step: 1,    default: 70,  unit: "%"   },
  alpha:    { name: "--alpha",     min: 0,    max: 1,    step: 0.01, default: 1,   unit: ""    },
  contrast: { name: "--contrast",  min: 0,    max: 1,    step: 0.01, default: 1,   unit: ""    },
  radius:   { name: "--radius",    min: 0,    max: 32,   step: 1,    default: 8,   unit: "px"  },
  fontSize: { name: "--font-size", min: 0.85, max: 1.45, step: 0.01, default: 1,   unit: "rem" },
} as const satisfies Record<string, ThemeVarMeta>;

class Theme {
  mode     = new ThemeModeValue();
  hue      = new ThemeVarValue(THEME_VARS.hue);
  sat      = new ThemeVarValue(THEME_VARS.sat);
  primaryH = new ThemeVarValue(THEME_VARS.primaryH);
  primaryS = new ThemeVarValue(THEME_VARS.primaryS);
  alpha    = new ThemeVarValue(THEME_VARS.alpha);
  contrast = new ThemeVarValue(THEME_VARS.contrast);
  radius   = new ThemeVarValue(THEME_VARS.radius);
  fontSize = new ThemeVarValue(THEME_VARS.fontSize);

  #vars() {
    return [
      this.mode,     this.hue,      this.sat,
      this.primaryH, this.primaryS, this.alpha,
      this.contrast, this.radius,   this.fontSize, 
    ];
  }
  
  init() { for (const v of this.#vars()) v.load(); }
  reset() { for (const v of this.#vars()) v.default(); }

}

export const theme = new Theme();