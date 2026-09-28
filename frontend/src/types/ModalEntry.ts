import type { Component } from "svelte";

export interface ModalEntry {
  id: number;
  component: Component<any>;
  props: Record<string, any>;
  onClose?: () => void;
}