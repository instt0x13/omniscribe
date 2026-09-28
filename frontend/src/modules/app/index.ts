import type { Module } from "$types";
import AppLayer from "./AppLayer.svelte";

export const appModule: Module = {
  id: "app",
  title: "Приложение",
  layerViews: [
    { id: "app", title: "Приложение", component: AppLayer },
  ],
};