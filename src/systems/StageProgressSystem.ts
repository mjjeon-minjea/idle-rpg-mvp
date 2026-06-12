import type { MonsterData, StageData, StageEncounterType, StageState } from "../types/GameTypes";

export interface StageClearResult {
  cleared: boolean;
  rewardId: string | null;
}

export class StageProgressSystem {
  private currentStageIndex = 0;
  private normalKills = 0;
  private encounterType: StageEncounterType = "normal";

  constructor(private readonly stages: StageData[], initialState?: StageState) {
    if (initialState) {
      const index = this.stages.findIndex((stage) => stage.id === initialState.currentStageId);
      this.currentStageIndex = Math.max(0, index);
      this.normalKills = initialState.normalKills;
      this.encounterType = initialState.encounterType ?? "normal";
    }
  }

  getCurrentStage(): StageData {
    return this.stages[this.currentStageIndex];
  }

  getNormalKills(): number {
    return this.normalKills;
  }

  getEncounterType(): StageEncounterType {
    return this.encounterType;
  }

  recordMonsterDefeat(monster: MonsterData): StageClearResult {
    if (this.encounterType === "normal" && monster.role === "normal") {
      this.normalKills += 1;
      if (this.normalKills >= this.getCurrentStage().requiredNormalKills) {
        this.encounterType = "leader";
      }

      return { cleared: false, rewardId: null };
    }

    if (this.encounterType === "leader" && monster.role === "leader") {
      const stage = this.getCurrentStage();
      if (stage.bossMonsterId) {
        this.encounterType = "boss";
        return { cleared: false, rewardId: null };
      }

      return this.clearCurrentStage();
    }

    if (this.encounterType === "boss" && monster.role === "boss") {
      return this.clearCurrentStage();
    }

    return { cleared: false, rewardId: null };
  }

  toState(): StageState {
    return {
      currentStageId: this.getCurrentStage().id,
      normalKills: this.normalKills,
      encounterType: this.encounterType,
    };
  }

  private clearCurrentStage(): StageClearResult {
    const rewardId = this.getCurrentStage().clearRewardId;
    this.advanceStage();
    return { cleared: true, rewardId };
  }

  private advanceStage(): void {
    if (this.currentStageIndex < this.stages.length - 1) {
      this.currentStageIndex += 1;
    }

    this.normalKills = 0;
    this.encounterType = "normal";
  }
}
