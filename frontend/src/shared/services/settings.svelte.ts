import type { Component } from "svelte";

const STORAGE_PREFIX = "settings:";

export interface SettingsPage {
  id: string;
  title: string;
  icon?: Component;
  component: Component;
  order?: number;
}

class Settings {
  #data = $state<Record<string, string>>({});
  #pages = $state<SettingsPage[]>([]);

  /**
   * Регистрация страницы настроек от фичи.
   */
  registerPage(page: SettingsPage): void {
    if (this.#pages.some((p) => p.id === page.id)) {
      console.warn(`Страница настроек с id "${page.id}" уже зарегистрирована.`);
      return;
    }
    this.#pages.push(page);
  }

  /** Список отсортированных страниц настроек для UI */
  get pages(): readonly SettingsPage[] {
    return [...this.#pages].sort((a, b) => (a.order ?? 100) - (b.order ?? 100));
  }

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