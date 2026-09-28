import type { Module } from "$types";
import ModalHost from "./ModalHost.svelte";

export const modalModule: Module = {
  id: "modal",
  title: "Модалка",
  layerViews: [
    { id: "modal", title: "Модалка", component: ModalHost },
  ],
};