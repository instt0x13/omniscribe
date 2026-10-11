export type ThemeVarMeta = {
  name: string,
  min: number,
  max: number,
  step: number,
  default: number,
  unit: "deg" | "px" | "%" | "",
}