import type { Module } from "$types";
import NoteList from "./ui/NoteList.svelte";
import NotesTabs from "./ui/NotesTabs.svelte";

export const noteModule: Module = {
  id: "note",
  title: "Заметки",
  routeViews: [
    { id: "list", title: "Список", icon: "📑", component: NoteList },
    { id: "tabs", title: "Вкладки", icon: "🗂️", component: NotesTabs },
  ],
};