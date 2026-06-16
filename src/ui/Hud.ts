import type {
  EffectivePlayerStats,
  EquipmentSlot,
  EquippedItemView,
  EquipmentStatBonus,
  InventoryEntry,
  MonsterInstance,
  MonsterRole,
  PlayerState,
  SkillCooldownView,
  StageData,
  StageEncounterType,
} from "../types/GameTypes";
import { getEffectAsset, getMonsterAsset, getPlayerAsset, getUiCoreAsset } from "../assets/AssetRegistry";

const UI_DEPTH = 5;
const TEXT_DEPTH = 7;
const SPRITE_DEPTH = 3;
const PANEL_FILL = 0x111923;
const PANEL_STROKE = 0xd8a64e;
const PANEL_DARK_STROKE = 0x2a3644;
const BUTTON_FILL = 0x243140;
const BUTTON_ACTIVE_FILL = 0xf4b83f;
const BUTTON_LOCKED_FILL = 0x163151;
const BUTTON_STROKE = 0x56687b;
const BUTTON_ACTIVE_STROKE = 0xffdf7a;
const BAR_BG = 0x1e2631;
const HP_COLOR = 0x35d66f;
const HP_LOW_COLOR = 0xff5f5f;
const MONSTER_HP_COLOR = 0xe53935;
const EMPTY_SLOT_FILL = 0x202833;
const SKILL_SLOT_SIZE = 84;
const RIGHT_MENU_PANEL_ASSET_SIZE = { width: 136, height: 486 };
const SKILL_SLOT_BAR_ASSET_SIZE = { width: 580, height: 132 };

type RightMenuKey = "skill" | "equipment" | "inventory" | "quest";
type CombatControlMode = "manual" | "auto" | "auto1_5" | "auto2";

const RIGHT_MENU_ITEMS: Array<{ key: RightMenuKey; label: string; icon: string; assetId: string; x: number; y: number }> = [
  { key: "skill", label: "스킬", icon: "✦", assetId: "skill_menu_icon", x: 1180, y: 248 },
  { key: "equipment", label: "장비", icon: "갑", assetId: "equipment_menu_icon", x: 1180, y: 342 },
  { key: "inventory", label: "가방", icon: "▣", assetId: "inventory_menu_icon", x: 1180, y: 436 },
  { key: "quest", label: "퀘스트", icon: "문", assetId: "quest_menu_icon", x: 1180, y: 530 },
];

const COMBAT_CONTROL_MODES: Array<{ key: CombatControlMode; label: string; icon: string; locked: boolean }> = [
  { key: "manual", label: "수동", icon: "손", locked: false },
  { key: "auto", label: "오토", icon: "검", locked: false },
  { key: "auto1_5", label: "x1.5", icon: "🔒", locked: true },
  { key: "auto2", label: "x2", icon: "🔒", locked: true },
];

const EQUIPMENT_ICON_SLOTS: Array<{ slot: EquipmentSlot; label: string; x: number; y: number }> = [
  { slot: "weapon", label: "무기", x: 48, y: 238 },
  { slot: "helmet", label: "투구", x: 88, y: 238 },
  { slot: "armor", label: "갑옷", x: 128, y: 238 },
  { slot: "boots", label: "신발", x: 168, y: 238 },
  { slot: "necklace", label: "목걸이", x: 208, y: 238 },
  { slot: "ring", label: "반지", x: 248, y: 238 },
];

interface PanelBounds {
  x: number;
  y: number;
  width: number;
  height: number;
  radius?: number;
}

interface UiButtonView {
  container: Phaser.GameObjects.Container;
  background: Phaser.GameObjects.Rectangle;
  primaryText: Phaser.GameObjects.Text;
  secondaryText?: Phaser.GameObjects.Text;
  image?: Phaser.GameObjects.Image;
  style?: "default" | "imageBackground" | "menuIcon";
  locked?: boolean;
}

interface SkillSlotView {
  background: Phaser.GameObjects.Rectangle;
  frameImage: Phaser.GameObjects.Image;
  image: Phaser.GameObjects.Image;
  lockText: Phaser.GameObjects.Text;
  cooldownText: Phaser.GameObjects.Text;
}

export interface OwnedEquipmentView {
  itemId: string;
  name: string;
  quantity: number;
  slot: string;
}

export class Hud {
  private readonly graphics: Phaser.GameObjects.Graphics;
  private readonly playerNameText: Phaser.GameObjects.Text;
  private readonly playerLevelText: Phaser.GameObjects.Text;
  private readonly playerHpText: Phaser.GameObjects.Text;
  private readonly playerHpLabelText: Phaser.GameObjects.Text;
  private readonly stageTitleText: Phaser.GameObjects.Text;
  private readonly stageSubtitleText: Phaser.GameObjects.Text;
  private readonly goldText: Phaser.GameObjects.Text;
  private readonly diamondText: Phaser.GameObjects.Text;
  private readonly playerCombatHpText: Phaser.GameObjects.Text;
  private readonly playerImage: Phaser.GameObjects.Image;
  private readonly playerPortraitImage: Phaser.GameObjects.Image;
  private readonly monsterImage: Phaser.GameObjects.Image;
  private readonly monsterLabelText: Phaser.GameObjects.Text;
  private readonly monsterHpText: Phaser.GameObjects.Text;
  private readonly objectiveText: Phaser.GameObjects.Text;
  private readonly statText: Phaser.GameObjects.Text;
  private readonly equipmentBonusText: Phaser.GameObjects.Text;
  private readonly inventoryText: Phaser.GameObjects.Text;
  private readonly rightMenuPanelImage: Phaser.GameObjects.Image;
  private readonly rightMenuToggleButton: UiButtonView;
  private readonly rightMenuButtons = new Map<RightMenuKey, UiButtonView>();
  private readonly skillSlotBarImage: Phaser.GameObjects.Image;
  private readonly combatControlToggleButton: UiButtonView;
  private readonly combatControlButtons = new Map<CombatControlMode, UiButtonView>();
  private readonly equipmentIconImages = new Map<EquipmentSlot, Phaser.GameObjects.Image>();
  private readonly equipmentFallbackTexts = new Map<EquipmentSlot, Phaser.GameObjects.Text>();
  private readonly skillSlotViews: SkillSlotView[] = [];
  private currentMonsterAssetKey?: string;
  private rightMenuExpanded = true;
  private selectedRightMenuKey: RightMenuKey = "skill";
  private combatControlExpanded = false;
  private selectedCombatControlMode: CombatControlMode = "auto";

  constructor(scene: Phaser.Scene, _title: string, _subtitle: string) {
    this.graphics = scene.add.graphics().setDepth(UI_DEPTH);

    this.playerNameText = scene.add.text(102, 24, "", this.textStyle("#ffffff", "22px", 150)).setDepth(TEXT_DEPTH);
    this.playerLevelText = scene.add.text(222, 26, "", this.textStyle("#ffffff", "17px", 78)).setDepth(TEXT_DEPTH);
    this.playerHpText = scene.add.text(112, 76, "", this.textStyle("#ffffff", "14px", 140)).setDepth(TEXT_DEPTH);
    this.playerHpLabelText = scene.add.text(20, 92, "", this.textStyle("#d6efff", "12px", 90)).setDepth(TEXT_DEPTH);
    this.stageTitleText = scene.add.text(458, 24, "", this.textStyle("#ffffff", "22px", 260)).setOrigin(0.5, 0).setDepth(TEXT_DEPTH);
    this.stageSubtitleText = scene.add.text(458, 70, "", this.textStyle("#e9f2ff", "14px", 310)).setOrigin(0.5, 0).setDepth(TEXT_DEPTH);
    this.goldText = scene.add.text(786, 34, "", this.textStyle("#fff3d0", "17px", 108)).setDepth(TEXT_DEPTH);
    this.diamondText = scene.add.text(970, 34, "", this.textStyle("#eaf9ff", "17px", 108)).setDepth(TEXT_DEPTH);
    this.playerPortraitImage = scene.add.image(57, 56, "").setDisplaySize(64, 64).setVisible(false).setDepth(TEXT_DEPTH);

    this.createTopShortcutButton(scene, 1104, 56, "🏪", "상점", false);
    this.createTopShortcutButton(scene, 1194, 56, "✉", "편지함", true);

    scene.add.text(380, 192, "오계장", this.textStyle("#ffffff", "18px", 150)).setOrigin(0.5, 0).setDepth(TEXT_DEPTH);
    this.playerCombatHpText = scene.add.text(380, 232, "", this.textStyle("#ffffff", "16px", 180)).setOrigin(0.5, 0).setDepth(TEXT_DEPTH);
    this.playerImage = scene.add.image(380, 378, "").setDisplaySize(198, 294).setVisible(false).setDepth(SPRITE_DEPTH);
    this.monsterImage = scene.add.image(780, 306, "").setVisible(false).setDepth(SPRITE_DEPTH);
    this.monsterLabelText = scene.add.text(780, 192, "", this.textStyle("#ffffff", "18px", 190)).setOrigin(0.5, 0).setDepth(TEXT_DEPTH);
    this.monsterHpText = scene.add.text(780, 232, "", this.textStyle("#ffffff", "16px", 180)).setOrigin(0.5, 0).setDepth(TEXT_DEPTH);
    this.objectiveText = scene.add.text(448, 112, "", this.textStyle("#fff0bd", "14px", 410)).setOrigin(0.5, 0).setDepth(TEXT_DEPTH).setVisible(false);
    this.statText = scene.add.text(22, 132, "", this.textStyle("#edf4ff", "12px", 250)).setDepth(TEXT_DEPTH).setVisible(false);
    this.equipmentBonusText = scene.add.text(22, 264, "", this.textStyle("#f7e3a4", "11px", 250)).setDepth(TEXT_DEPTH).setVisible(false);
    this.inventoryText = scene.add.text(22, 296, "", this.textStyle("#d9e6ff", "11px", 250)).setDepth(TEXT_DEPTH).setVisible(false);
    this.rightMenuPanelImage = scene.add.image(1180, 404, "").setDepth(UI_DEPTH + 1).setVisible(false);
    this.skillSlotBarImage = scene.add.image(640, 636, "").setDepth(UI_DEPTH + 1).setVisible(false);
    this.setUiCoreImage(this.rightMenuPanelImage, "right_menu_panel", RIGHT_MENU_PANEL_ASSET_SIZE.width, RIGHT_MENU_PANEL_ASSET_SIZE.height);
    this.setUiCoreImage(this.skillSlotBarImage, "skill_slot_bar_6", SKILL_SLOT_BAR_ASSET_SIZE.width, SKILL_SLOT_BAR_ASSET_SIZE.height);

    this.createEquipmentIconObjects(scene);
    this.createSkillSlotObjects(scene);
    this.rightMenuToggleButton = this.createRightMenuObjects(scene);
    this.combatControlToggleButton = this.createCombatControlObjects(scene);
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
    this.drawLayout(player, effectiveStats, monster, equippedItems, skillCooldowns);

    const nextExp = Math.max(0, requiredExp - player.exp);
    this.playerNameText.setText("오계장");
    this.playerLevelText.setText(`Lv.${player.level}`);
    this.playerHpText.setText(`${player.hp} / ${effectiveStats.maxHp}`);
    this.playerHpLabelText.setText("HP");
    this.stageTitleText.setText(`스테이지 ${stage.order}-1`);
    this.stageSubtitleText.setText(`${this.getRegionLabel(stage.id)} | ${this.getEncounterLabel(encounterType)} ${Math.min(normalKills, stage.requiredNormalKills)}/${stage.requiredNormalKills}`);
    this.goldText.setText(`골드\n${player.gold.toLocaleString()}`);
    this.diamondText.setText("다이아\n1,000");
    this.objectiveText.setText(this.getObjectiveText(stage, normalKills, encounterType));
    this.playerCombatHpText.setText(`${player.hp} / ${effectiveStats.maxHp}`);
    this.monsterLabelText.setText(monster.data.name);
    this.monsterHpText.setText(`${monster.currentHp} / ${monster.data.maxHp}`);
    this.statText.setText(
      [
        `공격 ${effectiveStats.attack}  기본 ${player.attack} + 장비 ${equipmentBonus.attack}`,
        `방어 ${effectiveStats.defense}  기본 ${player.defense} + 장비 ${equipmentBonus.defense}`,
        `EXP ${player.exp} / ${requiredExp}  다음 ${nextExp}`,
      ].join("\n"),
    );
    this.equipmentBonusText.setText(`장비 HP +${equipmentBonus.maxHp} / ATK +${equipmentBonus.attack} / DEF +${equipmentBonus.defense}`);
    this.inventoryText.setText(this.createInventorySummary(inventory, ownedEquipment));

    this.hideEquipmentIconSlots();
    this.updateSkillSlots(player, skillCooldowns);
    this.syncRightMenuVisibility();
    this.syncCombatControlVisibility();
  }

  setLog(_lines: string[]): void {
    return;
  }

  private drawLayout(
    player: PlayerState,
    effectiveStats: EffectivePlayerStats,
    monster: MonsterInstance,
    _equippedItems: EquippedItemView[],
    _skillCooldowns: SkillCooldownView[],
  ): void {
    this.graphics.clear();
    this.drawTopPlayerPanel();
    this.drawTopStagePanel();
    this.drawCurrencyPanel(720, 14, 160, 72, "gold");
    this.drawCurrencyPanel(904, 14, 160, 72, "diamond");
    this.drawCenterCombatArea();
    this.drawRightMenuPanel();
    this.drawBottomCombatControlPanel();
    this.drawBottomSkillSlots();
    this.updatePlayerImage();
    this.updateMonsterImage(monster);
    if (!this.monsterImage.visible) {
      this.drawMonsterPlaceholder(monster.data.role);
    }
    this.drawHpBar(126, 74, 166, 22, player.hp, effectiveStats.maxHp, HP_COLOR);
    this.drawHpBar(310, 222, 210, 18, player.hp, effectiveStats.maxHp, HP_COLOR);
    this.drawHpBar(670, 222, 220, 18, monster.currentHp, monster.data.maxHp, MONSTER_HP_COLOR);
  }

  private drawTopPlayerPanel(): void {
    this.drawPanel({ x: 12, y: 12, width: 300, height: 112, radius: 12 }, 0.58);
    this.graphics.fillStyle(0x1a2531, 0.95);
    this.graphics.fillRoundedRect(22, 22, 70, 70, 10);
    this.graphics.lineStyle(2, 0xc7d8e9, 0.9);
    this.graphics.strokeRoundedRect(22, 22, 70, 70, 10);
  }

  private drawTopStagePanel(): void {
    this.drawPanel({ x: 374, y: 12, width: 260, height: 82, radius: 12 }, 0.72);
    this.graphics.fillStyle(0xf4d04f, 1);
    this.graphics.fillTriangle(394, 54, 406, 42, 418, 54);
    this.graphics.lineStyle(2, 0x1a222c, 1);
    this.graphics.strokeCircle(446, 62, 4);
    this.graphics.strokeCircle(466, 62, 4);
    this.graphics.strokeCircle(486, 62, 4);
    this.graphics.strokeCircle(506, 62, 4);
    this.graphics.strokeCircle(526, 62, 4);
    this.graphics.strokeCircle(546, 62, 4);
  }

  private drawCurrencyPanel(x: number, y: number, width: number, height: number, kind: "gold" | "diamond"): void {
    this.drawPanel({ x, y, width, height, radius: 12 }, 0.64);
    if (kind === "gold") {
      this.graphics.fillStyle(0xf4bd35, 1);
      this.graphics.fillCircle(x + 34, y + 36, 18);
      this.graphics.lineStyle(3, 0x7b4b16, 1);
      this.graphics.strokeCircle(x + 34, y + 36, 18);
      this.graphics.lineStyle(2, 0xffe58a, 0.9);
      this.graphics.strokeCircle(x + 34, y + 36, 10);
      return;
    }

    this.graphics.fillStyle(0x57ddff, 1);
    this.graphics.fillTriangle(x + 34, y + 18, x + 54, y + 36, x + 34, y + 56);
    this.graphics.fillStyle(0x2fb7f2, 1);
    this.graphics.fillTriangle(x + 34, y + 18, x + 14, y + 36, x + 34, y + 56);
    this.graphics.lineStyle(3, 0x0e5488, 1);
    this.graphics.strokeTriangle(x + 34, y + 18, x + 54, y + 36, x + 34, y + 56);
    this.graphics.strokeTriangle(x + 34, y + 18, x + 14, y + 36, x + 34, y + 56);
  }

  private drawCenterCombatArea(): void {
    this.graphics.fillStyle(0x0b1017, 0.035);
    this.graphics.fillRoundedRect(308, 146, 628, 318, 12);
  }

  private drawRightMenuPanel(): void {
    this.rightMenuPanelImage.setVisible(this.rightMenuExpanded && this.hasUiCoreTexture("right_menu_panel"));
    if (!this.rightMenuExpanded) {
      return;
    }

    if (this.rightMenuPanelImage.visible) {
      return;
    }

    this.drawPanel({ x: 1112, y: 160, width: 136, height: 488, radius: 18 }, 0.84, PANEL_STROKE);
  }

  private drawBottomCombatControlPanel(): void {
    if (!this.combatControlExpanded && this.hasUiCoreTexture("combat_control_collapsed")) {
      return;
    }

    this.drawPanel({ x: 54, y: 584, width: this.combatControlExpanded ? 344 : 132, height: 70, radius: 12 }, 0.86, PANEL_DARK_STROKE);
  }

  private drawBottomSkillSlots(): void {
    this.skillSlotBarImage.setVisible(this.hasUiCoreTexture("skill_slot_bar_6"));
    if (this.skillSlotBarImage.visible) {
      return;
    }

    this.drawPanel({ x: 350, y: 574, width: 580, height: 112, radius: 12 }, 0.46, PANEL_DARK_STROKE);
  }

  private drawPanel(bounds: PanelBounds, alpha = 0.92, stroke = PANEL_STROKE): void {
    const radius = bounds.radius ?? 8;
    this.graphics.fillStyle(PANEL_FILL, alpha);
    this.graphics.fillRoundedRect(bounds.x, bounds.y, bounds.width, bounds.height, radius);
    this.graphics.lineStyle(2, stroke, 0.9);
    this.graphics.strokeRoundedRect(bounds.x, bounds.y, bounds.width, bounds.height, radius);
  }

  private drawPlayerPlaceholder(): void {
    this.graphics.fillStyle(0x1f1b18, 0.28);
    this.graphics.fillEllipse(380, 460, 120, 26);

    this.graphics.lineStyle(7, 0x2f3a45, 1);
    this.graphics.lineBetween(360, 430, 348, 470);
    this.graphics.lineBetween(400, 430, 418, 470);
    this.graphics.lineStyle(6, 0x6b4a36, 1);
    this.graphics.lineBetween(338, 372, 316, 410);
    this.graphics.lineBetween(422, 370, 454, 395);

    this.graphics.fillStyle(0xbfc9d3, 1);
    this.graphics.fillRoundedRect(338, 356, 84, 86, 12);
    this.graphics.lineStyle(4, 0x252f3a, 1);
    this.graphics.strokeRoundedRect(338, 356, 84, 86, 12);
    this.graphics.fillStyle(0x7d8792, 1);
    this.graphics.fillTriangle(380, 365, 404, 438, 356, 438);
    this.graphics.fillStyle(0xb33a35, 1);
    this.graphics.fillTriangle(414, 360, 462, 394, 414, 404);

    this.graphics.fillStyle(0xd9b28d, 1);
    this.graphics.fillCircle(380, 322, 34);
    this.graphics.lineStyle(4, 0x27313b, 1);
    this.graphics.strokeCircle(380, 322, 34);
    this.graphics.fillStyle(0x6b4b35, 1);
    this.graphics.fillCircle(356, 302, 18);
    this.graphics.fillCircle(374, 292, 22);
    this.graphics.fillCircle(398, 300, 18);
    this.graphics.fillTriangle(352, 304, 370, 284, 374, 320);
    this.graphics.fillTriangle(388, 292, 412, 304, 392, 322);

    this.graphics.lineStyle(3, 0x26323d, 1);
    this.graphics.lineBetween(362, 323, 372, 325);
    this.graphics.lineBetween(389, 325, 399, 323);
    this.graphics.lineStyle(3, 0x7a4631, 1);
    this.graphics.lineBetween(372, 340, 388, 338);

    this.graphics.lineStyle(5, 0xe6edf5, 1);
    this.graphics.lineBetween(432, 382, 476, 450);
    this.graphics.lineStyle(3, 0x36485a, 1);
    this.graphics.strokeCircle(322, 392, 24);
  }

  private updatePlayerImage(): void {
    const asset = getPlayerAsset("o_gyejang_idle");
    if (!asset || !this.playerImage.scene.textures.exists(asset.key)) {
      this.playerImage.setVisible(false);
      this.playerPortraitImage.setVisible(false);
      this.drawPlayerPlaceholder();
      return;
    }

    this.playerImage.setTexture(asset.key).setDisplaySize(198, 294).setVisible(true);
    this.playerPortraitImage.setTexture(asset.key).setCrop(110, 80, 540, 540).setDisplaySize(84, 84).setVisible(true);
  }

  private drawMonsterPlaceholder(role: MonsterRole): void {
    const visual = this.getMonsterVisual(role);
    this.graphics.fillStyle(visual.color, 1);
    this.graphics.fillCircle(780, 342, visual.radius);
    this.graphics.lineStyle(4, visual.strokeColor, 1);
    this.graphics.strokeCircle(780, 342, visual.radius);
  }

  private drawHpBar(x: number, y: number, width: number, height: number, current: number, max: number, color: number): void {
    const ratio = max > 0 ? Phaser.Math.Clamp(current / max, 0, 1) : 0;
    const barColor = ratio <= 0.3 ? HP_LOW_COLOR : color;

    this.graphics.fillStyle(BAR_BG, 0.95);
    this.graphics.fillRoundedRect(x, y, width, height, 6);
    this.graphics.fillStyle(barColor, 1);
    this.graphics.fillRoundedRect(x, y, Math.max(4, width * ratio), height, 6);
    this.graphics.lineStyle(2, 0x111820, 1);
    this.graphics.strokeRoundedRect(x, y, width, height, 6);
  }

  private createRightMenuObjects(scene: Phaser.Scene): UiButtonView {
    const toggleButton = this.createImageUiButton(scene, 1180, 154, 128, 64, "collapse_chevron_button", "<", "", () => {
      this.rightMenuExpanded = !this.rightMenuExpanded;
      this.syncRightMenuVisibility();
    }, false, "24px", "imageBackground");

    for (const item of RIGHT_MENU_ITEMS) {
      const button = this.createImageUiButton(scene, item.x, item.y, 98, 88, item.assetId, item.icon, item.label, () => {
        this.selectedRightMenuKey = item.key;
        this.syncRightMenuVisibility();
      }, false, "18px", "menuIcon");
      this.rightMenuButtons.set(item.key, button);
    }

    return toggleButton;
  }

  private createCombatControlObjects(scene: Phaser.Scene): UiButtonView {
    const toggleButton = this.createImageUiButton(scene, 116, 619, 126, 52, "combat_control_collapsed", "검", "오토", () => {
      this.combatControlExpanded = !this.combatControlExpanded;
      this.syncCombatControlVisibility();
    }, false, "18px", "imageBackground");
    toggleButton.secondaryText?.setPosition(32, 0).setOrigin(0.5).setFontSize("18px").setColor("#ffffff");

    COMBAT_CONTROL_MODES.forEach((mode, index) => {
      const x = 106 + index * 82;
      const button = this.createUiButton(scene, x, 619, 70, 50, mode.icon, mode.label, () => {
        this.selectedCombatControlMode = mode.key;
        this.combatControlExpanded = false;
        this.syncCombatControlVisibility();
      }, mode.locked, "16px");
      this.combatControlButtons.set(mode.key, button);
    });

    return toggleButton;
  }

  private createImageUiButton(
    scene: Phaser.Scene,
    x: number,
    y: number,
    width: number,
    height: number,
    assetId: string,
    primaryLabel: string,
    secondaryLabel: string,
    onClick: () => void,
    locked = false,
    primaryFontSize = "18px",
    style: "imageBackground" | "menuIcon" = "imageBackground",
  ): UiButtonView {
    const background = scene.add
      .rectangle(0, 0, width, height, locked ? BUTTON_LOCKED_FILL : BUTTON_FILL, 0.97)
      .setStrokeStyle(2, BUTTON_STROKE, 1);
    const imageY = style === "menuIcon" ? -12 : 0;
    const imageSize = style === "menuIcon" ? 58 : width;
    const imageHeight = style === "menuIcon" ? 58 : height;
    const image = scene.add.image(0, imageY, "").setVisible(false);
    const hasImage = this.setUiCoreImage(image, assetId, imageSize, imageHeight);
    const primaryText = scene.add
      .text(0, secondaryLabel ? -12 : 0, primaryLabel, this.textStyle("#ffffff", primaryFontSize, width - 10))
      .setOrigin(0.5)
      .setVisible(!hasImage || style === "imageBackground");
    const children: Phaser.GameObjects.GameObject[] = [background, image, primaryText];
    let secondaryText: Phaser.GameObjects.Text | undefined;

    if (secondaryLabel) {
      secondaryText = scene.add
        .text(0, style === "menuIcon" ? 32 : 14, secondaryLabel, this.textStyle(locked ? "#b5c0ce" : "#ffffff", style === "menuIcon" ? "18px" : "13px", width - 10))
        .setOrigin(0.5);
      children.push(secondaryText);
    }

    if (hasImage && style === "menuIcon") {
      background.setVisible(false);
    }

    if (hasImage && style === "imageBackground") {
      background.setVisible(false);
    }

    const container = scene.add.container(x, y, children).setDepth(TEXT_DEPTH);
    container.setSize(width, height);
    container.setInteractive(
      new Phaser.Geom.Rectangle(-width / 2, -height / 2, width, height),
      Phaser.Geom.Rectangle.Contains,
    );
    container.on("pointerdown", onClick);
    container.on("pointerover", () => container.setScale(1.03));
    container.on("pointerout", () => container.setScale(1));

    return { container, background, primaryText, secondaryText, image, style, locked };
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
    primaryFontSize = "18px",
  ): UiButtonView {
    const background = scene.add
      .rectangle(0, 0, width, height, locked ? BUTTON_LOCKED_FILL : BUTTON_FILL, 0.97)
      .setStrokeStyle(2, BUTTON_STROKE, 1);
    const primaryText = scene.add
      .text(0, secondaryLabel ? -15 : 0, primaryLabel, this.textStyle("#ffffff", primaryFontSize, width - 10))
      .setOrigin(0.5);
    const children: Phaser.GameObjects.GameObject[] = [background, primaryText];
    let secondaryText: Phaser.GameObjects.Text | undefined;

    if (secondaryLabel) {
      secondaryText = scene.add
        .text(0, 16, secondaryLabel, this.textStyle(locked ? "#b5c0ce" : "#ffffff", "13px", width - 10))
        .setOrigin(0.5);
      children.push(secondaryText);
    }

    const container = scene.add.container(x, y, children).setDepth(TEXT_DEPTH);
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

  private createTopShortcutButton(
    scene: Phaser.Scene,
    x: number,
    y: number,
    icon: string,
    label: string,
    showNotification: boolean,
  ): void {
    const iconText = scene.add
      .text(0, -8, icon, this.textStyle("#ffffff", "38px", 70))
      .setOrigin(0.5);
    const labelText = scene.add
      .text(0, 30, label, this.textStyle("#ffffff", "18px", 76))
      .setOrigin(0.5);
    const children: Phaser.GameObjects.GameObject[] = [iconText, labelText];

    if (showNotification) {
      const notificationDot = scene.add
        .circle(28, -30, 7, 0xe93b4d, 1)
        .setStrokeStyle(2, 0xffffff, 1);
      children.push(notificationDot);
    }

    const container = scene.add.container(x, y, children).setDepth(TEXT_DEPTH);
    container.setSize(76, 82);
    container.setInteractive(
      new Phaser.Geom.Rectangle(-38, -42, 76, 84),
      Phaser.Geom.Rectangle.Contains,
    );
    container.on("pointerover", () => container.setScale(1.04));
    container.on("pointerout", () => container.setScale(1));
  }

  private syncRightMenuVisibility(): void {
    const toggleAssetId = this.rightMenuExpanded ? "collapse_chevron_button" : "expand_menu_icon";
    const hasToggleAsset = this.setButtonAsset(this.rightMenuToggleButton, toggleAssetId, 128, 64);
    this.rightMenuToggleButton.primaryText.setText(hasToggleAsset ? "" : this.rightMenuExpanded ? "<" : "메뉴");
    this.rightMenuToggleButton.secondaryText?.setText("");
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
    const hasToggleAsset = this.setButtonAsset(this.combatControlToggleButton, "combat_control_collapsed", 126, 52);
    this.combatControlToggleButton.primaryText.setText(hasToggleAsset ? "" : selectedMode.icon);
    this.combatControlToggleButton.secondaryText?.setText(selectedMode.label);
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
    button.container.setAlpha(locked && !active ? 0.76 : 1);
    if (button.style === "menuIcon") {
      button.background.setVisible(false);
      button.image?.setAlpha(active ? 1 : 0.9);
      button.secondaryText?.setColor(active ? "#ffdf7a" : "#ffffff");
      return;
    }

    if (button.style === "imageBackground" && button.image?.visible) {
      button.background.setVisible(false);
      return;
    }

    button.background.setVisible(true);
    button.background.setFillStyle(active ? BUTTON_ACTIVE_FILL : locked ? BUTTON_LOCKED_FILL : BUTTON_FILL, 0.97);
    button.background.setStrokeStyle(active ? 3 : 2, active ? BUTTON_ACTIVE_STROKE : BUTTON_STROKE, 1);
  }

  private setButtonAsset(button: UiButtonView, assetId: string, width: number, height: number): boolean {
    if (!button.image) {
      return false;
    }

    return this.setUiCoreImage(button.image, assetId, width, height);
  }

  private setUiCoreImage(image: Phaser.GameObjects.Image, assetId: string, width: number, height: number): boolean {
    const asset = getUiCoreAsset(assetId);
    if (!asset || !image.scene.textures.exists(asset.key)) {
      image.setVisible(false);
      return false;
    }

    image.setTexture(asset.key).setDisplaySize(width, height).setVisible(true);
    return true;
  }

  private hasUiCoreTexture(assetId: string): boolean {
    const asset = getUiCoreAsset(assetId);
    return Boolean(asset && this.graphics.scene.textures.exists(asset.key));
  }

  private createEquipmentIconObjects(scene: Phaser.Scene): void {
    for (const slot of EQUIPMENT_ICON_SLOTS) {
      const image = scene.add.image(slot.x, slot.y, "").setDisplaySize(24, 24).setVisible(false).setDepth(TEXT_DEPTH);
      const fallbackText = scene.add
        .text(slot.x, slot.y - 12, "-", this.textStyle("#aeb7c7", "16px", 28))
        .setOrigin(0.5, 0)
        .setDepth(TEXT_DEPTH)
        .setVisible(false);

      this.equipmentIconImages.set(slot.slot, image);
      this.equipmentFallbackTexts.set(slot.slot, fallbackText);
    }
  }

  private createSkillSlotObjects(scene: Phaser.Scene): void {
    const startX = 425;
    for (let index = 0; index < 6; index += 1) {
      const x = startX + index * 86;
      const background = scene.add.rectangle(x, 636, SKILL_SLOT_SIZE, SKILL_SLOT_SIZE, EMPTY_SLOT_FILL, 0.98)
        .setStrokeStyle(3, index < 2 ? 0xd3a24a : 0x42505f, 1)
        .setDepth(TEXT_DEPTH);
      const frameImage = scene.add.image(x, 636, "").setDisplaySize(SKILL_SLOT_SIZE, SKILL_SLOT_SIZE).setVisible(false).setDepth(TEXT_DEPTH);
      const image = scene.add.image(x, 636, "").setDisplaySize(68, 68).setVisible(false).setDepth(TEXT_DEPTH + 1);
      const lockText = scene.add.text(x, 616, "🔒", this.textStyle("#d7dce5", "24px", 60)).setOrigin(0.5).setDepth(TEXT_DEPTH + 2);
      const cooldownText = scene.add.text(x + 22, 664, "", this.textStyle("#ffffff", "15px", 46)).setOrigin(0.5).setDepth(TEXT_DEPTH + 3);
      this.skillSlotViews.push({ background, frameImage, image, lockText, cooldownText });
    }
  }

  private hideEquipmentIconSlots(): void {
    for (const image of this.equipmentIconImages.values()) {
      image.setVisible(false);
    }

    for (const fallbackText of this.equipmentFallbackTexts.values()) {
      fallbackText.setVisible(false);
    }
  }

  private updateSkillSlots(player: PlayerState, skillCooldowns: SkillCooldownView[]): void {
    for (let index = 0; index < this.skillSlotViews.length; index += 1) {
      const view = this.skillSlotViews[index];
      const skill = skillCooldowns[index];

      if (!skill) {
        const hasLockedFrame = this.setUiCoreImage(view.frameImage, "skill_slot_locked", SKILL_SLOT_SIZE, SKILL_SLOT_SIZE);
        view.background.setVisible(!hasLockedFrame);
        view.image.setVisible(false);
        view.lockText.setVisible(true);
        view.cooldownText.setText("");
        view.background.setStrokeStyle(3, 0x42505f, 1);
        continue;
      }

      const asset = this.getSkillIconAsset(skill.skillId);
      if (asset && view.image.scene.textures.exists(asset.key)) {
        view.image.setTexture(asset.key).setDisplaySize(68, 68).setVisible(true);
      } else {
        view.image.setVisible(false);
      }

      const locked = player.level < skill.requiredLevel || !skill.unlocked;
      const frameAssetId = locked ? "skill_slot_locked" : "skill_slot_active";
      const hasFrameAsset = this.setUiCoreImage(view.frameImage, frameAssetId, SKILL_SLOT_SIZE, SKILL_SLOT_SIZE);
      view.background.setVisible(!hasFrameAsset);
      view.lockText.setVisible(locked);
      view.cooldownText.setText(this.getSkillSlotStatus(player, skill));
      view.background.setStrokeStyle(3, skill.ready && !locked ? 0xffd25a : 0x42505f, 1);
    }
  }

  private getSkillIconAsset(skillId: string): { key: string } | undefined {
    if (skillId === "trainee_slash") {
      return getEffectAsset("trainee_slash");
    }

    if (skillId === "heavy_training_strike") {
      return getEffectAsset("heavy_training_strike");
    }

    return undefined;
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
      return { width: 220, height: 220 };
    }

    if (role === "boss") {
      return { width: 190, height: 190 };
    }

    if (role === "leader") {
      return { width: 148, height: 148 };
    }

    return { width: 124, height: 124 };
  }

  private textStyle(color: string, fontSize = "16px", wordWrapWidth = 320): Phaser.Types.GameObjects.Text.TextStyle {
    return {
      fontFamily: "Segoe UI",
      fontSize,
      color,
      stroke: "#101820",
      strokeThickness: 3,
      lineSpacing: 4,
      wordWrap: { width: wordWrapWidth, useAdvancedWrap: true },
    };
  }

  private getRegionLabel(stageId: string): string {
    if (stageId.startsWith("dawn_forest")) {
      return "새벽 숲";
    }

    if (stageId.startsWith("mist_gate")) {
      return "안개 관문";
    }

    if (stageId.startsWith("old_mine")) {
      return "오래된 광산";
    }

    return "미확인 지역";
  }

  private getEncounterLabel(encounterType: string): string {
    const labels: Record<string, string> = {
      normal: "일반 몬스터",
      leader: "리더",
      boss: "보스",
    };

    return labels[encounterType] ?? encounterType;
  }

  private getObjectiveText(stage: StageData, normalKills: number, encounterType: StageEncounterType): string {
    if (encounterType === "normal") {
      return `목표: 일반 몬스터 ${Math.min(normalKills, stage.requiredNormalKills)} / ${stage.requiredNormalKills}`;
    }

    if (encounterType === "leader") {
      return stage.bossMonsterId ? "목표: 리더 처치 후 보스 등장" : "목표: 리더 처치 시 스테이지 클리어";
    }

    return "목표: 보스 처치";
  }

  private getMonsterVisual(role: MonsterRole): { color: number; strokeColor: number; radius: number } {
    if (role === "boss") {
      return { color: 0xff5e57, strokeColor: 0xffc1bd, radius: 64 };
    }

    if (role === "leader") {
      return { color: 0xf4c95d, strokeColor: 0xffebad, radius: 50 };
    }

    return { color: 0x61d394, strokeColor: 0xb8f7cf, radius: 40 };
  }

  private getSkillSlotStatus(player: PlayerState, skill: SkillCooldownView): string {
    if (player.level < skill.requiredLevel || !skill.unlocked) {
      return `Lv ${skill.requiredLevel}`;
    }

    if (skill.ready) {
      return "";
    }

    return `${(skill.cooldownRemainingMs / 1000).toFixed(1)}s`;
  }

  private createInventorySummary(inventory: InventoryEntry[], ownedEquipment: OwnedEquipmentView[]): string {
    const itemCount = inventory.reduce((total, entry) => total + entry.quantity, 0);
    const equippedCount = ownedEquipment.length;
    return `보유 아이템 ${inventory.length}종 / 수량 ${itemCount} / 장비 ${equippedCount}종`;
  }
}
