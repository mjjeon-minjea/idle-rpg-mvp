import type { GrowthResult, PlayerState, ResolvedReward, RewardData } from "../types/GameTypes";
import { InventorySystem } from "./InventorySystem";
import { PlayerGrowthSystem } from "./PlayerGrowthSystem";

export interface RewardApplicationResult {
  reward: ResolvedReward;
  growth: GrowthResult;
}

export class RewardSystem {
  constructor(private readonly rewards: RewardData[], private readonly growthSystem: PlayerGrowthSystem) {}

  applyResolvedReward(reward: ResolvedReward, player: PlayerState, inventory: InventorySystem): RewardApplicationResult {
    const growth = this.growthSystem.addExp(player, reward.exp);
    player.gold += reward.gold;

    for (const item of reward.items) {
      inventory.addItem(item.itemId, item.quantity);
    }

    return { reward, growth };
  }

  applyReward(rewardId: string, player: PlayerState, inventory: InventorySystem): RewardApplicationResult {
    const reward = this.rewards.find((candidate) => candidate.id === rewardId);
    if (!reward) {
      throw new Error(`Reward not found: ${rewardId}`);
    }

    return this.applyResolvedReward(reward, player, inventory);
  }
}
