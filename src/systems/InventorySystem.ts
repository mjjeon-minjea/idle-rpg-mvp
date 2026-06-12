import type { InventoryEntry } from "../types/GameTypes";

export class InventorySystem {
  private readonly entries = new Map<string, number>();

  constructor(initialEntries: InventoryEntry[] = []) {
    for (const entry of initialEntries) {
      this.addItem(entry.itemId, entry.quantity);
    }
  }

  addItem(itemId: string, quantity: number): void {
    if (quantity <= 0) {
      return;
    }

    this.entries.set(itemId, (this.entries.get(itemId) ?? 0) + quantity);
  }

  list(): InventoryEntry[] {
    return Array.from(this.entries, ([itemId, quantity]) => ({ itemId, quantity }));
  }
}
