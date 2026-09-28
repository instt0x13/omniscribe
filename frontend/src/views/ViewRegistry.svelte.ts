import { type View } from "$types";

/**
 * Реестр представлений.
 *
 * Порядок = порядок регистрации.
 * Иерархия задаётся порядком модулей при инициализации приложения.
 */
export class ViewRegistry {
  #items = $state<View[]>([]);

  register(view: View): void {
    if (this.#items.some((v) => v.id === view.id)) {
      console.warn(`View с id "${view.id}" уже зарегистрирован.`);
      return;
    }
    this.#items.push(view);
  }

  get items(): readonly View[] {
    return this.#items;
  }
}