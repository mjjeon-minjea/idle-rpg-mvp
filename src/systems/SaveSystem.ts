import type { SaveData } from "../types/GameTypes";

export class SaveSystem {
  private readonly key = "idle-rpg-mvp-save";

  load(): SaveData | null {
    const raw = window.localStorage.getItem(this.key);
    if (!raw) {
      return null;
    }

    try {
      return JSON.parse(raw) as SaveData;
    } catch {
      return null;
    }
  }

  save(data: SaveData): void {
    window.localStorage.setItem(this.key, JSON.stringify(data));
  }
}
