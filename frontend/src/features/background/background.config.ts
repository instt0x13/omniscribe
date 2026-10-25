import type { Component } from "svelte";
import GradientBlobs from "./backgrounds/GradientBlobs.svelte";
import Particles from "./backgrounds/Particles.svelte";
import Shader from "./backgrounds/Shader.svelte";

export const SETTING_NAME = "background-type:";

export const backgrounds = [
  { id: "none", title: "Без фона", component: null },
  { id: "gradientBlobs", title: "Метасферы", component: GradientBlobs },
  { id: "particles", title: "Звёздная пыль", component: Particles },
  { id: "shader", title: "Живой дым", component: Shader },
] as const;

// Тип для одного элемента фона
export type BackgroundItem = typeof backgrounds[number];

// Тип для ID (ключей)
export type BackgroundId = BackgroundItem["id"];