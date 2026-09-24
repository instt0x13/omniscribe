import type { Component } from "svelte";
import GradientBlobs from "./GradientBlobs.svelte";
import Particles from "./Particles.svelte";
import Shader from "./Shader.svelte";

export const SETTING_NAME = "background-type:";

export const backgrounds = {
  none: { title: "Без фона", component: null},
  gradientBlobs: { title: "Метасферы", component: GradientBlobs},
  particles: { title: "Звёздная пыль", component: Particles},
  shader: { title: "Живой дым", component: Shader},
} as const satisfies Record<string, { 
  title: string, 
  component: Component | null
}>;

export type Background = keyof typeof backgrounds;