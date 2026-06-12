import type { MonsterData, ResolvedReward, StageData } from "../types/GameTypes";
import { DropResolver } from "./DropResolver";

export class RewardResolver {
  constructor(private readonly dropResolver: DropResolver) {}

  resolveMonsterReward(monster: MonsterData, stage: StageData): ResolvedReward {
    return {
      exp: Math.floor(monster.baseExp * stage.expMultiplier),
      gold: Math.floor(monster.baseGold * stage.goldMultiplier),
      items: this.dropResolver.resolve(monster.dropTableId, stage.dropRateBonus),
    };
  }
}
