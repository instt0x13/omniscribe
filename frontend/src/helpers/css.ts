class RootCss {
  /** Установить CSS-переменную на :root */
  setVar(name: string, value: string): void {
    document.documentElement.style.setProperty(name, value);
  }

  /**
   * Прочитать вычисленное значение CSS-переменной.
   * Возвращает "" если переменная не задана.
   */
  getVar(name: string): string {
    return getComputedStyle(document.documentElement)
      .getPropertyValue(name)
      .trim();
  }

  /** Снять CSS-переменную с :root */
  removeVar(name: string): void {
    document.documentElement.style.removeProperty(name);
  }

  /** Установить сразу пачку CSS-переменных */
  setVars(values: Record<string, string>): void {
    const style = document.documentElement.style;
    for (const [name, value] of Object.entries(values)) {
      style.setProperty(name, value);
    }
  }

  /** Снять сразу пачку CSS-переменных */
  removeVars(names: readonly string[]): void {
    const style = document.documentElement.style;
    for (const name of names) style.removeProperty(name);
  }

  /**
   * Собрать вычисленные значения перечисленных CSS-переменных.
   * В результат попадают только непустые значения.
   * (один getComputedStyle на всю пачку)
   */
  getVars(names: readonly string[]): Partial<Record<string, string>> {
    const cs = getComputedStyle(document.documentElement);
    const out: Partial<Record<string, string>> = {};
    for (const name of names) {
      const v = cs.getPropertyValue(name).trim();
      if (v) out[name] = v;
    }
    return out;
  }

  /** Установить data-атрибут на :root (name без префикса "data-") */
  setDataAttr(name: string, value: string): void {
    document.documentElement.setAttribute(`data-${name}`, value);
  }

  /** Снять data-атрибут с :root (name без префикса "data-") */
  removeDataAttr(name: string): void {
    document.documentElement.removeAttribute(`data-${name}`);
  }

  /** Считать data-атрибут с :root (name без префикса "data-"). null — если нет. */
  getDataAttr(name: string): string | null {
    return document.documentElement.getAttribute(`data-${name}`);
  }
}

export const css = new RootCss();