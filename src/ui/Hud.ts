import type {
  EffectivePlayerStats,
  EquippedItemView,
  EquipmentStatBonus,
  InventoryEntry,
  MonsterInstance,
  MonsterRole,
  MonsterRuntimeState,
  PlayerState,
  SkillCooldownView,
  StageData,
  StageEncounterType,
} from "../types/GameTypes";

const PANEL_FILL = 0x171b22;
const PANEL_STROKE = 0x2b3440;
const BAR_BG = 0x29313d;
const PLAYER_COLOR = 0x4f9cff;
const HP_COLOR = 0x55d66b;
const HP_LOW_COLOR = 0xff6b6b;

interface PanelBounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

export class Hud {
  private readonly graphics: Phaser.GameObjects.Graphics;
  private readonly stageText: Phaser.GameObjects.Text;
  private readonly playerText: Phaser.GameObjects.Text;
  private readonly playerHpText: Phaser.GameObjects.Text;
  private readonly monsterText: Phaser.GameObjects.Text;
  private readonly monsterHpText: Phaser.GameObjects.Text;
  private readonly bottomText: Phaser.GameObjects.Text;
  private readonly logText: Phaser.GameObjects.Text;
  private readonly monsterLabelText: Phaser.GameObjects.Text;

  constructor(scene: Phaser.Scene, title: string, subtitle: string) {
    this.graphics = scene.add.graphics();

    scene.add.text(32, 18, title, this.textStyle("#f4f0df", "22px", 820));
    scene.add.text(32, 52, subtitle, this.textStyle("#aeb7c7", "14px", 820));

    this.stageText = scene.add.text(34, 82, "", this.textStyle("#9bd0ff", "16px", 1180));
    this.playerText = scene.add.text(48, 134, "", this.textStyle("#f4f0df", "16px", 245));
    this.playerHpText = scene.add.text(48, 258, "", this.textStyle("#e3e8f2", "14px", 245));
    this.monsterText = scene.add.text(360, 352, "", this.textStyle("#ffd1a3", "16px", 480));
    this.monsterHpText = scene.add.text(588, 300, "", this.textStyle("#e3e8f2", "14px", 250));
    this.bottomText = scene.add.text(48, 546, "", this.textStyle("#d9f6dd", "15px", 1168));
    this.logText = scene.add.text(928, 142, "", this.textStyle("#e3e8f2", "15px", 300));
    scene.add.text(420, 302, "수습기사", this.textStyle("#cfe8ff", "15px", 160));
    this.monsterLabelText = scene.add.text(710, 302, "", this.textStyle("#ffe1b8", "15px", 200));
  }

  update(
    stage: StageData,
    normalKills: number,
    encounterType: StageEncounterType,
    player: PlayerState,
    requiredExp: number,
    effectiveStats: EffectivePlayerStats,
    equipmentBonus: EquipmentStatBonus,
    equippedItems: EquippedItemView[],
    skillCooldowns: SkillCooldownView[],
    monster: MonsterInstance,
    inventory: InventoryEntry[],
  ): void {
    this.drawLayout(player, effectiveStats, monster);

    this.stageText.setText(
      [
        `Stage ${stage.order}: ${stage.name}`,
        `진행 ${Math.min(normalKills, stage.requiredNormalKills)} / ${stage.requiredNormalKills} 처치`,
        `전투 단계: ${this.getEncounterLabel(encounterType)}`,
      ].join("   |   "),
    );

    this.playerText.setText([
      "Player (플레이어)",
      `Lv ${player.level}`,
      `ATK ${effectiveStats.attack} (기본 ${player.attack} + 장비 ${equipmentBonus.attack})`,
      `DEF ${effectiveStats.defense} (기본 ${player.defense} + 장비 ${equipmentBonus.defense})`,
      `EXP ${player.exp} / ${requiredExp}`,
      `누적 EXP ${player.totalExp}`,
      `골드 ${player.gold}`,
    ]);

    this.playerHpText.setText(`HP ${player.hp} / ${effectiveStats.maxHp}`);

    this.monsterText.setText([
      "Target (대상)",
      `${monster.data.name}`,
      `역할: ${this.getEncounterLabel(monster.data.role)}`,
      `상태: ${this.getMonsterStateLabel(monster.currentState)}`,
      `ATK ${monster.data.attack} / DEF ${monster.data.defense}`,
    ]);

    this.monsterHpText.setText(`HP ${monster.currentHp} / ${monster.data.maxHp}`);
    this.monsterLabelText.setText(monster.data.name);

    this.bottomText.setText([
      "Skills (스킬)",
      ...this.createSkillLines(player, skillCooldowns),
      "",
      "Equipment (장비)",
      ...equippedItems.map((item) => `${this.getSlotLabel(item.slot)}: ${item.name}`),
      `장비 보너스: HP +${equipmentBonus.maxHp} / ATK +${equipmentBonus.attack} / DEF +${equipmentBonus.defense}`,
      "",
      "Inventory (인벤토리)",
      this.createInventorySummary(inventory),
    ]);
  }

  setLog(lines: string[]): void {
    this.logText.setText(["Battle Log (전투 로그)", ...lines.slice(0, 8)]);
  }

  private drawLayout(player: PlayerState, effectiveStats: EffectivePlayerStats, monster: MonsterInstance): void {
    this.graphics.clear();
    this.drawPanel({ x: 24, y: 72, width: 1232, height: 34 });
    this.drawPanel({ x: 24, y: 118, width: 280, height: 386 });
    this.drawPanel({ x: 328, y: 118, width: 552, height: 386 });
    this.drawPanel({ x: 904, y: 118, width: 352, height: 386 });
    this.drawPanel({ x: 24, y: 526, width: 1232, height: 170 });

    this.drawPlayerPlaceholder();
    this.drawMonsterPlaceholder(monster.data.role);
    this.drawHpBar(48, 288, 230, 18, player.hp, effectiveStats.maxHp);
    this.drawHpBar(588, 330, 250, 18, monster.currentHp, monster.data.maxHp);
  }

  private drawPanel(bounds: PanelBounds): void {
    this.graphics.fillStyle(PANEL_FILL, 0.96);
    this.graphics.fillRoundedRect(bounds.x, bounds.y, bounds.width, bounds.height, 8);
    this.graphics.lineStyle(1, PANEL_STROKE, 1);
    this.graphics.strokeRoundedRect(bounds.x, bounds.y, bounds.width, bounds.height, 8);
  }

  private drawPlayerPlaceholder(): void {
    this.graphics.fillStyle(PLAYER_COLOR, 1);
    this.graphics.fillRoundedRect(424, 190, 74, 94, 10);
    this.graphics.fillStyle(0xcfe8ff, 1);
    this.graphics.fillCircle(461, 176, 24);
    this.graphics.lineStyle(3, 0x1f5f9f, 1);
    this.graphics.strokeRoundedRect(424, 190, 74, 94, 10);
  }

  private drawMonsterPlaceholder(role: MonsterRole): void {
    const visual = this.getMonsterVisual(role);
    this.graphics.fillStyle(visual.color, 1);
    this.graphics.fillCircle(748, 234, visual.radius);
    this.graphics.lineStyle(3, visual.strokeColor, 1);
    this.graphics.strokeCircle(748, 234, visual.radius);
  }

  private drawHpBar(x: number, y: number, width: number, height: number, current: number, max: number): void {
    const ratio = max > 0 ? Phaser.Math.Clamp(current / max, 0, 1) : 0;
    const color = ratio <= 0.3 ? HP_LOW_COLOR : HP_COLOR;

    this.graphics.fillStyle(BAR_BG, 1);
    this.graphics.fillRoundedRect(x, y, width, height, 6);
    this.graphics.fillStyle(color, 1);
    this.graphics.fillRoundedRect(x, y, Math.max(4, width * ratio), height, 6);
    this.graphics.lineStyle(1, 0x93a4b8, 1);
    this.graphics.strokeRoundedRect(x, y, width, height, 6);
  }

  private textStyle(color: string, fontSize = "16px", wordWrapWidth = 320): Phaser.Types.GameObjects.Text.TextStyle {
    return {
      fontFamily: "Segoe UI",
      fontSize,
      color,
      lineSpacing: 6,
      wordWrap: { width: wordWrapWidth, useAdvancedWrap: true },
    };
  }

  private getSlotLabel(slot: string): string {
    const labels: Record<string, string> = {
      weapon: "Weapon (무기)",
      armor: "Armor (방어구)",
      accessory: "Accessory (장신구)",
    };

    return labels[slot] ?? slot;
  }

  private getEncounterLabel(encounterType: string): string {
    const labels: Record<string, string> = {
      normal: "Normal (일반)",
      leader: "Leader (리더)",
      boss: "Boss (보스)",
    };

    return labels[encounterType] ?? encounterType;
  }

  private getMonsterStateLabel(state: MonsterRuntimeState): string {
    const labels: Record<MonsterRuntimeState, string> = {
      spawning: "Spawning (생성 중)",
      idle: "Idle (대기)",
      attacking: "Attacking (공격 중)",
      stunned: "Stunned (기절)",
      dead: "Dead (사망)",
    };

    return labels[state];
  }

  private getSkillStatus(player: PlayerState, skill: SkillCooldownView): string {
    if (player.level < skill.requiredLevel || !skill.unlocked) {
      return `Lv ${skill.requiredLevel} 필요`;
    }

    if (skill.ready) {
      return "준비됨";
    }

    return `${(skill.cooldownRemainingMs / 1000).toFixed(1)}s`;
  }

  private getMonsterVisual(role: MonsterRole): { color: number; strokeColor: number; radius: number } {
    if (role === "boss") {
      return { color: 0xff5e57, strokeColor: 0xffc1bd, radius: 62 };
    }

    if (role === "leader") {
      return { color: 0xf4c95d, strokeColor: 0xffebad, radius: 48 };
    }

    return { color: 0x61d394, strokeColor: 0xb8f7cf, radius: 38 };
  }

  private createSkillLines(player: PlayerState, skillCooldowns: SkillCooldownView[]): string[] {
    if (skillCooldowns.length === 0) {
      return ["- 비어 있음"];
    }

    return skillCooldowns.map((skill) => `- ${skill.skillName}: ${this.getSkillStatus(player, skill)}`);
  }

  private createInventorySummary(inventory: InventoryEntry[]): string {
    if (inventory.length === 0) {
      return "비어 있음";
    }

    const visibleItems = inventory.slice(0, 6).map((entry) => `${entry.itemId} x${entry.quantity}`);
    const hiddenCount = inventory.length - visibleItems.length;
    return hiddenCount > 0 ? `${visibleItems.join(" / ")} / 외 ${hiddenCount}개` : visibleItems.join(" / ");
  }
}
