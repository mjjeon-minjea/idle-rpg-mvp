import type { PlayerState, ResolvedReward, RewardData } from "../types/GameTypes";
import { InventorySystem } from "./InventorySystem";

export class RewardSystem {
  constructor(private readonly rewards: RewardData[]) {}

  applyResolvedReward(reward: ResolvedReward, player: PlayerState, inventory: InventorySystem): void {
    player.exp += reward.exp;
    player.gold += reward.gold;

    for (const item of reward.items) {
      inventory.addItem(item.itemId, item.quantity);
    }
  }

  applyReward(rewardId: string, player: PlayerState, inventory: InventorySystem): RewardData {
    const reward = this.rewards.find((candidate) => candidate.id === rewardId);
    if (!reward) {
      throw new Error(`Reward not found: ${rewardId}`);
    }

    this.applyResolvedReward(reward, player, inventory);

    return reward;
  }
}
