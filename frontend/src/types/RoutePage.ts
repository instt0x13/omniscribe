import type { Component } from "svelte";

export type RoutePage = {
  id: string;
  path: string;
  title: string;
  icon?: string;
  component: Component<any, any>;
  props?: Record<string, any>;
}