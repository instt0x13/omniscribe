class LocalStorage  {
  get(name: string): string | null {
    try {
      return window.localStorage.getItem(name);
    } catch {
      return null;
    }
  }

  set(name: string, value: string): void {
    try {
      window.localStorage.setItem(name, value);
    } catch {
      // quota / private mode / disabled
    }
  }

  remove(name: string): void {
    try {
      window.localStorage.removeItem(name);
    } catch {
      // ignore
    }
  }
}

export const storage = new LocalStorage ();