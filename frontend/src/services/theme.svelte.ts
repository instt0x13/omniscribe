/** CSS-переменные, которыми управляет тема */
export const CSS_VARS = [
  "--hue",
  "--primary-h",
  "--sat",
  "--primary-s",
  "--alpha",
  "--radius",
] as const;

export type ThemeVar = (typeof CSS_VARS)[number];

/** Состояние темы — набор значений по переменным */
export type ThemeState = Partial<Record<ThemeVar, string | number>>;

export type ThemeMode = "light" | "dark" | "system";

class Theme {
  /** Текущее состояние CSS-переменных */
  #state = $state<ThemeState>({});

  /** Режим темы */
  #mode = $state<ThemeMode>("system");

  nameSetting = {
    state: "theme.state",
    mode: "theme.mode",
  } as const;

  get mode() {
    return this.#mode;
  }

  /** Установить режим темы */
  set mode(mode: ThemeMode) {
    this.#mode = mode as ThemeMode ?? "system";
    if (typeof document !== "undefined") {
      const root = document.documentElement;
      if (this.#mode === "system") {
        root.removeAttribute("data-theme");
      } else {
        root.setAttribute("data-theme", this.#mode);
      }
    }
  }

  setMode(mode: string) {
    this.mode = mode as ThemeMode ?? "system";
  }

  /** Проставить одну CSS-переменную и сразу применить */
  set(name: ThemeVar, value: string | number) {
    this.#state = {
      ...this.#state,
      [name]: value,
    };

    if (typeof document !== "undefined") {
      document.documentElement.style.setProperty(name, String(value));
    }
  }

  /** Проставить несколько CSS-переменных разом */
  patch(values: ThemeState) {
    this.#state = {
      ...this.#state,
      ...values,
    };

    if (typeof document === "undefined") return;

    const root = document.documentElement.style;

    for (const [name, value] of Object.entries(values)) {
      root.setProperty(name, String(value));
    }
  }

  /**
   * Применить набор CSS-переменных целиком.
   * Не трогает mode.
   */
  apply(values: ThemeState) {
    this.#state = {
      ...values,
    };

    if (typeof document === "undefined") return;

    const root = document.documentElement.style;

    for (const [name, value] of Object.entries(values)) {
      root.setProperty(name, String(value));
    }
  }

  /** Снять текущее состояние с :root в JSON-строку */ 
  toJSON(): string {
    if (typeof document === "undefined") return JSON.stringify(this.#state);
    const cs = getComputedStyle(document.documentElement);
    const out: Record<string, string> = {};
    for (const name of CSS_VARS) {
      const v = cs.getPropertyValue(name).trim();
      if (v) out[name] = v;
    }
    return JSON.stringify(out);
  }

  /** Загрузить тему из JSON-строки */ 
  fromJSON(json: string) {
    let parsed: unknown;
    try {
      parsed = JSON.parse(json);
    } catch {
      return;
    }
    if (!parsed || typeof parsed !== "object") return;
    const values: ThemeState = {};
    for (const [k, v] of Object.entries(parsed as Record<string, unknown>)) {
      if (
        (CSS_VARS as readonly string[]).includes(k) &&
        (typeof v === "string" || typeof v === "number")
      ) {
        values[k as ThemeVar] = v;
      }
    }
    this.apply(values);
  }
}
export const theme = new Theme();
