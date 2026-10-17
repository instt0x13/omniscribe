import { css, storage } from "$helpers";
import type { ThemeMode } from "$types";
import { STORAGE_PREFIX } from "../config";

export class ThemeModeValue {
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