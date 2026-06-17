import Phaser from "phaser";
import {
  EFFECT_ASSET_LIST,
  getEffectAsset,
  getRegionBackgroundAsset,
  ITEM_ICON_ASSET_LIST,
  MONSTER_ASSET_LIST,
  PLAYER_ASSET_LIST,
  REGION_BACKGROUND_ASSET_LIST,
  SKILL_ICON_ASSET_LIST,
  UI_CORE_ASSET_LIST,
} from "../assets/AssetRegistry";
import { DataLoader } from "../loaders/DataLoader";
import { CombatSystem } from "../systems/CombatSystem";
import { DropResolver } from "../systems/DropResolver";
import { EquipmentSystem } from "../systems/EquipmentSystem";
import { InventorySystem } from "../systems/InventorySystem";
import { MonsterFactory } from "../systems/MonsterFactory";
import { MonsterPoolSystem } from "../systems/MonsterPoolSystem";
import { PlayerGrowthSystem } from "../systems/PlayerGrowthSystem";
import { RandomService } from "../systems/RandomService";
import { RewardResolver } from "../systems/RewardResolver";
import { RewardSystem } from "../systems/RewardSystem";
import { SaveSystem } from "../systems/SaveSystem";
import { SkillSystem } from "../systems/SkillSystem";
import { StageProgressSystem } from "../systems/StageProgressSystem";
import type { GameData, MonsterInstance, PlayerState, RewardItemData, SkillState } from "../types/GameTypes";
import { Hud, type OwnedEquipmentView } from "../ui/Hud";

export class GameScene extends Phaser.Scene {
  private dataSet!: GameData;
  private player!: PlayerState;
  private monster!: MonsterInstance;
  private combatSystem!: CombatSystem;
  private monsterFactory!: MonsterFactory;
  private monsterPoolSystem!: MonsterPoolSystem;
  private inventorySystem!: InventorySystem;
  private equipmentSystem!: EquipmentSystem;
  private growthSystem!: PlayerGrowthSystem;
  private rewardResolver!: RewardResolver;
  private rewardSystem!: RewardSystem;
  private saveSystem!: SaveSystem;
  private skillSystem!: SkillSystem;
  private stageSystem!: StageProgressSystem;
  private hud!: Hud;
  private logLines: string[] = [];
  private saveElapsedMs = 0;
  private regionBackgroundImage?: Phaser.GameObjects.Image;
  private fallbackBackground?: Phaser.GameObjects.Graphics;
  private currentRegionBackgroundKey?: string;

  constructor() {
    super("GameScene");
  }

  preload(): void {
    for (const asset of PLAYER_ASSET_LIST) {
      this.load.image(asset.key, asset.path);
    }

    for (const asset of REGION_BACKGROUND_ASSET_LIST) {
      this.load.image(asset.key, asset.path);
    }

    for (const asset of MONSTER_ASSET_LIST) {
      this.load.image(asset.key, asset.path);
    }

    for (const asset of ITEM_ICON_ASSET_LIST) {
      this.load.image(asset.key, asset.path);
    }

    for (const asset of EFFECT_ASSET_LIST) {
      this.load.image(asset.key, asset.path);
    }

    for (const asset of SKILL_ICON_ASSET_LIST) {
      this.load.image(asset.key, asset.path);
    }

    for (const asset of UI_CORE_ASSET_LIST) {
      this.load.image(asset.key, asset.path);
    }
  }

  create(): void {
    this.applyPageLayoutStyle();
    this.dataSet = DataLoader.load();
    this.saveSystem = new SaveSystem();
    const saved = this.saveSystem.load();

    this.growthSystem = new PlayerGrowthSystem();
    this.player = this.normalizePlayerState(saved?.player);

    this.inventorySystem = new InventorySystem(saved?.inventory);
    this.equipmentSystem = new EquipmentSystem(this.dataSet.items, saved?.equipment ?? { equipped: {} });
    this.skillSystem = new SkillSystem(this.dataSet.skills, this.normalizeSkillState(saved?.skills));
    this.stageSystem = new StageProgressSystem(this.dataSet.stages, saved?.stage);
    const randomService = new RandomService();
    this.combatSystem = new CombatSystem();
    this.monsterFactory = new MonsterFactory();
    this.monsterPoolSystem = new MonsterPoolSystem(this.dataSet.monsters, this.dataSet.monsterPools, randomService);
    this.rewardResolver = new RewardResolver(new DropResolver(this.dataSet.dropTables, randomService));
    this.rewardSystem = new RewardSystem(this.dataSet.rewards, this.growthSystem);
    this.createBattleBackground();
    this.hud = new Hud(this, this.dataSet.config.title, this.dataSet.config.subtitle);
    this.monster = this.createTargetMonster(this.time.now);
  }

  private applyPageLayoutStyle(): void {
    if (typeof document === "undefined") {
      return;
    }

    document.documentElement.style.margin = "0";
    document.documentElement.style.overflow = "hidden";
    document.body.style.margin = "0";
    document.body.style.overflow = "hidden";
  }

  private normalizePlayerState(savedPlayer?: Partial<PlayerState>): PlayerState {
    if (!savedPlayer) {
      return {
        level: 1,
        exp: 0,
        totalExp: 0,
        gold: 0,
        maxHp: 120,
        hp: 120,
        attack: 14,
        defense: 3,
      };
    }

    const level = savedPlayer.level ?? 1;
    const exp = savedPlayer.exp ?? 0;
    const totalExp = savedPlayer.totalExp ?? this.growthSystem.getTotalExpAtLevelStart(level) + exp;

    return {
      level,
      exp,
      totalExp,
      gold: savedPlayer.gold ?? 0,
      maxHp: savedPlayer.maxHp ?? 120,
      hp: savedPlayer.hp ?? savedPlayer.maxHp ?? 120,
      attack: savedPlayer.attack ?? 14,
      defense: savedPlayer.defense ?? 3,
    };
  }

  private normalizeSkillState(savedSkills?: SkillState): SkillState {
    const defaultSkillIds = this.dataSet.defaultSkillState.equippedSkillIds;
    const unlockedSkillIds = Array.from(
      new Set([
        ...this.dataSet.defaultSkillState.unlockedSkillIds,
        ...(savedSkills?.unlockedSkillIds ?? []),
      ]),
    );

    return {
      unlockedSkillIds,
      equippedSkillIds: defaultSkillIds,
    };
  }

  update(_time: number, delta: number): void {
    const effectiveStats = this.equipmentSystem.calculateEffectiveStats(this.player);
    const skillResult = this.skillSystem.update(delta, this.player, effectiveStats, this.monster);
    let defeatedBySkill = false;

    if (skillResult.triggered) {
      this.pushLog(`[Skill] ${skillResult.skillId} dealt ${skillResult.damage} damage`);
      if (skillResult.skillId === "trainee_slash") {
        this.playEffect("trainee_slash", this.getSkillEffectPosition(), {
          durationMs: 280,
          rotation: -0.35,
          targetSize: 30,
          maxScale: 0.055,
        });
      }

      if (skillResult.skillId === "heavy_training_strike") {
        this.playEffect("heavy_training_strike", this.getSkillEffectPosition(), {
          durationMs: 340,
          rotation: 0.18,
          targetSize: 42,
          maxScale: 0.075,
        });
      }

      if (skillResult.defeated) {
        defeatedBySkill = true;
        this.handleMonsterDefeat();
      }
    }

    const hpBeforeCombat = this.player.hp;
    const result = defeatedBySkill ? null : this.combatSystem.update(delta, this.player, effectiveStats, this.monster);

    if (result) {
      this.pushLog(`[Combat] Basic ${result.monsterDamage} / Counter ${result.playerDamage}`);
      if (result.monsterDamage > 0) {
        this.playEffect("basic_hit", this.getMonsterHitEffectPosition(), {
          durationMs: 180,
          rotation: 0.12,
          targetSize: 22,
          maxScale: 0.075,
        });
      }

      if (result.playerDamage > 0 && hpBeforeCombat - result.playerDamage <= 0) {
        this.pushLog("[Reset] Player HP reached 0 and auto-recovered");
      }

      if (result.monsterDefeated) {
        this.handleMonsterDefeat();
      }
    }

    this.saveElapsedMs += delta;
    if (this.saveElapsedMs >= 3000) {
      this.saveElapsedMs = 0;
      this.saveGame();
    }

    this.updateRegionBackground(this.stageSystem.getCurrentStage().id);
    this.hud.update(
      this.stageSystem.getCurrentStage(),
      this.stageSystem.getNormalKills(),
      this.stageSystem.getEncounterType(),
      this.player,
      this.growthSystem.getRequiredExp(this.player.level),
      effectiveStats,
      this.equipmentSystem.getEquipmentBonus(),
      this.equipmentSystem.getEquippedItems(),
      this.getOwnedEquipmentView(),
      this.skillSystem.getCooldownViews(this.player),
      this.monster,
      this.inventorySystem.list(),
    );
    this.hud.setLog(this.logLines);
  }

  private handleMonsterDefeat(): void {
    const defeatedMonster = this.monster.data;
    this.pushLog(`[Defeat] ${defeatedMonster.id}`);
    const monsterReward = this.rewardResolver.resolveMonsterReward(defeatedMonster, this.stageSystem.getCurrentStage());
    const monsterRewardResult = this.rewardSystem.applyResolvedReward(monsterReward, this.player, this.inventorySystem);
    this.pushLog(`[Reward] EXP ${monsterReward.exp} / Gold ${monsterReward.gold} / Items ${monsterReward.items.length}`);
    this.pushGrowthLog(monsterRewardResult.growth);
    this.autoEquipRewardItems(monsterRewardResult.reward.items);

    const clearResult = this.stageSystem.recordMonsterDefeat(defeatedMonster);
    if (clearResult.cleared && clearResult.rewardId) {
      const rewardResult = this.rewardSystem.applyReward(clearResult.rewardId, this.player, this.inventorySystem);
      const reward = rewardResult.reward;
      this.pushLog(`[Clear] Stage reward EXP ${reward.exp} / Gold ${reward.gold}`);
      this.pushGrowthLog(rewardResult.growth);
      this.autoEquipRewardItems(reward.items);
    }

    this.monster = this.createTargetMonster(this.time.now);
    this.saveGame();
  }

  private createTargetMonster(now: number): MonsterInstance {
    const monsterData = this.monsterPoolSystem.selectMonster(
      this.stageSystem.getCurrentStage(),
      this.stageSystem.getEncounterType(),
    );
    return this.monsterFactory.create(monsterData, now);
  }

  private saveGame(): void {
    this.saveSystem.save({
      player: this.player,
      inventory: this.inventorySystem.list(),
      equipment: this.equipmentSystem.toState(),
      skills: this.skillSystem.toState(),
      stage: this.stageSystem.toState(),
    });
  }

  private pushLog(message: string): void {
    this.logLines.unshift(message);
    if (this.logLines.length > 8) {
      this.logLines.length = 8;
    }
  }

  private pushGrowthLog(growth: { levelsGained: number; levelAfter: number; statGain: { maxHp: number; attack: number; defense: number } }): void {
    if (growth.levelsGained <= 0) {
      return;
    }

    this.pushLog(`[Level Up] Lv ${growth.levelAfter}`);
    this.pushLog(`[Stats] HP +${growth.statGain.maxHp} / ATK +${growth.statGain.attack} / DEF +${growth.statGain.defense}`);
  }

  private autoEquipRewardItems(items: RewardItemData[]): void {
    for (const item of items) {
      const result = this.equipmentSystem.equip(item.itemId, this.inventorySystem);
      if (!result.success || !result.equippedItemId) {
        continue;
      }

      const replaced = result.replacedItemId ? ` / Replaced ${result.replacedItemId}` : "";
      this.pushLog(`[Equip] ${result.equippedItemId}${replaced}`);
    }
  }

  private getOwnedEquipmentView(): OwnedEquipmentView[] {
    const quantityByItemId = new Map(this.inventorySystem.list().map((entry) => [entry.itemId, entry.quantity]));

    return this.dataSet.items
      .filter((item) => item.type === "equipment" && quantityByItemId.has(item.id))
      .map((item) => ({
        itemId: item.id,
        name: item.name,
        quantity: quantityByItemId.get(item.id) ?? 0,
        slot: item.equipment?.slot ?? "unknown",
      }));
  }

  private getSkillEffectPosition(): Phaser.Math.Vector2 {
    return new Phaser.Math.Vector2(742, 292);
  }

  private getMonsterHitEffectPosition(): Phaser.Math.Vector2 {
    return new Phaser.Math.Vector2(780, 318);
  }

  private createBattleBackground(): void {
    this.fallbackBackground = this.add.graphics().setDepth(-10);
    this.fallbackBackground.fillStyle(0x8fd6f1, 1);
    this.fallbackBackground.fillRect(0, 0, 1280, 720);
    this.fallbackBackground.fillStyle(0x6fbf78, 1);
    this.fallbackBackground.fillEllipse(640, 470, 1320, 460);
    this.fallbackBackground.fillStyle(0xd6b06e, 1);
    this.fallbackBackground.fillEllipse(650, 548, 680, 190);

    this.regionBackgroundImage = this.add.image(640, 360, "").setDepth(-9).setVisible(false);
    this.add.rectangle(640, 360, 1280, 720, 0x0b1220, 0.08).setDepth(-8);
    this.updateRegionBackground(this.stageSystem.getCurrentStage().id);
  }

  private updateRegionBackground(stageId: string): void {
    const asset = getRegionBackgroundAsset(stageId);
    if (!asset || !this.regionBackgroundImage || !this.textures.exists(asset.key)) {
      this.currentRegionBackgroundKey = undefined;
      this.regionBackgroundImage?.setVisible(false);
      this.fallbackBackground?.setVisible(true);
      return;
    }

    if (this.currentRegionBackgroundKey !== asset.key) {
      this.currentRegionBackgroundKey = asset.key;
      const frame = this.textures.getFrame(asset.key);
      const scale = Math.max(1280 / frame.width, 720 / frame.height);
      this.regionBackgroundImage
        .setTexture(asset.key)
        .setDisplaySize(frame.width * scale, frame.height * scale)
        .setPosition(640, 360);
    }

    this.regionBackgroundImage.setVisible(true);
    this.fallbackBackground?.setVisible(false);
  }

  private playEffect(
    effectId: string,
    position: Phaser.Math.Vector2,
    options: { durationMs: number; rotation: number; targetSize: number; maxScale: number },
  ): void {
    const asset = getEffectAsset(effectId);
    if (!asset || !this.textures.exists(asset.key)) {
      return;
    }

    const frame = this.textures.getFrame(asset.key);
    const maxDimension = Math.max(frame.width, frame.height, 1);
    const baseScale = Math.min(options.targetSize / maxDimension, options.maxScale);
    const effect = this.add
      .image(position.x, position.y, asset.key)
      .setDepth(2.6)
      .setAlpha(0)
      .setRotation(options.rotation * -0.25)
      .setScale(baseScale * 0.58);

    this.tweens.add({
      targets: effect,
      alpha: { from: 0.5, to: 0 },
      scale: { from: baseScale * 0.68, to: baseScale * 0.92 },
      rotation: options.rotation,
      duration: options.durationMs,
      ease: "Cubic.Out",
      onComplete: () => {
        effect.destroy();
      },
    });
  }
}
