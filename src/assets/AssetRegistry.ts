export interface VisualAssetEntry {
  id: string;
  key: string;
  path: string;
}

export const PLAYER_ASSETS: Record<string, VisualAssetEntry> = {
  o_gyejang_idle: {
    id: "o_gyejang_idle",
    key: "player:o_gyejang_idle",
    path: "assets/characters/player/o_gyejang_idle.svg",
  },
};

export const PLAYER_ASSET_LIST = Object.values(PLAYER_ASSETS);

export function getPlayerAsset(playerId: string): VisualAssetEntry | undefined {
  return PLAYER_ASSETS[playerId];
}

export const MONSTER_ASSETS: Record<string, VisualAssetEntry> = {
  dawn_slime: {
    id: "dawn_slime",
    key: "monster:dawn_slime",
    path: "assets/monsters/normal/dawn_slime.png",
  },
  dawn_mushroom: {
    id: "dawn_mushroom",
    key: "monster:dawn_mushroom",
    path: "assets/monsters/normal/dawn_mushroom.png",
  },
  dawn_hornet: {
    id: "dawn_hornet",
    key: "monster:dawn_hornet",
    path: "assets/monsters/normal/dawn_hornet.png",
  },
  mist_goblin: {
    id: "mist_goblin",
    key: "monster:mist_goblin",
    path: "assets/monsters/normal/mist_goblin.png",
  },
  mist_bat: {
    id: "mist_bat",
    key: "monster:mist_bat",
    path: "assets/monsters/normal/mist_bat.png",
  },
  mist_sentinel: {
    id: "mist_sentinel",
    key: "monster:mist_sentinel",
    path: "assets/monsters/normal/mist_sentinel.png",
  },
  mine_rat: {
    id: "mine_rat",
    key: "monster:mine_rat",
    path: "assets/monsters/normal/mine_rat.png",
  },
  ore_sprite: {
    id: "ore_sprite",
    key: "monster:ore_sprite",
    path: "assets/monsters/normal/ore_sprite.png",
  },
  rust_crawler: {
    id: "rust_crawler",
    key: "monster:rust_crawler",
    path: "assets/monsters/normal/rust_crawler.png",
  },
  dawn_wolf: {
    id: "dawn_wolf",
    key: "monster:dawn_wolf",
    path: "assets/monsters/leader/dawn_wolf.png",
  },
  mist_guardian: {
    id: "mist_guardian",
    key: "monster:mist_guardian",
    path: "assets/monsters/leader/mist_guardian.png",
  },
  mine_foreman_golem: {
    id: "mine_foreman_golem",
    key: "monster:mine_foreman_golem",
    path: "assets/monsters/leader/mine_foreman_golem.png",
  },
  dawn_treant: {
    id: "dawn_treant",
    key: "monster:dawn_treant",
    path: "assets/monsters/boss/dawn_treant.png",
  },
  sleepy_ogre: {
    id: "sleepy_ogre",
    key: "monster:sleepy_ogre",
    path: "assets/monsters/boss/sleepy_ogre.png",
  },
  ancient_mine_guardian: {
    id: "ancient_mine_guardian",
    key: "monster:ancient_mine_guardian",
    path: "assets/monsters/boss/ancient_mine_guardian.png",
  },
};

export const MONSTER_ASSET_LIST = Object.values(MONSTER_ASSETS);

export function getMonsterAsset(monsterId: string): VisualAssetEntry | undefined {
  return MONSTER_ASSETS[monsterId];
}

export const ITEM_ICON_ASSETS: Record<string, VisualAssetEntry> = {
  rusty_training_sword: {
    id: "rusty_training_sword",
    key: "item:rusty_training_sword",
    path: "assets/icons/equipment/rusty_training_sword.png",
  },
  bent_training_spear: {
    id: "bent_training_spear",
    key: "item:bent_training_spear",
    path: "assets/icons/equipment/bent_training_spear.png",
  },
  chipped_training_axe: {
    id: "chipped_training_axe",
    key: "item:chipped_training_axe",
    path: "assets/icons/equipment/chipped_training_axe.png",
  },
  dented_apprentice_helmet: {
    id: "dented_apprentice_helmet",
    key: "item:dented_apprentice_helmet",
    path: "assets/icons/equipment/dented_apprentice_helmet.png",
  },
  worn_apprentice_armor: {
    id: "worn_apprentice_armor",
    key: "item:worn_apprentice_armor",
    path: "assets/icons/equipment/worn_apprentice_armor.png",
  },
  worn_apprentice_boots: {
    id: "worn_apprentice_boots",
    key: "item:worn_apprentice_boots",
    path: "assets/icons/equipment/worn_apprentice_boots.png",
  },
  frayed_apprentice_necklace: {
    id: "frayed_apprentice_necklace",
    key: "item:frayed_apprentice_necklace",
    path: "assets/icons/equipment/frayed_apprentice_necklace.png",
  },
  cracked_apprentice_ring: {
    id: "cracked_apprentice_ring",
    key: "item:cracked_apprentice_ring",
    path: "assets/icons/equipment/cracked_apprentice_ring.png",
  },
  trainee_medal: {
    id: "trainee_medal",
    key: "item:trainee_medal",
    path: "assets/icons/material/trainee_medal.png",
  },
  soft_leaf: {
    id: "soft_leaf",
    key: "item:soft_leaf",
    path: "assets/icons/material/soft_leaf.png",
  },
  mist_shard: {
    id: "mist_shard",
    key: "item:mist_shard",
    path: "assets/icons/material/mist_shard.png",
  },
  mist_core: {
    id: "mist_core",
    key: "item:mist_core",
    path: "assets/icons/material/mist_core.png",
  },
  ogre_badge: {
    id: "ogre_badge",
    key: "item:ogre_badge",
    path: "assets/icons/material/ogre_badge.png",
  },
  old_ore_fragment: {
    id: "old_ore_fragment",
    key: "item:old_ore_fragment",
    path: "assets/icons/material/old_ore_fragment.png",
  },
  old_ore_core: {
    id: "old_ore_core",
    key: "item:old_ore_core",
    path: "assets/icons/material/old_ore_core.png",
  },
  guardian_stone: {
    id: "guardian_stone",
    key: "item:guardian_stone",
    path: "assets/icons/material/guardian_stone.png",
  },
};

export const ITEM_ICON_ASSET_LIST = Object.values(ITEM_ICON_ASSETS);

export function getItemIconAsset(itemId: string): VisualAssetEntry | undefined {
  return ITEM_ICON_ASSETS[itemId];
}

export const EFFECT_ASSETS: Record<string, VisualAssetEntry> = {
  trainee_slash: {
    id: "trainee_slash",
    key: "effect:trainee_slash",
    path: "assets/effects/skills/trainee_slash.png",
  },
  heavy_training_strike: {
    id: "heavy_training_strike",
    key: "effect:heavy_training_strike",
    path: "assets/effects/skills/heavy_training_strike.png",
  },
  basic_hit: {
    id: "basic_hit",
    key: "effect:basic_hit",
    path: "assets/effects/combat/basic_hit.png",
  },
  critical_hit: {
    id: "critical_hit",
    key: "effect:critical_hit",
    path: "assets/effects/combat/critical_hit.png",
  },
  monster_defeat: {
    id: "monster_defeat",
    key: "effect:monster_defeat",
    path: "assets/effects/combat/monster_defeat.png",
  },
  level_up: {
    id: "level_up",
    key: "effect:level_up",
    path: "assets/effects/combat/level_up.png",
  },
  item_drop: {
    id: "item_drop",
    key: "effect:item_drop",
    path: "assets/effects/combat/item_drop.png",
  },
  gold_gain: {
    id: "gold_gain",
    key: "effect:gold_gain",
    path: "assets/effects/combat/gold_gain.png",
  },
};

export const EFFECT_ASSET_LIST = Object.values(EFFECT_ASSETS);

export function getEffectAsset(effectId: string): VisualAssetEntry | undefined {
  return EFFECT_ASSETS[effectId];
}
