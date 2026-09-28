const STORAGE_PREFIX = "settings:";

class Settings {
  #data = $state<Record<string, string>>({});

  /**
   * Читает значение.
   * Если ключа нет в память `#data`, делает ленивую подгрузку из localStorage.
   */
  get(name: string, fallback = ""): string {
    if (name in this.#data) {
      return this.#data[name];
    }

    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(STORAGE_PREFIX + name);
      return stored ?? fallback;
    }

    return fallback;
  }

  /** Пишет значение в реактивный стор и сразу синхронизирует с localStorage */
  set(name: string, value: string): void {
    this.#data[name] = value;
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_PREFIX + name, value);
    }
  }

  /** Удаляет настройку из памяти и localStorage */
  remove(name: string): void {
    delete this.#data[name];
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_PREFIX + name);
    }
  }
}

export const settings = new Settings();