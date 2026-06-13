import type {
  EffectivePlayerStats,
  EquippedItemView,
  EquipmentStatBonus,
  InventoryEntry,
  MonsterInstance,
  PlayerState,
  SkillCooldownView,
  StageData,
  StageEncounterType,
} from "../types/GameTypes";

export class Hud {
  private readonly playerText: Phaser.GameObjects.Text;
  private readonly stageText: Phaser.GameObjects.Text;
  private readonly monsterText: Phaser.GameObjects.Text;
  private readonly inventoryText: Phaser.GameObjects.Text;
  private readonly logText: Phaser.GameObjects.Text;

  constructor(scene: Phaser.Scene, title: string, subtitle: string) {
    scene.add.text(32, 24, title, {
      fontFamily: "Segoe UI",
      fontSize: "24px",
      color: "#f4f0df",
    });

    scene.add.text(32, 58, subtitle, {
      fontFamily: "Segoe UI",
      fontSize: "14px",
      color: "#aeb7c7",
    });

    this.stageText = scene.add.text(32, 104, "", this.textStyle("#9bd0ff"));
    this.playerText = scene.add.text(32, 170, "", this.textStyle("#f4f0df"));
    this.monsterText = scene.add.text(520, 170, "", this.textStyle("#ffd1a3"));
    this.inventoryText = scene.add.text(32, 350, "", this.textStyle("#b8f0c2"));
    this.logText = scene.add.text(520, 350, "", this.textStyle("#e3e8f2"));
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
    this.stageText.setText([
      `스테이지: ${stage.name}`,
      `진행: ${stage.requiredNormalKills}마리 중 ${Math.min(normalKills, stage.requiredNormalKills)}마리 처치`,
      `전투 단계: ${this.getEncounterLabel(encounterType)}`,
    ]);

    this.playerText.setText([
      "수습기사 전민재",
      `Lv ${player.level} / HP ${player.hp}/${effectiveStats.maxHp} (기본 ${player.maxHp} + 장비 ${equipmentBonus.maxHp})`,
      `ATK ${effectiveStats.attack} (기본 ${player.attack} + 장비 ${equipmentBonus.attack})`,
      `DEF ${effectiveStats.defense} (기본 ${player.defense} + 장비 ${equipmentBonus.defense})`,
      `EXP ${player.exp}/${requiredExp} / 누적 ${player.totalExp}`,
      `골드 ${player.gold}`,
    ]);

    this.monsterText.setText([
      `대상: ${monster.data.name}`,
      `역할: ${this.getEncounterLabel(monster.data.role)}`,
      `상태: ${this.getMonsterStateLabel(monster.currentState)}`,
      `HP ${monster.currentHp}/${monster.data.maxHp}`,
      `ATK ${monster.data.attack} / DEF ${monster.data.defense}`,
    ]);

    const inventoryLines = inventory.length > 0
      ? inventory.map((entry) => `${entry.itemId} x${entry.quantity}`)
      : ["비어 있음"];
    const equipmentLines = equippedItems.map((item) => `${this.getSlotLabel(item.slot)}: ${item.name}`);
    const skillLines = skillCooldowns.length > 0
      ? skillCooldowns.map((skill) => `${skill.skillName}: ${this.getSkillStatus(player, skill)}`)
      : ["비어 있음"];

    this.inventoryText.setText([
      "스킬",
      ...skillLines,
      "",
      "장비",
      ...equipmentLines,
      `장비 보너스 HP +${equipmentBonus.maxHp} / ATK +${equipmentBonus.attack} / DEF +${equipmentBonus.defense}`,
      "",
      "인벤토리",
      ...inventoryLines,
    ]);
  }

  setLog(lines: string[]): void {
    this.logText.setText(["전투 로그", ...lines.slice(0, 6)]);
  }

  private textStyle(color: string): Phaser.Types.GameObjects.Text.TextStyle {
    return {
      fontFamily: "Segoe UI",
      fontSize: "18px",
      color,
      lineSpacing: 8,
    };
  }

  private getSlotLabel(slot: string): string {
    const labels: Record<string, string> = {
      weapon: "무기",
      armor: "방어구",
      accessory: "장신구",
    };

    return labels[slot] ?? slot;
  }

  private getEncounterLabel(encounterType: string): string {
    const labels: Record<string, string> = {
      normal: "일반 몬스터",
      leader: "리더 몬스터",
      boss: "보스 몬스터",
    };

    return labels[encounterType] ?? encounterType;
  }

  private getMonsterStateLabel(state: string): string {
    const labels: Record<string, string> = {
      spawning: "생성 중",
      idle: "대기",
      attacking: "공격 중",
      stunned: "기절",
      dead: "사망",
    };

    return labels[state] ?? state;
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
}
