export type MonsterRole = "normal" | "leader" | "boss";
export type MonsterRuntimeState = "spawning" | "idle" | "attacking" | "stunned" | "dead";
export type StageEncounterType = "normal" | "leader" | "boss";

export interface GameConfigData {
  title: string;
  subtitle: string;
}

export interface MonsterData {
  id: string;
  name: string;
  role: MonsterRole;
  maxHp: number;
  attack: number;
  defense: number;
  baseExp: number;
  baseGold: number;
  dropTableId: string;
}

export interface MonsterPoolData {
  id: string;
  role: MonsterRole;
  entries: MonsterPoolEntryData[];
}

export interface MonsterPoolEntryData {
  monsterId: string;
  weight: number;
}

export interface StageData {
  id: string;
  name: string;
  order: number;
  normalMonsterPoolId: string;
  leaderMonsterPoolId: string;
  bossMonsterId?: string;
  requiredNormalKills: number;
  clearRewardId: string;
  expMultiplier: number;
  goldMultiplier: number;
  dropRateBonus: number;
  clearRewardMultiplier?: number;
}

export interface RewardData {
  id: string;
  exp: number;
  gold: number;
  items: RewardItemData[];
}

export interface RewardItemData {
  itemId: string;
  quantity: number;
}

export interface DropTableData {
  id: string;
  entries: DropTableEntryData[];
}

export interface DropTableEntryData {
  itemId: string;
  dropRate: number;
  minAmount: number;
  maxAmount: number;
}

export interface ItemData {
  id: string;
  name: string;
  type: "material" | "equipment";
  rarity: "common" | "advanced" | "rare";
}

export interface GameData {
  config: GameConfigData;
  stages: StageData[];
  monsters: MonsterData[];
  monsterPools: MonsterPoolData[];
  dropTables: DropTableData[];
  rewards: RewardData[];
  items: ItemData[];
}

export interface PlayerState {
  level: number;
  exp: number;
  totalExp: number;
  gold: number;
  maxHp: number;
  hp: number;
  attack: number;
  defense: number;
}

export interface GrowthResult {
  gainedExp: number;
  totalExp: number;
  levelBefore: number;
  levelAfter: number;
  levelsGained: number;
  expBefore: number;
  expAfter: number;
  requiredExpBefore: number;
  requiredExpAfter: number;
  statGain: {
    maxHp: number;
    attack: number;
    defense: number;
  };
}

export interface MonsterInstance {
  data: MonsterData;
  currentHp: number;
  currentState: MonsterRuntimeState;
  attackCooldown: number;
  isDead: boolean;
  spawnedAt: number;
  lastAttackAt: number;
}

export interface InventoryEntry {
  itemId: string;
  quantity: number;
}

export interface StageState {
  currentStageId: string;
  normalKills: number;
  encounterType?: StageEncounterType;
}

export interface SaveData {
  player: PlayerState;
  inventory: InventoryEntry[];
  stage: StageState;
}

export interface ResolvedReward {
  exp: number;
  gold: number;
  items: RewardItemData[];
}

export interface MonsterDefeatedResult {
  defeatedMonsterId: string;
  monsterRole: MonsterRole;
  playerDamage: number;
  monsterDamage: number;
}
