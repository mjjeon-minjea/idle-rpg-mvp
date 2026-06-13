import type { GrowthResult, PlayerState } from "../types/GameTypes";

const HP_GAIN_PER_LEVEL = 12;
const ATTACK_GAIN_PER_LEVEL = 3;
const DEFENSE_GAIN_PER_LEVEL = 1;

export class PlayerGrowthSystem {
  getRequiredExp(level: number): number {
    return Math.floor(40 * level * 1.25 ** (level - 1));
  }

  getTotalExpAtLevelStart(level: number): number {
    let total = 0;
    for (let currentLevel = 1; currentLevel < level; currentLevel += 1) {
      total += this.getRequiredExp(currentLevel);
    }

    return total;
  }

  addExp(player: PlayerState, gainedExp: number): GrowthResult {
    const normalizedGainedExp = Math.max(0, Math.floor(gainedExp));
    const levelBefore = player.level;
    const expBefore = player.exp;
    const requiredExpBefore = this.getRequiredExp(levelBefore);
    const statGain = {
      maxHp: 0,
      attack: 0,
      defense: 0,
    };

    player.exp += normalizedGainedExp;
    player.totalExp += normalizedGainedExp;

    while (player.exp >= this.getRequiredExp(player.level)) {
      player.exp -= this.getRequiredExp(player.level);
      player.level += 1;

      player.maxHp += HP_GAIN_PER_LEVEL;
      player.attack += ATTACK_GAIN_PER_LEVEL;
      player.defense += DEFENSE_GAIN_PER_LEVEL;

      statGain.maxHp += HP_GAIN_PER_LEVEL;
      statGain.attack += ATTACK_GAIN_PER_LEVEL;
      statGain.defense += DEFENSE_GAIN_PER_LEVEL;
    }

    const levelsGained = player.level - levelBefore;
    if (levelsGained > 0) {
      player.hp = player.maxHp;
    }

    return {
      gainedExp: normalizedGainedExp,
      totalExp: player.totalExp,
      levelBefore,
      levelAfter: player.level,
      levelsGained,
      expBefore,
      expAfter: player.exp,
      requiredExpBefore,
      requiredExpAfter: this.getRequiredExp(player.level),
      statGain,
    };
  }
}
