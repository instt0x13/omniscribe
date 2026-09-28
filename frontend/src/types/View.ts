import type { Component } from "svelte";

export interface View {
  id: string;
  title: string;
  icon?: string;
  component: Component;
}