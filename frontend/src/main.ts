import { mount } from 'svelte'
import './app.css'
import { appearanceModule, appModule, backgroundModule, modalModule, noteModule, settingsModule } from '$modules';
import type { Module } from '$types';
import LayerDraw from './LayerDraw.svelte';
import { registerModules } from './registerModules';

/**
 * Состав приложения.
 *
 * Порядок в массиве = порядок инициализации = порядок слоёв в DOM.
 * Слои снизу вверх: фон → приложение → то, что перекрывает приложение.
 * Модули без `layer` (только routes/settings) — в конце, их порядок не важен.
 *
 * Чтобы добавить фичу — добавь модуль сюда.
 * Чтобы изменить иерархию — поменяй порядок.
 */
const modules: Module[] = [
  backgroundModule,
  appModule,
  modalModule,
  noteModule,
  appearanceModule,
  settingsModule,
];

registerModules(modules);

const app = mount(LayerDraw, {
  target: document.getElementById('app')!,
})

export default app
