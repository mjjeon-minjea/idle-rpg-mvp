export interface VisualAssetEntry {
  id: string;
  key: string;
  path: string;
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
