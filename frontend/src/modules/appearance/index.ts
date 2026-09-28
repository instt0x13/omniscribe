import type { Module } from "$types";
import SettingsPage from "./SettingsPage.svelte";

export const appearanceModule: Module = {
  id: "appearance",
  title: "Оформление",
  settingsViews: [
    { id: "appearance", title: "Оформление", component: SettingsPage },
  ],
};