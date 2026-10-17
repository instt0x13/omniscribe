import { css, storage } from "$helpers";
import type { ThemeVarMeta } from "$types";
import { STORAGE_PREFIX } from "../config";

export class ThemeVarValue {
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