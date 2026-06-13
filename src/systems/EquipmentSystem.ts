import type {
  EffectivePlayerStats,
  EquipResult,
  EquippedItemView,
  EquipmentSlot,
  EquipmentState,
  EquipmentStatBonus,
  ItemData,
  PlayerState,
  UnequipResult,
} from "../types/GameTypes";
import { InventorySystem } from "./InventorySystem";

const EQUIPMENT_SLOTS: EquipmentSlot[] = ["weapon", "armor", "accessory"];

export class EquipmentSystem {
  private readonly equipped: Partial<Record<EquipmentSlot, string>>;
  private readonly itemsById: Map<string, ItemData>;

  constructor(items: ItemData[], initialState?: EquipmentState) {
    this.itemsById = new Map(items.map((item) => [item.id, item]));
    this.equipped = { ...(initialState?.equipped ?? {}) };
  }

  equip(itemId: string, inventory: InventorySystem): EquipResult {
    const item = this.itemsById.get(itemId);
    if (!item) {
      return { success: false, reason: "item_not_found" };
    }

    if (!inventory.hasItem(itemId, 1)) {
      return { success: false, reason: "not_owned" };
    }

    if (item.type !== "equipment" || !item.equipment) {
      return { success: false, reason: "not_equipment" };
    }

    if (!this.isValidSlot(item.equipment.slot)) {
      return { success: false, reason: "invalid_slot" };
    }

    const replacedItemId = this.equipped[item.equipment.slot];
    this.equipped[item.equipment.slot] = item.id;

    return {
      success: true,
      equippedItemId: item.id,
      replacedItemId: replacedItemId === item.id ? undefined : replacedItemId,
    };
  }

  unequip(slot: EquipmentSlot, player: PlayerState): UnequipResult {
    if (!this.isValidSlot(slot)) {
      return { success: false, reason: "invalid_slot" };
    }

    const unequippedItemId = this.equipped[slot];
    if (!unequippedItemId) {
      return { success: false, reason: "slot_empty" };
    }

    delete this.equipped[slot];
    const effectiveStats = this.calculateEffectiveStats(player);
    if (player.hp > effectiveStats.maxHp) {
      player.hp = effectiveStats.maxHp;
    }

    return { success: true, unequippedItemId };
  }

  calculateEffectiveStats(player: PlayerState): EffectivePlayerStats {
    const bonus = this.getEquipmentBonus();
    return {
      maxHp: player.maxHp + bonus.maxHp,
      attack: player.attack + bonus.attack,
      defense: player.defense + bonus.defense,
    };
  }

  getEquipmentBonus(): EquipmentStatBonus {
    const bonus = { maxHp: 0, attack: 0, defense: 0 };

    for (const itemId of Object.values(this.equipped)) {
      if (!itemId) {
        continue;
      }

      const item = this.itemsById.get(itemId);
      if (!item?.equipment) {
        continue;
      }

      bonus.maxHp += item.equipment.stats.maxHp;
      bonus.attack += item.equipment.stats.attack;
      bonus.defense += item.equipment.stats.defense;
    }

    return bonus;
  }

  getEquippedItems(): EquippedItemView[] {
    return EQUIPMENT_SLOTS.map((slot) => {
      const itemId = this.equipped[slot] ?? null;
      const item = itemId ? this.itemsById.get(itemId) : undefined;

      return {
        slot,
        itemId,
        name: item?.name ?? "비어 있음",
      };
    });
  }

  toState(): EquipmentState {
    return {
      equipped: { ...this.equipped },
    };
  }

  private isValidSlot(slot: string): slot is EquipmentSlot {
    return EQUIPMENT_SLOTS.includes(slot as EquipmentSlot);
  }
}
