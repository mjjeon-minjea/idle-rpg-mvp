import type { DropTableData, RewardItemData } from "../types/GameTypes";
import type { RandomSource } from "./RandomService";

export class DropResolver {
  private readonly dropTablesById: Map<string, DropTableData>;

  constructor(dropTables: DropTableData[], private readonly random: RandomSource) {
    this.dropTablesById = new Map(dropTables.map((table) => [table.id, table]));
  }

  resolve(dropTableId: string, dropRateBonus: number): RewardItemData[] {
    const dropTable = this.dropTablesById.get(dropTableId);
    if (!dropTable) {
      throw new Error(`Drop table not found: ${dropTableId}`);
    }

    const drops: RewardItemData[] = [];

    for (const entry of dropTable.entries) {
      const finalDropRate = Math.min(1, entry.dropRate * (1 + dropRateBonus));
      if (this.random.next() <= finalDropRate) {
        drops.push({
          itemId: entry.itemId,
          quantity: this.random.nextInt(entry.minAmount, entry.maxAmount),
        });
      }
    }

    return drops;
  }
}
