import gameConfig from "../../data/gameConfig.json";
import dropTables from "../../data/dropTables.json";
import items from "../../data/items.json";
import monsterPools from "../../data/monsterPools.json";
import monsters from "../../data/monsters.json";
import rewards from "../../data/rewards.json";
import skills from "../../data/skills.json";
import stages from "../../data/stages.json";
import { EQUIPMENT_SLOTS, WEAPON_TYPES } from "../types/GameTypes";
import type {
  DropTableData,
  GameData,
  ItemData,
  MonsterData,
  MonsterPoolData,
  RewardData,
  SkillConfigData,
  SkillData,
  SkillState,
  StageData,
} from "../types/GameTypes";

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
      skills: (skills as SkillConfigData).skills,
      defaultSkillState: (skills as SkillConfigData).defaultState,
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
    const skillIds = this.createIdSet(data.skills, "skill");
    const monstersById = new Map(data.monsters.map((monster) => [monster.id, monster]));

    for (const item of data.items) {
      if (item.type === "equipment") {
        if (!item.equipment) {
          throw new Error(`Equipment item "${item.id}" must include equipment data.`);
        }

        if (!EQUIPMENT_SLOTS.includes(item.equipment.slot)) {
          throw new Error(`Equipment item "${item.id}" has invalid slot "${item.equipment.slot}".`);
        }

        if (item.equipment.slot === "weapon") {
          if (!item.equipment.weaponType) {
            throw new Error(`Weapon item "${item.id}" must include weaponType.`);
          }

          if (!WEAPON_TYPES.includes(item.equipment.weaponType)) {
            throw new Error(`Weapon item "${item.id}" has invalid weaponType "${item.equipment.weaponType}".`);
          }
        }

        if (item.equipment.slot !== "weapon" && item.equipment.weaponType) {
          throw new Error(`Non-weapon equipment item "${item.id}" must not include weaponType.`);
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

    this.validateStageOrder(data.stages);

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

      if (stage.expMultiplier <= 0 || stage.goldMultiplier <= 0 || stage.dropRateBonus < 0) {
        throw new Error(`Stage "${stage.id}" has invalid reward multiplier values.`);
      }
    }

    this.validateSkills(data.skills, skillIds);
    this.validateSkillState(data.defaultSkillState, skillIds, "defaultSkillState");
  }

  private static validateStageOrder(stages: StageData[]): void {
    const seenOrders = new Set<number>();
    let previousOrder = 0;

    for (const stage of stages) {
      if (stage.order < 1) {
        throw new Error(`Stage "${stage.id}" order must be at least 1.`);
      }

      if (seenOrders.has(stage.order)) {
        throw new Error(`Duplicate stage order "${stage.order}" found at stage "${stage.id}".`);
      }

      if (stage.order < previousOrder) {
        throw new Error(`Stages must be sorted by ascending order. Stage "${stage.id}" is out of order.`);
      }

      if (stage.requiredNormalKills < 1) {
        throw new Error(`Stage "${stage.id}" requiredNormalKills must be at least 1.`);
      }

      seenOrders.add(stage.order);
      previousOrder = stage.order;
    }
  }

  private static validateSkills(skills: SkillData[], skillIds: Set<string>): void {
    for (const skill of skills) {
      if (!skillIds.has(skill.id)) {
        throw new Error(`Skill "${skill.id}" is not registered correctly.`);
      }

      if (skill.trigger !== "auto") {
        throw new Error(`Skill "${skill.id}" has unsupported trigger "${skill.trigger}".`);
      }

      if (skill.target !== "currentMonster") {
        throw new Error(`Skill "${skill.id}" has unsupported target "${skill.target}".`);
      }

      if (skill.cooldownMs <= 0) {
        throw new Error(`Skill "${skill.id}" cooldownMs must be greater than 0.`);
      }

      if (skill.damageMultiplier < 0) {
        throw new Error(`Skill "${skill.id}" damageMultiplier must not be negative.`);
      }

      if (skill.flatDamage < 0) {
        throw new Error(`Skill "${skill.id}" flatDamage must not be negative.`);
      }

      if (skill.requiredLevel < 1) {
        throw new Error(`Skill "${skill.id}" requiredLevel must be at least 1.`);
      }
    }
  }

  private static validateSkillState(state: SkillState, skillIds: Set<string>, label: string): void {
    this.validateSkillIdList(state.unlockedSkillIds, skillIds, `${label}.unlockedSkillIds`);
    this.validateSkillIdList(state.equippedSkillIds, skillIds, `${label}.equippedSkillIds`);

    if (state.equippedSkillIds.length > 6) {
      throw new Error(`${label}.equippedSkillIds must include at most 6 skills.`);
    }
  }

  private static validateSkillIdList(skillIdsToValidate: string[], skillIds: Set<string>, label: string): void {
    const seen = new Set<string>();
    for (const skillId of skillIdsToValidate) {
      if (!skillIds.has(skillId)) {
        throw new Error(`${label} references missing skillId "${skillId}".`);
      }

      if (seen.has(skillId)) {
        throw new Error(`${label} includes duplicate skillId "${skillId}".`);
      }

      seen.add(skillId);
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
