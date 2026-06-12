import type { MonsterData, MonsterPoolData, MonsterRole, StageData, StageEncounterType } from "../types/GameTypes";
import type { RandomSource } from "./RandomService";

export class MonsterPoolSystem {
  private readonly monstersById: Map<string, MonsterData>;
  private readonly poolsById: Map<string, MonsterPoolData>;

  constructor(monsters: MonsterData[], monsterPools: MonsterPoolData[], private readonly random: RandomSource) {
    this.monstersById = new Map(monsters.map((monster) => [monster.id, monster]));
    this.poolsById = new Map(monsterPools.map((pool) => [pool.id, pool]));
  }

  selectMonster(stage: StageData, encounterType: StageEncounterType): MonsterData {
    if (encounterType === "boss") {
      if (!stage.bossMonsterId) {
        throw new Error(`Stage "${stage.id}" requested boss encounter without bossMonsterId.`);
      }

      return this.requireMonster(stage.bossMonsterId, "boss");
    }

    const poolId = encounterType === "leader" ? stage.leaderMonsterPoolId : stage.normalMonsterPoolId;
    const expectedRole: MonsterRole = encounterType;
    const pool = this.poolsById.get(poolId);
    if (!pool) {
      throw new Error(`Monster pool not found: ${poolId}`);
    }

    if (pool.role !== expectedRole) {
      throw new Error(`Monster pool "${pool.id}" role "${pool.role}" does not match encounter "${expectedRole}".`);
    }

    const totalWeight = pool.entries.reduce((sum, entry) => sum + entry.weight, 0);
    let roll = this.random.next() * totalWeight;

    for (const entry of pool.entries) {
      roll -= entry.weight;
      if (roll <= 0) {
        return this.requireMonster(entry.monsterId, expectedRole);
      }
    }

    return this.requireMonster(pool.entries[pool.entries.length - 1].monsterId, expectedRole);
  }

  private requireMonster(monsterId: string, expectedRole: MonsterRole): MonsterData {
    const monster = this.monstersById.get(monsterId);
    if (!monster) {
      throw new Error(`Monster not found: ${monsterId}`);
    }

    if (monster.role !== expectedRole) {
      throw new Error(`Monster "${monsterId}" role "${monster.role}" does not match expected "${expectedRole}".`);
    }

    return monster;
  }
}

