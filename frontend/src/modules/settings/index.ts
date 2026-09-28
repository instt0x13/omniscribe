// module/settings/index.ts
import type { Module } from "$types";
import SettingsPage from "./SettingsPage.svelte";

export const settingsModule: Module = {
  id: "settings",
  title: "Настройки",
  icon: "⚙️",
  routeViews: [
    { id: "settings", title: "Настройки", icon: "⚙️", component: SettingsPage },
  ],
};