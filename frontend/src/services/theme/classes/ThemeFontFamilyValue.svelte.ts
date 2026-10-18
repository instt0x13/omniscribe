import { css, storage } from "$helpers";
import { STORAGE_PREFIX } from "../config";

/** Допустимые ключи и соответствующие CSS-стеки для --font-family */
const FONT_FAMILIES = {
  system: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
  sans:   'ui-sans-serif, system-ui, sans-serif',
  serif:  'ui-serif, Georgia, Cambria, "Times New Roman", serif',
  mono:   'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
} as const;

type FontFamilyKey = keyof typeof FONT_FAMILIES;

export class ThemeFontFamilyValue {
  #value: FontFamilyKey = $state("system");

  /** Список допустимых значений — для `<select>` / `{#each}` */
  readonly options: readonly FontFamilyKey[] = Object.keys(FONT_FAMILIES) as FontFamilyKey[];

  load(): void {
    const raw = storage.get(`${STORAGE_PREFIX}font-family`);
    if (raw !== null) {
      this.#value = this.#validate(raw);
      this.apply();
    }
  }

  save(): void {
    storage.set(`${STORAGE_PREFIX}font-family`, String(this.#value));
  }

  default() {
    this.#value = "system";
    this.apply();
    this.save();
  }

  apply() {
    css.setVar("--font-family", this.css);
  }

  set value(v: FontFamilyKey) {
    this.#value = v;
    this.apply();
    this.save();
  }

  get value(): FontFamilyKey {
    return this.#value;
  }

  get css(): string {
    return FONT_FAMILIES[this.#value];
  }

  #validate(v: string): FontFamilyKey {
    return v in FONT_FAMILIES ? (v as FontFamilyKey) : this.#value;
  }
}