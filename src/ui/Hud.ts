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
import { getMonsterAsset, getPlayerAsset, getSkillIconAsset as getSkillIconVisualAsset, getUiCoreAsset } from "../assets/AssetRegistry";

const UI_DEPTH = 5;
const TEXT_DEPTH = 7;
const SPRITE_DEPTH = 3;
const UI_EDITOR_DEPTH = 2000;
const UI_EDITOR_STORAGE_KEY = "idle-rpg-ui-editor-draft-v1";
const PANEL_FILL = 0x111923;
const PANEL_STROKE = 0xd8a64e;
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
const SKILL_SLOT_SIZE = 106;
const SKILL_SLOT_ICON_SIZE = 84;
const SKILL_SLOT_START_X = 566;
const SKILL_SLOT_STEP_X = 115;
const SKILL_SLOT_Y = 622;
const COMBAT_TOGGLE_AUTO_WIDTH = 128;
const COMBAT_TOGGLE_AUTO_HEIGHT = 72;
const COMBAT_TOGGLE_AUTO_X = 132;
const COMBAT_TOGGLE_CHEVRON_WIDTH = 178;
const COMBAT_TOGGLE_CHEVRON_HEIGHT = 72;
const COMBAT_TOGGLE_CHEVRON_X = 157;
const COMBAT_TOGGLE_Y = 674;
const COMBAT_PANEL_BOUNDS = { x: 48, y: 557, width: 420, height: 72, radius: 15 };
const COMBAT_OPTION_SIZE = { width: 92, height: 54 };
const COMBAT_OPTION_START_X = 105;
const COMBAT_OPTION_STEP_X = 101;
const COMBAT_OPTION_Y = 592;

type RightMenuKey = "skill" | "equipment" | "inventory" | "quest";
type CombatControlMode = "manual" | "auto" | "auto1_5" | "auto2";
type UiButtonStyle = "default" | "imageBackground" | "menuIcon" | "combatImageOption";

const RIGHT_MENU_ITEMS: Array<{ key: RightMenuKey; label: string; icon: string; assetId: string; x: number; y: number }> = [
  { key: "skill", label: "스킬", icon: "✦", assetId: "skill_menu_icon", x: 1180, y: 248 },
  { key: "equipment", label: "장비", icon: "갑", assetId: "equipment_menu_icon", x: 1180, y: 342 },
  { key: "inventory", label: "가방", icon: "▣", assetId: "inventory_menu_icon", x: 1180, y: 436 },
  { key: "quest", label: "퀘스트", icon: "문", assetId: "quest_menu_icon", x: 1180, y: 530 },
];

const COMBAT_CONTROL_MODES: Array<{ key: CombatControlMode; label: string; icon: string; assetId: string; locked: boolean }> = [
  { key: "manual", label: "수동", icon: "✋", assetId: "combat_new_manual", locked: false },
  { key: "auto", label: "오토", icon: "⚔", assetId: "combat_new_auto", locked: false },
  { key: "auto1_5", label: "x1.5", icon: "🔒", assetId: "combat_new_locked_x15", locked: true },
  { key: "auto2", label: "x2.0", icon: "🔒", assetId: "combat_new_locked_x2", locked: true },
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
  style?: UiButtonStyle;
  locked?: boolean;
}

interface SkillSlotView {
  background: Phaser.GameObjects.Rectangle;
  frameImage: Phaser.GameObjects.Image;
  image: Phaser.GameObjects.Image;
  lockText: Phaser.GameObjects.Text;
  cooldownText: Phaser.GameObjects.Text;
}

interface UiEditorRect {
  centerX: number;
  centerY: number;
  width: number;
  height: number;
}

interface UiEditorTarget {
  id: string;
  label: string;
  getRect: () => UiEditorRect;
  applyRect: (rect: UiEditorRect) => void;
  overlay?: Phaser.GameObjects.Rectangle;
  labelText?: Phaser.GameObjects.Text;
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
  private readonly combatControlPanelImage: Phaser.GameObjects.Image;
  private readonly combatControlToggleButton: UiButtonView;
  private combatControlChevronButton?: UiButtonView;
  private readonly combatControlButtons = new Map<CombatControlMode, UiButtonView>();
  private readonly equipmentIconImages = new Map<EquipmentSlot, Phaser.GameObjects.Image>();
  private readonly equipmentFallbackTexts = new Map<EquipmentSlot, Phaser.GameObjects.Text>();
  private readonly skillSlotViews: SkillSlotView[] = [];
  private readonly uiEditorEnabled = this.isUiEditorMode();
  private readonly uiEditorRects = new Map<string, UiEditorRect>();
  private uiEditorTargets: UiEditorTarget[] = [];
  private uiEditorSelected?: UiEditorTarget;
  private uiEditorSelectionText?: HTMLDivElement;
  private uiEditorTextarea?: HTMLTextAreaElement;
  private currentMonsterAssetKey?: string;
  private rightMenuExpanded = true;
  private selectedRightMenuKey: RightMenuKey = "skill";
  private combatControlExpanded = true;
  private selectedCombatControlMode: CombatControlMode = "auto";

  constructor(scene: Phaser.Scene, _title: string, _subtitle: string) {
    this.graphics = scene.add.graphics().setDepth(UI_DEPTH);

    this.playerNameText = scene.add.text(118, 24, "", this.textStyle("#ffffff", "22px", 150)).setDepth(TEXT_DEPTH);
    this.playerLevelText = scene.add.text(236, 26, "", this.textStyle("#ffffff", "17px", 78)).setDepth(TEXT_DEPTH);
    this.playerHpText = scene.add.text(112, 76, "", this.textStyle("#ffffff", "14px", 140)).setDepth(TEXT_DEPTH);
    this.playerHpLabelText = scene.add.text(20, 96, "", this.textStyle("#d6efff", "12px", 90)).setDepth(TEXT_DEPTH);
    this.stageTitleText = scene.add.text(458, 24, "", this.textStyle("#ffffff", "22px", 260)).setOrigin(0.5, 0).setDepth(TEXT_DEPTH);
    this.stageSubtitleText = scene.add.text(458, 70, "", this.textStyle("#e9f2ff", "14px", 310)).setOrigin(0.5, 0).setDepth(TEXT_DEPTH);
    this.goldText = scene.add.text(786, 34, "", this.textStyle("#fff3d0", "17px", 108)).setDepth(TEXT_DEPTH);
    this.diamondText = scene.add.text(970, 34, "", this.textStyle("#eaf9ff", "17px", 108)).setDepth(TEXT_DEPTH);
    this.playerPortraitImage = scene.add.image(60, 58, "").setDisplaySize(80, 80).setVisible(false).setDepth(TEXT_DEPTH);

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
    this.skillSlotBarImage = scene.add.image(820, 626, "").setDepth(UI_DEPTH + 1).setVisible(false);
    this.combatControlPanelImage = scene.add
      .image(
        COMBAT_PANEL_BOUNDS.x + COMBAT_PANEL_BOUNDS.width / 2,
        COMBAT_PANEL_BOUNDS.y + COMBAT_PANEL_BOUNDS.height / 2,
        "",
      )
      .setDepth(UI_DEPTH + 1)
      .setVisible(false);
    this.rightMenuPanelImage.setVisible(false);
    this.skillSlotBarImage.setVisible(false);
    this.combatControlPanelImage.setVisible(false);

    this.createEquipmentIconObjects(scene);
    this.createSkillSlotObjects(scene);
    this.rightMenuToggleButton = this.createRightMenuObjects(scene);
    this.combatControlToggleButton = this.createCombatControlObjects(scene);
    this.syncRightMenuVisibility();
    this.syncCombatControlVisibility();
    if (this.uiEditorEnabled) {
      this.createUiEditor(scene);
    }
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
    this.applyUiEditorLayouts();
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
    this.graphics.fillRoundedRect(16, 16, 88, 88, 12);
    this.graphics.lineStyle(2, 0xc7d8e9, 0.9);
    this.graphics.strokeRoundedRect(16, 16, 88, 88, 12);
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
    this.rightMenuPanelImage.setVisible(false);
  }

  private drawBottomCombatControlPanel(): void {
    if (this.combatControlExpanded) {
      this.drawCombatControlExpandedPanel();
    } else {
      this.combatControlPanelImage.setVisible(false);
    }
  }

  private drawCombatControlExpandedPanel(): void {
    const hasPanelAsset = this.setUiCoreImage(
      this.combatControlPanelImage,
      "combat_new_panel",
      COMBAT_PANEL_BOUNDS.width,
      COMBAT_PANEL_BOUNDS.height,
    );
    if (hasPanelAsset) {
      return;
    }

    this.graphics.fillStyle(0x151c24, 0.94);
    this.graphics.fillRoundedRect(
      COMBAT_PANEL_BOUNDS.x,
      COMBAT_PANEL_BOUNDS.y,
      COMBAT_PANEL_BOUNDS.width,
      COMBAT_PANEL_BOUNDS.height,
      COMBAT_PANEL_BOUNDS.radius,
    );
    this.graphics.lineStyle(5, 0x05090d, 0.95);
    this.graphics.strokeRoundedRect(
      COMBAT_PANEL_BOUNDS.x,
      COMBAT_PANEL_BOUNDS.y,
      COMBAT_PANEL_BOUNDS.width,
      COMBAT_PANEL_BOUNDS.height,
      COMBAT_PANEL_BOUNDS.radius,
    );
    this.graphics.lineStyle(2, 0x3f4a55, 0.95);
    this.graphics.strokeRoundedRect(
      COMBAT_PANEL_BOUNDS.x + 5,
      COMBAT_PANEL_BOUNDS.y + 5,
      COMBAT_PANEL_BOUNDS.width - 10,
      COMBAT_PANEL_BOUNDS.height - 10,
      COMBAT_PANEL_BOUNDS.radius - 6,
    );

  }
  private drawBottomSkillSlots(): void {
    this.skillSlotBarImage.setVisible(false);
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
    this.playerPortraitImage.setTexture(asset.key).setCrop(155, 70, 455, 455).setDisplaySize(84, 84).setVisible(true);
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
    const toggleCombatPanel = () => {
      this.combatControlExpanded = !this.combatControlExpanded;
      this.syncCombatControlVisibility();
    };

    this.combatControlChevronButton = this.createImageUiButton(
      scene,
      COMBAT_TOGGLE_CHEVRON_X,
      COMBAT_TOGGLE_Y,
      COMBAT_TOGGLE_CHEVRON_WIDTH,
      COMBAT_TOGGLE_CHEVRON_HEIGHT,
      "combat_new_chevron",
      "",
      "",
      toggleCombatPanel,
      false,
      "28px",
      "imageBackground",
    );

    const toggleButton = this.createImageUiButton(
      scene,
      COMBAT_TOGGLE_AUTO_X,
      COMBAT_TOGGLE_Y,
      COMBAT_TOGGLE_AUTO_WIDTH,
      COMBAT_TOGGLE_AUTO_HEIGHT,
      "combat_new_auto",
      "",
      "",
      toggleCombatPanel,
      false,
      "28px",
      "imageBackground",
    );

    COMBAT_CONTROL_MODES.forEach((mode, index) => {
      const x = COMBAT_OPTION_START_X + index * COMBAT_OPTION_STEP_X;
      const button = this.createImageUiButton(scene, x, COMBAT_OPTION_Y, COMBAT_OPTION_SIZE.width, COMBAT_OPTION_SIZE.height, mode.assetId, mode.icon, "", () => {
        this.selectedCombatControlMode = mode.key;
        this.combatControlExpanded = false;
        this.syncCombatControlVisibility();
      }, false, "18px", "combatImageOption");
      button.primaryText.setVisible(false);
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
    style: "imageBackground" | "menuIcon" | "combatImageOption" = "imageBackground",
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
    const hasToggleAsset = this.setButtonAsset(this.combatControlToggleButton, "combat_new_auto", COMBAT_TOGGLE_AUTO_WIDTH, COMBAT_TOGGLE_AUTO_HEIGHT);
    this.combatControlToggleButton.primaryText.setText(hasToggleAsset ? "" : selectedMode.icon);
    this.combatControlToggleButton.secondaryText?.setText(hasToggleAsset ? "" : selectedMode.label);
    this.setUiButtonState(this.combatControlToggleButton, true, true, selectedMode.locked);
    if (this.combatControlChevronButton) {
      this.setButtonAsset(this.combatControlChevronButton, "combat_new_chevron", COMBAT_TOGGLE_CHEVRON_WIDTH, COMBAT_TOGGLE_CHEVRON_HEIGHT);
      this.setUiButtonState(this.combatControlChevronButton, false, true);
    }

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
    button.container.setAlpha(button.style !== "combatImageOption" && locked && !active ? 0.76 : 1);
    if (button.style === "combatImageOption") {
      button.background.setVisible(false);
      button.image?.setAlpha(active ? 1 : 0.97);
      button.primaryText.setColor("#ffffff");
      button.secondaryText?.setColor("#ffffff");
      return;
    }

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
    for (let index = 0; index < 6; index += 1) {
      const x = SKILL_SLOT_START_X + index * SKILL_SLOT_STEP_X;
      const background = scene.add.rectangle(x, SKILL_SLOT_Y, SKILL_SLOT_SIZE, SKILL_SLOT_SIZE, EMPTY_SLOT_FILL, 0.98)
        .setStrokeStyle(3, index < 2 ? 0xd3a24a : 0x42505f, 1)
        .setDepth(TEXT_DEPTH);
      const frameImage = scene.add.image(x, SKILL_SLOT_Y, "").setDisplaySize(SKILL_SLOT_SIZE, SKILL_SLOT_SIZE).setVisible(false).setDepth(TEXT_DEPTH);
      const image = scene.add.image(x, SKILL_SLOT_Y, "").setDisplaySize(SKILL_SLOT_ICON_SIZE, SKILL_SLOT_ICON_SIZE).setVisible(false).setDepth(TEXT_DEPTH + 1);
      const lockText = scene.add.text(x, SKILL_SLOT_Y - 20, "🔒", this.textStyle("#d7dce5", "24px", 60)).setOrigin(0.5).setDepth(TEXT_DEPTH + 2);
      const cooldownText = scene.add.text(x + 26, SKILL_SLOT_Y + 31, "", this.textStyle("#ffffff", "15px", 46)).setOrigin(0.5).setDepth(TEXT_DEPTH + 3);
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
        view.lockText.setVisible(!hasLockedFrame);
        view.cooldownText.setText("");
        view.background.setStrokeStyle(3, 0x42505f, 1);
        continue;
      }

      const asset = this.getSkillIconAsset(skill.skillId);
      if (asset && view.image.scene.textures.exists(asset.key)) {
        view.image.setTexture(asset.key).setDisplaySize(SKILL_SLOT_ICON_SIZE, SKILL_SLOT_ICON_SIZE).setVisible(true);
      } else {
        view.image.setVisible(false);
      }

      const locked = player.level < skill.requiredLevel || !skill.unlocked;
      const frameAssetId = locked ? "skill_slot_locked" : "skill_slot_active";
      const hasFrameAsset = this.setUiCoreImage(view.frameImage, frameAssetId, SKILL_SLOT_SIZE, SKILL_SLOT_SIZE);
      view.background.setVisible(!hasFrameAsset);
      view.lockText.setVisible(locked && !hasFrameAsset);
      view.cooldownText.setText(locked && hasFrameAsset ? "" : this.getSkillSlotStatus(player, skill));
      view.background.setStrokeStyle(3, skill.ready && !locked ? 0xffd25a : 0x42505f, 1);
    }
  }

  private getSkillIconAsset(skillId: string): { key: string } | undefined {
    return getSkillIconVisualAsset(skillId);
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
      return { width: 210, height: 210 };
    }

    if (role === "leader") {
      return { width: 170, height: 170 };
    }

    return { width: 150, height: 150 };
  }

  private isUiEditorMode(): boolean {
    if (typeof window === "undefined") {
      return false;
    }

    return new URLSearchParams(window.location.search).has("ui_editor");
  }

  private createUiEditor(scene: Phaser.Scene): void {
    const draft = this.readUiEditorDraft();

    this.setUiCoreImage(this.combatControlPanelImage, "combat_new_panel", COMBAT_PANEL_BOUNDS.width, COMBAT_PANEL_BOUNDS.height);
    this.uiEditorTargets = [
      this.createImageEditorTarget("combat.panel", "전투 상단 패널", this.combatControlPanelImage, COMBAT_PANEL_BOUNDS.width, COMBAT_PANEL_BOUNDS.height),
      this.createButtonEditorTarget("combat.collapsed.auto", "접힘 오토 버튼", this.combatControlToggleButton, COMBAT_TOGGLE_AUTO_WIDTH, COMBAT_TOGGLE_AUTO_HEIGHT),
    ];

    if (this.combatControlChevronButton) {
      this.uiEditorTargets.push(
        this.createButtonEditorTarget(
          "combat.collapsed.chevron",
          "접힘 화살표 버튼",
          this.combatControlChevronButton,
          COMBAT_TOGGLE_CHEVRON_WIDTH,
          COMBAT_TOGGLE_CHEVRON_HEIGHT,
        ),
      );
    }

    for (const mode of COMBAT_CONTROL_MODES) {
      const button = this.combatControlButtons.get(mode.key);
      if (button) {
        this.uiEditorTargets.push(
          this.createButtonEditorTarget(`combat.${mode.key}`, `${mode.label} 버튼`, button, COMBAT_OPTION_SIZE.width, COMBAT_OPTION_SIZE.height),
        );
      }
    }

    for (let index = 0; index < this.skillSlotViews.length; index += 1) {
      this.uiEditorTargets.push(this.createSkillSlotEditorTarget(index));
    }

    for (const item of RIGHT_MENU_ITEMS) {
      const button = this.rightMenuButtons.get(item.key);
      if (button) {
        this.uiEditorTargets.push(this.createButtonEditorTarget(`right.${item.key}`, `우측 ${item.label}`, button, 98, 88));
      }
    }

    for (const target of this.uiEditorTargets) {
      const rect = draft.get(target.id) ?? target.getRect();
      this.uiEditorRects.set(target.id, { ...rect });
      target.applyRect(rect);
      this.createUiEditorHandle(scene, target);
    }

    this.createUiEditorPanel();
    scene.input.keyboard?.on("keydown", this.handleUiEditorKey, this);
    if (this.uiEditorTargets[0]) {
      this.selectUiEditorTarget(this.uiEditorTargets[0]);
    }
    this.applyUiEditorLayouts();
  }

  private createImageEditorTarget(
    id: string,
    label: string,
    image: Phaser.GameObjects.Image,
    fallbackWidth: number,
    fallbackHeight: number,
  ): UiEditorTarget {
    return {
      id,
      label,
      getRect: () => ({
        centerX: Math.round(image.x),
        centerY: Math.round(image.y),
        width: Math.round(image.displayWidth || fallbackWidth),
        height: Math.round(image.displayHeight || fallbackHeight),
      }),
      applyRect: (rect) => {
        image.setPosition(rect.centerX, rect.centerY).setDisplaySize(rect.width, rect.height);
      },
    };
  }

  private createButtonEditorTarget(
    id: string,
    label: string,
    button: UiButtonView,
    fallbackWidth: number,
    fallbackHeight: number,
  ): UiEditorTarget {
    return {
      id,
      label,
      getRect: () => ({
        centerX: Math.round(button.container.x),
        centerY: Math.round(button.container.y),
        width: Math.round(button.image?.displayWidth || fallbackWidth),
        height: Math.round(button.image?.displayHeight || fallbackHeight),
      }),
      applyRect: (rect) => {
        button.container.setPosition(rect.centerX, rect.centerY).setSize(rect.width, rect.height);
        button.background.setSize(rect.width, rect.height);
        button.image?.setDisplaySize(rect.width, rect.height);
        button.container.setInteractive(
          new Phaser.Geom.Rectangle(-rect.width / 2, -rect.height / 2, rect.width, rect.height),
          Phaser.Geom.Rectangle.Contains,
        );
      },
    };
  }

  private createSkillSlotEditorTarget(index: number): UiEditorTarget {
    const view = this.skillSlotViews[index];
    const id = `skill.slot${index + 1}`;

    return {
      id,
      label: `스킬 슬롯 ${index + 1}`,
      getRect: () => ({
        centerX: Math.round(view.frameImage.x),
        centerY: Math.round(view.frameImage.y),
        width: Math.round(view.frameImage.displayWidth || SKILL_SLOT_SIZE),
        height: Math.round(view.frameImage.displayHeight || SKILL_SLOT_SIZE),
      }),
      applyRect: (rect) => {
        const iconSize = Math.max(24, Math.round(Math.min(rect.width, rect.height) * 0.72));
        view.background.setPosition(rect.centerX, rect.centerY).setSize(rect.width, rect.height);
        view.frameImage.setPosition(rect.centerX, rect.centerY).setDisplaySize(rect.width, rect.height);
        view.image.setPosition(rect.centerX, rect.centerY).setDisplaySize(iconSize, iconSize);
        view.lockText.setPosition(rect.centerX, rect.centerY - rect.height * 0.2);
        view.cooldownText.setPosition(rect.centerX + rect.width * 0.25, rect.centerY + rect.height * 0.29);
      },
    };
  }

  private createUiEditorHandle(scene: Phaser.Scene, target: UiEditorTarget): void {
    const rect = this.getUiEditorRect(target);
    const overlay = scene.add
      .rectangle(rect.centerX, rect.centerY, rect.width, rect.height, 0xff00ff, 0.12)
      .setStrokeStyle(2, 0xff00ff, 0.95)
      .setDepth(UI_EDITOR_DEPTH)
      .setInteractive(new Phaser.Geom.Rectangle(-rect.width / 2, -rect.height / 2, rect.width, rect.height), Phaser.Geom.Rectangle.Contains);
    const labelText = scene.add
      .text(rect.centerX - rect.width / 2, rect.centerY - rect.height / 2 - 18, target.label, {
        fontFamily: "Segoe UI",
        fontSize: "13px",
        color: "#ffffff",
        backgroundColor: "#000000",
        padding: { x: 4, y: 2 },
      })
      .setDepth(UI_EDITOR_DEPTH + 1);

    scene.input.setDraggable(overlay);
    overlay.on("pointerdown", () => this.selectUiEditorTarget(target));
    overlay.on("drag", (_pointer: Phaser.Input.Pointer, dragX: number, dragY: number) => {
      const current = this.getUiEditorRect(target);
      this.setUiEditorTargetRect(target, {
        ...current,
        centerX: Math.round(dragX),
        centerY: Math.round(dragY),
      });
    });

    target.overlay = overlay;
    target.labelText = labelText;
  }

  private handleUiEditorKey(event: KeyboardEvent): void {
    if (!this.uiEditorSelected) {
      return;
    }

    const rect = this.getUiEditorRect(this.uiEditorSelected);
    const step = event.shiftKey ? 10 : 1;
    const next = { ...rect };

    if (event.key === "ArrowLeft") {
      next.centerX -= step;
    } else if (event.key === "ArrowRight") {
      next.centerX += step;
    } else if (event.key === "ArrowUp") {
      next.centerY -= step;
    } else if (event.key === "ArrowDown") {
      next.centerY += step;
    } else if (event.key === "=" || event.key === "+") {
      next.width += step;
      next.height += step;
    } else if (event.key === "-" || event.key === "_") {
      next.width = Math.max(8, next.width - step);
      next.height = Math.max(8, next.height - step);
    } else if (event.key === "]") {
      next.width += step;
    } else if (event.key === "[") {
      next.width = Math.max(8, next.width - step);
    } else if (event.key === ".") {
      next.height += step;
    } else if (event.key === ",") {
      next.height = Math.max(8, next.height - step);
    } else {
      return;
    }

    event.preventDefault();
    this.setUiEditorTargetRect(this.uiEditorSelected, next);
  }

  private createUiEditorPanel(): void {
    if (typeof document === "undefined") {
      return;
    }

    document.getElementById("idle-rpg-ui-editor-panel")?.remove();

    const panel = document.createElement("div");
    panel.id = "idle-rpg-ui-editor-panel";
    Object.assign(panel.style, {
      position: "fixed",
      right: "12px",
      top: "12px",
      zIndex: "99999",
      width: "340px",
      padding: "10px",
      color: "#ffffff",
      background: "rgba(6, 10, 14, 0.92)",
      border: "2px solid #ffcc33",
      borderRadius: "8px",
      fontFamily: "Segoe UI, sans-serif",
      fontSize: "12px",
      boxShadow: "0 8px 24px rgba(0,0,0,0.45)",
    });

    const title = document.createElement("div");
    title.textContent = "UI 편집 모드";
    title.style.fontWeight = "700";
    title.style.fontSize = "15px";
    title.style.marginBottom = "6px";

    const help = document.createElement("div");
    help.textContent = "드래그 이동 / 방향키 1px / Shift+방향키 10px / +/- 전체 크기 / [ ] 폭 / , . 높이";
    help.style.lineHeight = "1.45";
    help.style.marginBottom = "8px";

    const selected = document.createElement("div");
    selected.style.marginBottom = "6px";
    selected.style.color = "#ffdf7a";

    const sizeTitle = document.createElement("div");
    sizeTitle.textContent = "선택 요소 크기 조절";
    Object.assign(sizeTitle.style, {
      marginTop: "8px",
      marginBottom: "6px",
      fontWeight: "700",
      color: "#ffffff",
    });

    const sizeControls = document.createElement("div");
    Object.assign(sizeControls.style, {
      display: "grid",
      gridTemplateColumns: "repeat(4, 1fr)",
      gap: "6px",
      marginBottom: "8px",
    });

    sizeControls.append(
      this.createUiEditorDomButton("전체 -10", () => this.resizeSelectedUiEditorTarget(-10, -10)),
      this.createUiEditorDomButton("전체 -1", () => this.resizeSelectedUiEditorTarget(-1, -1)),
      this.createUiEditorDomButton("전체 +1", () => this.resizeSelectedUiEditorTarget(1, 1)),
      this.createUiEditorDomButton("전체 +10", () => this.resizeSelectedUiEditorTarget(10, 10)),
      this.createUiEditorDomButton("폭 -10", () => this.resizeSelectedUiEditorTarget(-10, 0)),
      this.createUiEditorDomButton("폭 -1", () => this.resizeSelectedUiEditorTarget(-1, 0)),
      this.createUiEditorDomButton("폭 +1", () => this.resizeSelectedUiEditorTarget(1, 0)),
      this.createUiEditorDomButton("폭 +10", () => this.resizeSelectedUiEditorTarget(10, 0)),
      this.createUiEditorDomButton("높이 -10", () => this.resizeSelectedUiEditorTarget(0, -10)),
      this.createUiEditorDomButton("높이 -1", () => this.resizeSelectedUiEditorTarget(0, -1)),
      this.createUiEditorDomButton("높이 +1", () => this.resizeSelectedUiEditorTarget(0, 1)),
      this.createUiEditorDomButton("높이 +10", () => this.resizeSelectedUiEditorTarget(0, 10)),
    );

    const textarea = document.createElement("textarea");
    Object.assign(textarea.style, {
      width: "100%",
      height: "220px",
      boxSizing: "border-box",
      fontFamily: "Consolas, monospace",
      fontSize: "11px",
      color: "#e8f0ff",
      background: "#101820",
      border: "1px solid #56687b",
      borderRadius: "4px",
      padding: "6px",
      resize: "vertical",
    });

    const buttons = document.createElement("div");
    buttons.style.display = "flex";
    buttons.style.gap = "6px";
    buttons.style.marginTop = "8px";

    const copyButton = this.createUiEditorDomButton("Copy JSON", () => this.copyUiEditorJson());
    const saveButton = this.createUiEditorDomButton("Save Draft", () => this.saveUiEditorDraft());
    const clearButton = this.createUiEditorDomButton("Clear Draft", () => this.clearUiEditorDraft());
    buttons.append(copyButton, saveButton, clearButton);
    panel.append(title, help, selected, sizeTitle, sizeControls, textarea, buttons);
    document.body.appendChild(panel);

    this.uiEditorSelectionText = selected;
    this.uiEditorTextarea = textarea;
    this.updateUiEditorPanel();
  }

  private createUiEditorDomButton(label: string, onClick: () => void): HTMLButtonElement {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = label;
    Object.assign(button.style, {
      flex: "1",
      padding: "6px 4px",
      cursor: "pointer",
      border: "1px solid #ffcc33",
      borderRadius: "4px",
      color: "#ffffff",
      background: "#253140",
      fontWeight: "700",
      fontSize: "11px",
    });
    button.addEventListener("click", onClick);
    return button;
  }

  private resizeSelectedUiEditorTarget(deltaWidth: number, deltaHeight: number): void {
    if (!this.uiEditorSelected) {
      return;
    }

    const rect = this.getUiEditorRect(this.uiEditorSelected);
    this.setUiEditorTargetRect(this.uiEditorSelected, {
      ...rect,
      width: rect.width + deltaWidth,
      height: rect.height + deltaHeight,
    });
  }

  private selectUiEditorTarget(target: UiEditorTarget): void {
    this.uiEditorSelected = target;
    for (const item of this.uiEditorTargets) {
      item.overlay?.setStrokeStyle(item === target ? 4 : 2, item === target ? 0x44ff66 : 0xff00ff, 0.95);
      item.overlay?.setFillStyle(item === target ? 0x44ff66 : 0xff00ff, 0.12);
    }
    this.updateUiEditorPanel();
  }

  private setUiEditorTargetRect(target: UiEditorTarget, rect: UiEditorRect): void {
    const rounded = {
      centerX: Math.round(rect.centerX),
      centerY: Math.round(rect.centerY),
      width: Math.max(8, Math.round(rect.width)),
      height: Math.max(8, Math.round(rect.height)),
    };
    this.uiEditorRects.set(target.id, rounded);
    target.applyRect(rounded);
    this.updateUiEditorHandle(target);
    this.updateUiEditorPanel();
  }

  private applyUiEditorLayouts(): void {
    if (!this.uiEditorEnabled || this.uiEditorTargets.length === 0) {
      return;
    }

    for (const target of this.uiEditorTargets) {
      const rect = this.uiEditorRects.get(target.id);
      if (rect) {
        target.applyRect(rect);
        this.updateUiEditorHandle(target);
      }
    }
  }

  private updateUiEditorHandle(target: UiEditorTarget): void {
    const rect = this.getUiEditorRect(target);
    target.overlay
      ?.setPosition(rect.centerX, rect.centerY)
      .setSize(rect.width, rect.height)
      .setInteractive(new Phaser.Geom.Rectangle(-rect.width / 2, -rect.height / 2, rect.width, rect.height), Phaser.Geom.Rectangle.Contains);
    target.labelText?.setPosition(rect.centerX - rect.width / 2, rect.centerY - rect.height / 2 - 18);
  }

  private getUiEditorRect(target: UiEditorTarget): UiEditorRect {
    return this.uiEditorRects.get(target.id) ?? target.getRect();
  }

  private getUiEditorExport(): {
    mode: string;
    canvas: { width: number; height: number };
    selected: string | null;
    items: Array<UiEditorRect & { id: string; label: string; left: number; top: number; right: number; bottom: number }>;
  } {
    return {
      mode: "idle-rpg-ui-editor",
      canvas: { width: 1280, height: 720 },
      selected: this.uiEditorSelected?.id ?? null,
      items: this.uiEditorTargets.map((target) => {
        const rect = this.getUiEditorRect(target);
        return {
          id: target.id,
          label: target.label,
          ...rect,
          left: Math.round(rect.centerX - rect.width / 2),
          top: Math.round(rect.centerY - rect.height / 2),
          right: Math.round(rect.centerX + rect.width / 2),
          bottom: Math.round(rect.centerY + rect.height / 2),
        };
      }),
    };
  }

  private updateUiEditorPanel(): void {
    if (!this.uiEditorTextarea) {
      return;
    }

    const selected = this.uiEditorSelected ? this.getUiEditorRect(this.uiEditorSelected) : undefined;
    if (this.uiEditorSelectionText) {
      this.uiEditorSelectionText.textContent = this.uiEditorSelected && selected
        ? `선택: ${this.uiEditorSelected.label}  x:${selected.centerX} y:${selected.centerY} w:${selected.width} h:${selected.height}`
        : "선택: 없음";
    }
    this.uiEditorTextarea.value = JSON.stringify(this.getUiEditorExport(), null, 2);
  }

  private copyUiEditorJson(): void {
    const text = JSON.stringify(this.getUiEditorExport(), null, 2);
    if (navigator.clipboard) {
      void navigator.clipboard.writeText(text);
      return;
    }

    this.uiEditorTextarea?.select();
    document.execCommand("copy");
  }

  private saveUiEditorDraft(): void {
    if (typeof localStorage === "undefined") {
      return;
    }

    localStorage.setItem(UI_EDITOR_STORAGE_KEY, JSON.stringify(this.getUiEditorExport()));
  }

  private clearUiEditorDraft(): void {
    if (typeof localStorage === "undefined") {
      return;
    }

    localStorage.removeItem(UI_EDITOR_STORAGE_KEY);
  }

  private readUiEditorDraft(): Map<string, UiEditorRect> {
    const layouts = new Map<string, UiEditorRect>();
    if (typeof localStorage === "undefined") {
      return layouts;
    }

    try {
      const raw = localStorage.getItem(UI_EDITOR_STORAGE_KEY);
      if (!raw) {
        return layouts;
      }
      const parsed = JSON.parse(raw) as { items?: Array<UiEditorRect & { id?: string }> };
      for (const item of parsed.items ?? []) {
        if (item.id && Number.isFinite(item.centerX) && Number.isFinite(item.centerY)) {
          layouts.set(item.id, {
            centerX: item.centerX,
            centerY: item.centerY,
            width: item.width,
            height: item.height,
          });
        }
      }
    } catch {
      return layouts;
    }

    return layouts;
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
