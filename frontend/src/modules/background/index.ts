import type { Module } from "$types";
import BackgroundShow from "./BackgroundShow.svelte";
import SettingsPage from "./SettingsPage.svelte";

export const backgroundModule: Module = {
  id: "background",
  title: "Фон",
  layerViews: [
    { id: "background", title: "Фон", component: BackgroundShow },
  ],
  settingsViews: [
    { id: "background", title: "Фон", component: SettingsPage },
  ],
};