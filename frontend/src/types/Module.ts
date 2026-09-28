import type { Component } from "svelte";
import type { View } from "./View";

export interface Module {
  id: string;
  title: string;
  icon?: string;
  
  layerViews?: View[];
  routeViews?: View[];
  settingsViews?: View[];
}