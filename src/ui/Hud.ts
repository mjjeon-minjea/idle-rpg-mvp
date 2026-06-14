import type {
  EffectivePlayerStats,
  EquipmentSlot,
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
import { getItemIconAsset, getMonsterAsset } from "../assets/AssetRegistry";

const PANEL_FILL = 0x171b22;
const PANEL_STROKE = 0x2b3440;
const BAR_BG = 0x29313d;
const PLAYER_COLOR = 0x4f9cff;
const HP_COLOR = 0x55d66b;
const HP_LOW_COLOR = 0xff6b6b;
const EQUIPMENT_ICON_SIZE = 38;
const BUTTON_FILL = 0x202733;
const BUTTON_ACTIVE_FILL = 0x2f7cc0;
const BUTTON_LOCKED_FILL = 0x242833;
const BUTTON_STROKE = 0x526171;
const BUTTON_ACTIVE_STROKE = 0xffd35a;

type RightMenuKey = "skill" | "equipment" | "inventory" | "quest";
type CombatControlMode = "manual" | "auto" | "auto1_5" | "auto2";

const RIGHT_MENU_ITEMS: Array<{ key: RightMenuKey; label: string; shortLabel: string; x: number; y: number }> = [
  { key: "skill", label: "스킬", shortLabel: "스", x: 1080, y: 232 },
  { key: "equipment", label: "장비", shortLabel: "장", x: 1080, y: 306 },
  { key: "inventory", label: "가방", shortLabel: "가", x: 1080, y: 380 },
  { key: "quest", label: "퀘스트", shortLabel: "퀘", x: 1080, y: 454 },
];

const COMBAT_CONTROL_MODES: Array<{ key: CombatControlMode; label: string; shortLabel: string; locked: boolean }> = [
  { key: "manual", label: "수동", shortLabel: "수동", locked: false },
  { key: "auto", label: "오토", shortLabel: "오토", locked: false },
  { key: "auto1_5", label: "오토 x1.5", shortLabel: "x1.5", locked: true },
  { key: "auto2", label: "오토 x2", shortLabel: "x2", locked: true },
];

const EQUIPMENT_ICON_SLOTS: Array<{ slot: EquipmentSlot; label: string; x: number; y: number }> = [
  { slot: "weapon", label: "WPN", x: 430, y: 632 },
  { slot: "helmet", label: "HELM", x: 482, y: 632 },
  { slot: "armor", label: "ARM", x: 534, y: 632 },
  { slot: "boots", label: "BOOT", x: 586, y: 632 },
  { slot: "necklace", label: "NECK", x: 638, y: 632 },
  { slot: "ring", label: "RING", x: 690, y: 632 },
];

interface PanelBounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface UiButtonView {
  container: Phaser.GameObjects.Container;
  background: Phaser.GameObjects.Rectangle;
  primaryText: Phaser.GameObjects.Text;
  secondaryText?: Phaser.GameObjects.Text;
  locked?: boolean;
}

export interface OwnedEquipmentView {
  itemId: string;
  name: string;
  quantity: number;
  slot: string;
}

export class Hud {
  private readonly graphics: Phaser.GameObjects.Graphics;
  private readonly monsterImage: Phaser.GameObjects.Image;
  private readonly equipmentIconImages = new Map<EquipmentSlot, Phaser.GameObjects.Image>();
  private readonly equipmentFallbackTexts = new Map<EquipmentSlot, Phaser.GameObjects.Text>();
  private readonly stageText: Phaser.GameObjects.Text;
  private readonly playerText: Phaser.GameObjects.Text;
  private readonly playerHpText: Phaser.GameObjects.Text;
  private readonly monsterText: Phaser.GameObjects.Text;
  private readonly monsterHpText: Phaser.GameObjects.Text;
  private readonly skillText: Phaser.GameObjects.Text;
  private readonly equipmentText: Phaser.GameObjects.Text;
  private readonly inventoryText: Phaser.GameObjects.Text;
  private readonly logText: Phaser.GameObjects.Text;
  private readonly monsterLabelText: Phaser.GameObjects.Text;
  private readonly rightMenuToggleButton: UiButtonView;
  private readonly rightMenuButtons = new Map<RightMenuKey, UiButtonView>();
  private readonly combatControlToggleButton: UiButtonView;
  private readonly combatControlButtons = new Map<CombatControlMode, UiButtonView>();
  private currentMonsterAssetKey?: string;
  private readonly currentEquipmentAssetKeys = new Map<EquipmentSlot, string | undefined>();
  private rightMenuExpanded = false;
  private selectedRightMenuKey: RightMenuKey = "skill";
  private combatControlExpanded = false;
  private selectedCombatControlMode: CombatControlMode = "auto";

  constructor(scene: Phaser.Scene, title: string, subtitle: string) {
    this.graphics = scene.add.graphics();
    this.monsterImage = scene.add.image(748, 226, "").setVisible(false).setDepth(1);
    this.createEquipmentIconObjects(scene);
    this.rightMenuToggleButton = this.createRightMenuObjects(scene);
    this.combatControlToggleButton = this.createCombatControlObjects(scene);

    scene.add.text(32, 18, title, this.textStyle("#f4f0df", "22px", 820));
    scene.add.text(32, 52, subtitle, this.textStyle("#aeb7c7", "14px", 820));

    this.stageText = scene.add.text(34, 80, "", this.textStyle("#9bd0ff", "15px", 1180));
    this.playerText = scene.add.text(48, 144, "", this.textStyle("#f4f0df", "15px", 245));
    this.playerHpText = scene.add.text(48, 286, "", this.textStyle("#e3e8f2", "14px", 245));
    this.monsterText = scene.add.text(360, 354, "", this.textStyle("#ffd1a3", "15px", 480));
    this.monsterHpText = scene.add.text(588, 306, "", this.textStyle("#e3e8f2", "14px", 250));
    this.skillText = scene.add.text(48, 546, "", this.textStyle("#d9f6dd", "14px", 350));
    this.equipmentText = scene.add.text(430, 546, "", this.textStyle("#f8e7b0", "14px", 360));
    this.inventoryText = scene.add.text(820, 546, "", this.textStyle("#d7e4ff", "14px", 395));
    this.logText = scene.add.text(928, 142, "", this.textStyle("#e3e8f2", "14px", 300));
    this.logText.setVisible(false);
    scene.add.text(420, 302, "수습기사", this.textStyle("#cfe8ff", "15px", 160));
    this.monsterLabelText = scene.add.text(710, 302, "", this.textStyle("#ffe1b8", "15px", 200));
    this.syncRightMenuVisibility();
    this.syncCombatControlVisibility();
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
    ownedEquipment: OwnedEquipmentView[],
    skillCooldowns: SkillCooldownView[],
    monster: MonsterInstance,
    inventory: InventoryEntry[],
  ): void {
    this.drawLayout(player, effectiveStats, monster);

    const nextExp = Math.max(0, requiredExp - player.exp);
    this.stageText.setText(
      [
        `Stage ${stage.order}/9: ${stage.id} | Region: ${this.getRegionLabel(stage.id)} | Encounter: ${this.getEncounterLabel(encounterType)}`,
        `Objective: ${this.getObjectiveText(stage, normalKills, encounterType)}`,
      ].join("\n"),
    );

    this.playerText.setText([
      "Player (플레이어)",
      `Lv ${player.level}`,
      `EXP ${player.exp} / ${requiredExp}`,
      `Next EXP ${nextExp}`,
      `Total EXP ${player.totalExp}`,
      `Gold ${player.gold}`,
      `ATK ${effectiveStats.attack} (Base ${player.attack} + Equip ${equipmentBonus.attack})`,
      `DEF ${effectiveStats.defense} (Base ${player.defense} + Equip ${equipmentBonus.defense})`,
    ]);

    this.playerHpText.setText(`HP ${player.hp} / ${effectiveStats.maxHp} (Base ${player.maxHp} + Equip ${equipmentBonus.maxHp})`);

    this.monsterText.setText([
      "Target (대상)",
      `${monster.data.name}`,
      `Type: ${this.getEncounterLabel(monster.data.role)}`,
      `State: ${this.getMonsterStateLabel(monster.currentState)}`,
      `ATK ${monster.data.attack} / DEF ${monster.data.defense}`,
    ]);

    this.monsterHpText.setText(`HP ${monster.currentHp} / ${monster.data.maxHp}`);
    this.monsterLabelText.setText(monster.data.name);

    this.skillText.setText([
      "Skills (스킬)",
      ...this.createSkillLines(player, skillCooldowns),
    ]);

    this.equipmentText.setText([
      "Equipped (장착)",
      `Slots: ${this.countEquippedItems(equippedItems)} / ${equippedItems.length}`,
      `Bonus: HP +${equipmentBonus.maxHp} / ATK +${equipmentBonus.attack} / DEF +${equipmentBonus.defense}`,
      "",
      "Icons: WPN / HELM / ARM / BOOT / NECK / RING",
      "",
      "Owned Equipment (보유 장비)",
      ...this.createOwnedEquipmentLines(ownedEquipment),
    ]);

    this.inventoryText.setText([
      "Inventory (인벤토리)",
      this.createInventorySummary(inventory),
    ]);
    this.updateEquipmentIcons(equippedItems);
    this.syncRightMenuVisibility();
    this.syncCombatControlVisibility();
  }

  setLog(lines: string[]): void {
    void lines;
    this.logText.setVisible(false);
  }

  private drawLayout(player: PlayerState, effectiveStats: EffectivePlayerStats, monster: MonsterInstance): void {
    this.graphics.clear();
    this.drawPanel({ x: 24, y: 72, width: 1232, height: 52 });
    this.drawPanel({ x: 24, y: 136, width: 280, height: 374 });
    this.drawPanel({ x: 328, y: 136, width: 552, height: 374 });
    this.drawPanel({ x: 904, y: 136, width: 352, height: 374 });
    this.drawPanel({ x: 24, y: 526, width: 1232, height: 170 });

    this.drawPlayerPlaceholder();
    this.updateMonsterImage(monster);
    if (!this.monsterImage.visible) {
      this.drawMonsterPlaceholder(monster.data.role);
    }
    this.drawEquipmentIconSlots();
    this.drawHpBar(48, 316, 230, 18, player.hp, effectiveStats.maxHp);
    this.drawHpBar(588, 336, 250, 18, monster.currentHp, monster.data.maxHp);
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

  private createRightMenuObjects(scene: Phaser.Scene): UiButtonView {
    const toggleButton = this.createUiButton(scene, 1080, 166, 126, 56, "메뉴", "", () => {
      this.rightMenuExpanded = !this.rightMenuExpanded;
      this.syncRightMenuVisibility();
    });

    for (const item of RIGHT_MENU_ITEMS) {
      const button = this.createUiButton(scene, item.x, item.y, 126, 58, item.shortLabel, item.label, () => {
        this.selectedRightMenuKey = item.key;
        this.syncRightMenuVisibility();
      });
      this.rightMenuButtons.set(item.key, button);
    }

    return toggleButton;
  }

  private createCombatControlObjects(scene: Phaser.Scene): UiButtonView {
    const toggleButton = this.createUiButton(scene, 108, 642, 104, 54, "오토", "전투", () => {
      this.combatControlExpanded = !this.combatControlExpanded;
      this.syncCombatControlVisibility();
    });

    COMBAT_CONTROL_MODES.forEach((mode, index) => {
      const x = 74 + index * 90;
      const secondary = mode.locked ? "잠금" : mode.label;
      const button = this.createUiButton(scene, x, 642, 80, 54, mode.shortLabel, secondary, () => {
        this.selectedCombatControlMode = mode.key;
        this.combatControlExpanded = false;
        this.syncCombatControlVisibility();
      }, mode.locked);
      this.combatControlButtons.set(mode.key, button);
    });

    return toggleButton;
  }

  private createUiButton(
    scene: Phaser.Scene,
    x: number,
    y: number,
    width: number,
    height: number,
    primaryLabel: string,
    secondaryLabel: string,
    onClick: () => void,
    locked = false,
  ): UiButtonView {
    const background = scene.add
      .rectangle(0, 0, width, height, locked ? BUTTON_LOCKED_FILL : BUTTON_FILL, 0.96)
      .setStrokeStyle(2, BUTTON_STROKE, 1);
    const primaryText = scene.add
      .text(0, secondaryLabel ? -15 : -11, primaryLabel, this.textStyle("#f4f0df", "18px", width - 12))
      .setOrigin(0.5);
    const children: Phaser.GameObjects.GameObject[] = [background, primaryText];
    let secondaryText: Phaser.GameObjects.Text | undefined;

    if (secondaryLabel) {
      secondaryText = scene.add
        .text(0, 13, secondaryLabel, this.textStyle(locked ? "#9da7b5" : "#c8d8f0", "11px", width - 12))
        .setOrigin(0.5);
      children.push(secondaryText);
    }

    const container = scene.add.container(x, y, children).setDepth(6);
    container.setSize(width, height);
    container.setInteractive(
      new Phaser.Geom.Rectangle(-width / 2, -height / 2, width, height),
      Phaser.Geom.Rectangle.Contains,
    );
    container.on("pointerdown", onClick);
    container.on("pointerover", () => container.setScale(1.03));
    container.on("pointerout", () => container.setScale(1));

    return { container, background, primaryText, secondaryText, locked };
  }

  private syncRightMenuVisibility(): void {
    this.rightMenuToggleButton.primaryText.setText(this.rightMenuExpanded ? "접기" : "메뉴");
    this.setUiButtonState(this.rightMenuToggleButton, false, true);

    for (const item of RIGHT_MENU_ITEMS) {
      const button = this.rightMenuButtons.get(item.key);
      if (!button) {
        continue;
      }

      this.setUiButtonState(button, item.key === this.selectedRightMenuKey, this.rightMenuExpanded);
    }
  }

  private syncCombatControlVisibility(): void {
    const selectedMode = COMBAT_CONTROL_MODES.find((mode) => mode.key === this.selectedCombatControlMode) ?? COMBAT_CONTROL_MODES[1];
    this.combatControlToggleButton.primaryText.setText(selectedMode.shortLabel);
    this.combatControlToggleButton.secondaryText?.setText("전투");
    this.setUiButtonState(this.combatControlToggleButton, true, !this.combatControlExpanded, selectedMode.locked);

    for (const mode of COMBAT_CONTROL_MODES) {
      const button = this.combatControlButtons.get(mode.key);
      if (!button) {
        continue;
      }

      this.setUiButtonState(button, mode.key === this.selectedCombatControlMode, this.combatControlExpanded, mode.locked);
    }
  }

  private setUiButtonState(button: UiButtonView, active: boolean, visible: boolean, locked = button.locked ?? false): void {
    button.container.setVisible(visible);
    button.container.setAlpha(locked && !active ? 0.72 : 1);
    button.background.setFillStyle(active ? BUTTON_ACTIVE_FILL : locked ? BUTTON_LOCKED_FILL : BUTTON_FILL, 0.96);
    button.background.setStrokeStyle(active ? 3 : 2, active ? BUTTON_ACTIVE_STROKE : BUTTON_STROKE, 1);
  }

  private createEquipmentIconObjects(scene: Phaser.Scene): void {
    for (const slot of EQUIPMENT_ICON_SLOTS) {
      const image = scene.add.image(slot.x, slot.y, "").setDisplaySize(32, 32).setVisible(false).setDepth(1);
      const fallbackText = scene.add
        .text(slot.x, slot.y - 11, "?", this.textStyle("#aeb7c7", "18px", 34))
        .setOrigin(0.5, 0)
        .setDepth(2)
        .setVisible(false);
      scene.add
        .text(slot.x, slot.y + 22, slot.label, this.textStyle("#aeb7c7", "9px", 44))
        .setOrigin(0.5, 0)
        .setDepth(2);

      this.equipmentIconImages.set(slot.slot, image);
      this.equipmentFallbackTexts.set(slot.slot, fallbackText);
    }
  }

  private drawEquipmentIconSlots(): void {
    for (const slot of EQUIPMENT_ICON_SLOTS) {
      const x = slot.x - EQUIPMENT_ICON_SIZE / 2;
      const y = slot.y - EQUIPMENT_ICON_SIZE / 2;
      this.graphics.fillStyle(0x202733, 1);
      this.graphics.fillRoundedRect(x, y, EQUIPMENT_ICON_SIZE, EQUIPMENT_ICON_SIZE, 6);
      this.graphics.lineStyle(1, 0x526171, 1);
      this.graphics.strokeRoundedRect(x, y, EQUIPMENT_ICON_SIZE, EQUIPMENT_ICON_SIZE, 6);
    }
  }

  private updateEquipmentIcons(equippedItems: EquippedItemView[]): void {
    const equippedBySlot = new Map(equippedItems.map((item) => [item.slot, item]));

    for (const slot of EQUIPMENT_ICON_SLOTS) {
      const item = equippedBySlot.get(slot.slot);
      const image = this.equipmentIconImages.get(slot.slot);
      const fallbackText = this.equipmentFallbackTexts.get(slot.slot);
      if (!image || !fallbackText) {
        continue;
      }

      const itemId = item?.itemId;
      if (!itemId) {
        this.currentEquipmentAssetKeys.set(slot.slot, undefined);
        image.setVisible(false);
        fallbackText.setVisible(false);
        continue;
      }

      const asset = getItemIconAsset(itemId);
      if (!asset || !image.scene.textures.exists(asset.key)) {
        this.currentEquipmentAssetKeys.set(slot.slot, undefined);
        image.setVisible(false);
        fallbackText.setVisible(true);
        continue;
      }

      if (this.currentEquipmentAssetKeys.get(slot.slot) !== asset.key) {
        this.currentEquipmentAssetKeys.set(slot.slot, asset.key);
        image.setTexture(asset.key);
        image.setDisplaySize(32, 32);
      }

      image.setVisible(true);
      fallbackText.setVisible(false);
    }
  }

  private updateMonsterImage(monster: MonsterInstance): void {
    const asset = getMonsterAsset(monster.data.id);
    if (!asset || !this.monsterImage.scene.textures.exists(asset.key)) {
      this.currentMonsterAssetKey = undefined;
      this.monsterImage.setVisible(false);
      return;
    }

    if (this.currentMonsterAssetKey !== asset.key) {
      this.currentMonsterAssetKey = asset.key;
      this.monsterImage.setTexture(asset.key);
      const size = this.getMonsterImageSize(monster.data.role, monster.data.id);
      this.monsterImage.setDisplaySize(size.width, size.height);
    }

    this.monsterImage.setVisible(true);
  }

  private getMonsterImageSize(role: MonsterRole, monsterId: string): { width: number; height: number } {
    if (monsterId === "ancient_mine_guardian") {
      return { width: 190, height: 190 };
    }

    if (role === "boss") {
      return { width: 170, height: 170 };
    }

    if (role === "leader") {
      return { width: 138, height: 138 };
    }

    return { width: 112, height: 112 };
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
    const expandedLabels: Record<string, string> = {
      weapon: "Weapon (무기)",
      helmet: "Helmet (투구)",
      armor: "Armor (갑옷)",
      boots: "Boots (신발)",
      necklace: "Necklace (목걸이)",
      ring: "Ring (반지)",
    };

    if (expandedLabels[slot]) {
      return expandedLabels[slot];
    }

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
      return "Ready (준비됨)";
    }

    return `${(skill.cooldownRemainingMs / 1000).toFixed(1)}s`;
  }

  private getRegionLabel(stageId: string): string {
    if (stageId.startsWith("dawn_forest")) {
      return "Dawn Forest (새벽 숲)";
    }

    if (stageId.startsWith("mist_gate")) {
      return "Mist Gate (안개 관문)";
    }

    if (stageId.startsWith("old_mine")) {
      return "Old Mine (오래된 광산)";
    }

    return "Unknown (미확인)";
  }

  private getObjectiveText(stage: StageData, normalKills: number, encounterType: StageEncounterType): string {
    if (encounterType === "normal") {
      return `Defeat normal monsters ${Math.min(normalKills, stage.requiredNormalKills)} / ${stage.requiredNormalKills}`;
    }

    if (encounterType === "leader") {
      return stage.bossMonsterId ? "Defeat leader, then boss appears" : "Defeat leader to clear stage";
    }

    return "Defeat boss to clear stage";
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
      return ["- Empty (없음)"];
    }

    return skillCooldowns.map((skill) => `- ${skill.skillName}: ${this.getSkillStatus(player, skill)}`);
  }

  private countEquippedItems(equippedItems: EquippedItemView[]): number {
    return equippedItems.filter((item) => item.itemId).length;
  }

  private createOwnedEquipmentLines(ownedEquipment: OwnedEquipmentView[]): string[] {
    if (ownedEquipment.length === 0) {
      return ["- Empty (없음)"];
    }

    return ownedEquipment
      .slice(0, 3)
      .map((item) => `- ${this.getSlotLabel(item.slot)}: ${item.itemId} x${item.quantity}`);
  }

  private createInventorySummary(inventory: InventoryEntry[]): string {
    if (inventory.length === 0) {
      return "Empty (없음)";
    }

    const visibleItems = inventory.slice(0, 6).map((entry) => `${entry.itemId} x${entry.quantity}`);
    const hiddenCount = inventory.length - visibleItems.length;
    return hiddenCount > 0 ? `${visibleItems.join(" / ")} / +${hiddenCount} more` : visibleItems.join(" / ");
  }
}
