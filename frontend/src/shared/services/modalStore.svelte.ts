import type { Component } from "svelte";

export interface ModalEntry {
  id: number;
  component: Component<any>;
  props: Record<string, any>;
  onClose?: () => void;
}

let nextId = 1;

class ModalStore {
  stack = $state<ModalEntry[]>([]);

  open(component: Component<any>, props: Record<string, any> = {}, onClose?: () => void) {
    const id = nextId++;
    this.stack.push({ id, component, props, onClose });
    return id;
  }

  close(id?: number) {
    const target = id ?? this.stack.at(-1)?.id;
    if (target == null) return;
    const idx = this.stack.findIndex(m => m.id === target);
    if (idx === -1) return;
    const [removed] = this.stack.splice(idx, 1);
    removed.onClose?.();
  }

  closeTop() {
    this.close();
  }

  get top() {
    return this.stack.at(-1) ?? null;
  }
}

export const modalStore = new ModalStore();