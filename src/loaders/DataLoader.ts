import gameConfig from "../../data/gameConfig.json";
import dropTables from "../../data/dropTables.json";
import items from "../../data/items.json";
import monsterPools from "../../data/monsterPools.json";
import monsters from "../../data/monsters.json";
import rewards from "../../data/rewards.json";
import stages from "../../data/stages.json";
import type {
  DropTableData,
  EquipmentSlot,
  GameData,
  ItemData,
  MonsterData,
  MonsterPoolData,
  RewardData,
  StageData,
} from "../types/GameTypes";

const EQUIPMENT_SLOTS: EquipmentSlot[] = ["weapon", "armor", "accessory"];

export class DataLoader {
  static load(): GameData {
    const data: GameData = {
      config: gameConfig,
      stages: stages as StageData[],
      monsters: monsters as MonsterData[],
      monsterPools: monsterPools as MonsterPoolData[],
      dropTables: dropTables as DropTableData[],
      rewards: rewards as RewardData[],
      items: items as ItemData[],
    };

    this.validate(data);
    return data;
  }

  private static validate(data: GameData): void {
    const itemIds = this.createIdSet(data.items, "item");
    const monsterIds = this.createIdSet(data.monsters, "monster");
    const monsterPoolIds = this.createIdSet(data.monsterPools, "monster pool");
    const dropTableIds = this.createIdSet(data.dropTables, "drop table");
    const rewardIds = this.createIdSet(data.rewards, "reward");
    const monstersById = new Map(data.monsters.map((monster) => [monster.id, monster]));

    for (const item of data.items) {
      if (item.type === "equipment") {
        if (!item.equipment) {
          throw new Error(`Equipment item "${item.id}" must include equipment data.`);
        }

        if (!EQUIPMENT_SLOTS.includes(item.equipment.slot)) {
          throw new Error(`Equipment item "${item.id}" has invalid slot "${item.equipment.slot}".`);
        }

        const stats = item.equipment.stats;
        if (
          typeof stats.maxHp !== "number" ||
          typeof stats.attack !== "number" ||
          typeof stats.defense !== "number"
        ) {
          throw new Error(`Equipment item "${item.id}" has invalid stat values.`);
        }

        if (stats.maxHp < 0 || stats.attack < 0 || stats.defense < 0) {
          throw new Error(`Equipment item "${item.id}" cannot include negative stats in MVP 1.`);
        }
      }

      if (item.type === "material" && item.equipment) {
        throw new Error(`Material item "${item.id}" must not include equipment data.`);
      }
    }

    for (const monster of data.monsters) {
      if (!dropTableIds.has(monster.dropTableId)) {
        throw new Error(`Monster "${monster.id}" references missing dropTableId "${monster.dropTableId}".`);
      }
    }

    for (const pool of data.monsterPools) {
      if (pool.entries.length === 0) {
        throw new Error(`Monster pool "${pool.id}" must include at least one entry.`);
      }

      for (const entry of pool.entries) {
        const monster = monstersById.get(entry.monsterId);
        if (!monsterIds.has(entry.monsterId) || !monster) {
          throw new Error(`Monster pool "${pool.id}" references missing monsterId "${entry.monsterId}".`);
        }

        if (entry.weight <= 0) {
          throw new Error(`Monster pool "${pool.id}" has non-positive weight for "${entry.monsterId}".`);
        }

        if (monster.role !== pool.role) {
          throw new Error(`Monster pool "${pool.id}" expects role "${pool.role}" but "${monster.id}" is "${monster.role}".`);
        }
      }
    }

    for (const dropTable of data.dropTables) {
      for (const entry of dropTable.entries) {
        if (!itemIds.has(entry.itemId)) {
          throw new Error(`Drop table "${dropTable.id}" references missing itemId "${entry.itemId}".`);
        }

        if (entry.dropRate < 0 || entry.dropRate > 1) {
          throw new Error(`Drop table "${dropTable.id}" has invalid dropRate for "${entry.itemId}".`);
        }

        if (entry.minAmount < 0 || entry.maxAmount < entry.minAmount) {
          throw new Error(`Drop table "${dropTable.id}" has invalid amount range for "${entry.itemId}".`);
        }
      }
    }

    for (const stage of data.stages) {
      if (!monsterPoolIds.has(stage.normalMonsterPoolId)) {
        throw new Error(`Stage "${stage.id}" references missing normalMonsterPoolId "${stage.normalMonsterPoolId}".`);
      }

      if (!monsterPoolIds.has(stage.leaderMonsterPoolId)) {
        throw new Error(`Stage "${stage.id}" references missing leaderMonsterPoolId "${stage.leaderMonsterPoolId}".`);
      }

      if (stage.bossMonsterId) {
        const boss = monstersById.get(stage.bossMonsterId);
        if (!boss) {
          throw new Error(`Stage "${stage.id}" references missing bossMonsterId "${stage.bossMonsterId}".`);
        }

        if (boss.role !== "boss") {
          throw new Error(`Stage "${stage.id}" bossMonsterId "${boss.id}" must reference a boss monster.`);
        }
      }

      if (!rewardIds.has(stage.clearRewardId)) {
        throw new Error(`Stage "${stage.id}" references missing clearRewardId "${stage.clearRewardId}".`);
      }

      if (stage.expMultiplier < 0 || stage.goldMultiplier < 0 || stage.dropRateBonus < 0) {
        throw new Error(`Stage "${stage.id}" has invalid reward multiplier values.`);
      }
    }
  }

  private static createIdSet(items: { id: string }[], label: string): Set<string> {
    const ids = new Set<string>();
    for (const item of items) {
      if (ids.has(item.id)) {
        throw new Error(`Duplicate ${label} id "${item.id}".`);
      }

      ids.add(item.id);
    }

    return ids;
  }
}
