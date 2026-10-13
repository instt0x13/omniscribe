import type { Component } from "svelte";

export type RoutePage = {
  path: string;
  title: string;
  icon?: string;
  component: Component<any, any>;
  props?: Record<string, any>;
}