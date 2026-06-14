import Phaser from "phaser";
import { EFFECT_ASSET_LIST, getEffectAsset, ITEM_ICON_ASSET_LIST, MONSTER_ASSET_LIST } from "../assets/AssetRegistry";
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
import type { GameData, MonsterInstance, PlayerState, RewardItemData } from "../types/GameTypes";
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

  constructor() {
    super("GameScene");
  }

  preload(): void {
    for (const asset of MONSTER_ASSET_LIST) {
      this.load.image(asset.key, asset.path);
    }

    for (const asset of ITEM_ICON_ASSET_LIST) {
      this.load.image(asset.key, asset.path);
    }

    for (const asset of EFFECT_ASSET_LIST) {
      this.load.image(asset.key, asset.path);
    }
  }

  create(): void {
    this.dataSet = DataLoader.load();
    this.saveSystem = new SaveSystem();
    const saved = this.saveSystem.load();

    this.growthSystem = new PlayerGrowthSystem();
    this.player = this.normalizePlayerState(saved?.player);

    this.inventorySystem = new InventorySystem(saved?.inventory);
    this.equipmentSystem = new EquipmentSystem(this.dataSet.items, saved?.equipment ?? { equipped: {} });
    this.skillSystem = new SkillSystem(this.dataSet.skills, saved?.skills ?? this.dataSet.defaultSkillState);
    this.stageSystem = new StageProgressSystem(this.dataSet.stages, saved?.stage);
    const randomService = new RandomService();
    this.combatSystem = new CombatSystem();
    this.monsterFactory = new MonsterFactory();
    this.monsterPoolSystem = new MonsterPoolSystem(this.dataSet.monsters, this.dataSet.monsterPools, randomService);
    this.rewardResolver = new RewardResolver(new DropResolver(this.dataSet.dropTables, randomService));
    this.rewardSystem = new RewardSystem(this.dataSet.rewards, this.growthSystem);
    this.hud = new Hud(this, this.dataSet.config.title, this.dataSet.config.subtitle);
    this.monster = this.createTargetMonster(this.time.now);

    this.createBattleBackground();
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

  update(_time: number, delta: number): void {
    const effectiveStats = this.equipmentSystem.calculateEffectiveStats(this.player);
    const skillResult = this.skillSystem.update(delta, this.player, effectiveStats, this.monster);
    let defeatedBySkill = false;

    if (skillResult.triggered) {
      this.pushLog(`[Skill] ${skillResult.skillId} dealt ${skillResult.damage} damage`);
      if (skillResult.skillId === "trainee_slash") {
        this.playEffect("trainee_slash", this.getMonsterEffectPosition(), {
          durationMs: 360,
          rotation: -0.35,
          scale: 0.22,
        });
      }

      if (skillResult.skillId === "heavy_training_strike") {
        this.playEffect("heavy_training_strike", this.getMonsterEffectPosition(), {
          durationMs: 460,
          rotation: 0.18,
          scale: 0.28,
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
        this.playEffect("basic_hit", this.getMonsterEffectPosition(), {
          durationMs: 240,
          rotation: 0.12,
          scale: 0.16,
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

  private getMonsterEffectPosition(): Phaser.Math.Vector2 {
    return new Phaser.Math.Vector2(780, 318);
  }

  private createBattleBackground(): void {
    const background = this.add.graphics().setDepth(-3);

    background.fillStyle(0x8fd6f1, 1);
    background.fillRect(0, 0, 1280, 720);

    background.fillStyle(0xdff7ff, 0.72);
    background.fillCircle(210, 108, 86);
    background.fillCircle(278, 96, 72);
    background.fillCircle(1010, 116, 82);
    background.fillCircle(1082, 104, 58);

    background.fillStyle(0x6fbf78, 1);
    background.fillEllipse(640, 440, 1320, 510);
    background.fillStyle(0x4fa862, 0.85);
    background.fillEllipse(190, 340, 520, 250);
    background.fillEllipse(1060, 320, 520, 230);

    background.fillStyle(0xd6b06e, 1);
    background.fillEllipse(650, 548, 680, 190);
    background.fillStyle(0xb98f56, 0.28);
    background.fillEllipse(650, 548, 590, 142);

    this.drawBackgroundTree(background, 70, 126, 1.2);
    this.drawBackgroundTree(background, 1200, 128, 1.25);
    this.drawBackgroundBush(background, 90, 612, 1.2);
    this.drawBackgroundBush(background, 1130, 610, 1.05);
    this.drawBackgroundBush(background, 1030, 480, 0.75);
    this.drawBackgroundBush(background, 230, 470, 0.85);

    background.fillStyle(0x8c6d4e, 0.52);
    background.fillEllipse(520, 532, 42, 18);
    background.fillEllipse(775, 520, 36, 16);
    background.fillEllipse(705, 590, 50, 18);

    this.add.rectangle(640, 360, 1280, 720, 0x0b1220, 0.08).setDepth(-2);
  }

  private drawBackgroundTree(graphics: Phaser.GameObjects.Graphics, x: number, y: number, scale: number): void {
    graphics.fillStyle(0x6c4931, 1);
    graphics.fillRoundedRect(x - 24 * scale, y + 42 * scale, 48 * scale, 200 * scale, 18 * scale);
    graphics.fillStyle(0x2f7d47, 1);
    graphics.fillCircle(x - 52 * scale, y + 24 * scale, 62 * scale);
    graphics.fillCircle(x + 8 * scale, y, 78 * scale);
    graphics.fillCircle(x + 66 * scale, y + 28 * scale, 58 * scale);
    graphics.fillStyle(0x3f9d5a, 0.9);
    graphics.fillCircle(x - 5 * scale, y + 16 * scale, 62 * scale);
  }

  private drawBackgroundBush(graphics: Phaser.GameObjects.Graphics, x: number, y: number, scale: number): void {
    graphics.fillStyle(0x2f8f4f, 1);
    graphics.fillCircle(x - 30 * scale, y, 34 * scale);
    graphics.fillCircle(x + 4 * scale, y - 16 * scale, 42 * scale);
    graphics.fillCircle(x + 44 * scale, y, 30 * scale);
    graphics.fillStyle(0x4fbf6f, 0.9);
    graphics.fillCircle(x + 8 * scale, y - 6 * scale, 30 * scale);
  }

  private playEffect(
    effectId: string,
    position: Phaser.Math.Vector2,
    options: { durationMs: number; rotation: number; scale: number },
  ): void {
    const asset = getEffectAsset(effectId);
    if (!asset || !this.textures.exists(asset.key)) {
      return;
    }

    const effect = this.add
      .image(position.x, position.y, asset.key)
      .setDepth(4)
      .setAlpha(0)
      .setRotation(options.rotation * -0.25)
      .setScale(options.scale * 0.55);

    this.tweens.add({
      targets: effect,
      alpha: { from: 0.72, to: 0 },
      scale: { from: options.scale * 0.7, to: options.scale * 0.98 },
      rotation: options.rotation,
      duration: options.durationMs,
      ease: "Cubic.Out",
      onComplete: () => {
        effect.destroy();
      },
    });
  }
}
