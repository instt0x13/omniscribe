import type { Module } from '$types';
import { layerViews, routeViews, settingsViews } from '$views'

/**
 * Регистрация модулей в реестрах и вызов их `init()`.
 * Вызывается один раз, до монтирования приложения.
 */
export function registerModules(modules: Module[]): void {
  // Модули → реестры
  for (const m of modules) {
    for (const l of m.layerViews ?? []) layerViews.register(l);
    for (const r of m.routeViews ?? []) routeViews.register(r);
    for (const s of m.settingsViews ?? []) settingsViews.register(s);
  }
}