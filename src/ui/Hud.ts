import type { InventoryEntry, MonsterInstance, PlayerState, StageData, StageEncounterType } from "../types/GameTypes";

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
    monster: MonsterInstance,
    inventory: InventoryEntry[],
  ): void {
    this.stageText.setText([
      `스테이지: ${stage.name}`,
      `진행: ${stage.requiredNormalKills}마리 중 ${Math.min(normalKills, stage.requiredNormalKills)}마리 처치`,
      `전투 단계: ${encounterType}`,
    ]);

    this.playerText.setText([
      "수습기사 전민재",
      `Lv ${player.level} / HP ${player.hp}/${player.maxHp}`,
      `ATK ${player.attack} / DEF ${player.defense}`,
      `EXP ${player.exp} / Gold ${player.gold}`,
    ]);

    this.monsterText.setText([
      `대상: ${monster.data.name}`,
      `Role: ${monster.data.role}`,
      `State: ${monster.currentState}`,
      `HP ${monster.currentHp}/${monster.data.maxHp}`,
      `ATK ${monster.data.attack} / DEF ${monster.data.defense}`,
    ]);

    const inventoryLines = inventory.length > 0
      ? inventory.map((entry) => `${entry.itemId} x${entry.quantity}`)
      : ["비어 있음"];
    this.inventoryText.setText(["인벤토리", ...inventoryLines]);
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
}
