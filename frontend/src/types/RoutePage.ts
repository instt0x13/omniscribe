import type { Component } from "svelte";

export interface RoutePage {
  path: string;
  title: string;
  icon?: string;
  component: Component;
}