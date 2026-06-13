export type MonsterRole = "normal" | "leader" | "boss";
export type MonsterRuntimeState = "spawning" | "idle" | "attacking" | "stunned" | "dead";
export type StageEncounterType = "normal" | "leader" | "boss";
export type EquipmentSlot = "weapon" | "armor" | "accessory";
export type SkillTrigger = "auto";
export type SkillTarget = "currentMonster";

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
  equipment?: EquipmentData;
}

export interface EquipmentData {
  slot: EquipmentSlot;
  stats: EquipmentStatBonus;
}

export interface EquipmentStatBonus {
  maxHp: number;
  attack: number;
  defense: number;
}

export interface SkillData {
  id: string;
  name: string;
  description: string;
  trigger: SkillTrigger;
  target: SkillTarget;
  cooldownMs: number;
  damageMultiplier: number;
  flatDamage: number;
  requiredLevel: number;
}

export interface SkillState {
  unlockedSkillIds: string[];
  equippedSkillIds: string[];
}

export interface SkillRuntimeState {
  cooldownRemainingBySkillId: Record<string, number>;
}

export interface SkillConfigData {
  defaultState: SkillState;
  skills: SkillData[];
}

export interface GameData {
  config: GameConfigData;
  stages: StageData[];
  monsters: MonsterData[];
  monsterPools: MonsterPoolData[];
  dropTables: DropTableData[];
  rewards: RewardData[];
  items: ItemData[];
  skills: SkillData[];
  defaultSkillState: SkillState;
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

export interface EffectivePlayerStats {
  maxHp: number;
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

export interface EquipmentState {
  equipped: Partial<Record<EquipmentSlot, string>>;
}

export interface EquippedItemView {
  slot: EquipmentSlot;
  itemId: string | null;
  name: string;
}

export interface EquipResult {
  success: boolean;
  equippedItemId?: string;
  replacedItemId?: string;
  reason?: "item_not_found" | "not_owned" | "not_equipment" | "invalid_slot";
}

export interface UnequipResult {
  success: boolean;
  unequippedItemId?: string;
  reason?: "slot_empty" | "invalid_slot";
}

export interface StageState {
  currentStageId: string;
  normalKills: number;
  encounterType?: StageEncounterType;
}

export interface SaveData {
  player: PlayerState;
  inventory: InventoryEntry[];
  equipment?: EquipmentState;
  skills?: SkillState;
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

export interface SkillResult {
  triggered: boolean;
  skillId?: string;
  skillName?: string;
  damage?: number;
  defeated: boolean;
  reason?: string;
}

export interface SkillCooldownView {
  skillId: string;
  skillName: string;
  ready: boolean;
  cooldownRemainingMs: number;
  requiredLevel: number;
  unlocked: boolean;
}
