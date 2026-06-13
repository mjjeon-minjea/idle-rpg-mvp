import type {
  EffectivePlayerStats,
  MonsterInstance,
  PlayerState,
  SkillCooldownView,
  SkillData,
  SkillResult,
  SkillRuntimeState,
  SkillState,
} from "../types/GameTypes";

export class SkillSystem {
  private readonly skillsById: Map<string, SkillData>;
  private readonly state: SkillState;
  private readonly runtimeState: SkillRuntimeState = {
    cooldownRemainingBySkillId: {},
  };

  constructor(skills: SkillData[], initialState: SkillState) {
    this.skillsById = new Map(skills.map((skill) => [skill.id, skill]));
    this.state = {
      unlockedSkillIds: [...initialState.unlockedSkillIds],
      equippedSkillIds: [...initialState.equippedSkillIds],
    };
    this.validateState(this.state);
  }

  update(
    deltaMs: number,
    player: PlayerState,
    effectiveStats: EffectivePlayerStats,
    monster: MonsterInstance,
  ): SkillResult {
    this.updateCooldowns(deltaMs);
    this.unlockAvailableSkills(player);

    if (player.hp <= 0) {
      return { triggered: false, defeated: false, reason: "player_dead" };
    }

    if (monster.isDead) {
      return { triggered: false, defeated: false, reason: "monster_dead" };
    }

    let blockedReason = "cooldown";
    let blockedSkill: SkillData | undefined;

    for (const skillId of this.state.equippedSkillIds) {
      const skill = this.getSkillOrThrow(skillId);

      if (!this.state.unlockedSkillIds.includes(skill.id)) {
        blockedReason = "not_unlocked";
        blockedSkill = skill;
        continue;
      }

      if (player.level < skill.requiredLevel) {
        blockedReason = "level_required";
        blockedSkill = skill;
        continue;
      }

      const cooldownRemaining = this.getCooldownRemaining(skill.id);
      if (cooldownRemaining > 0) {
        continue;
      }

      return this.triggerSkill(skill, effectiveStats, monster);
    }

    return {
      triggered: false,
      skillId: blockedSkill?.id,
      skillName: blockedSkill?.name,
      defeated: false,
      reason: blockedReason,
    };
  }

  getCooldownViews(player: PlayerState): SkillCooldownView[] {
    this.unlockAvailableSkills(player);

    return this.state.equippedSkillIds.map((skillId) => {
      const skill = this.getSkillOrThrow(skillId);
      const cooldownRemainingMs = this.getCooldownRemaining(skill.id);
      const unlocked = this.state.unlockedSkillIds.includes(skill.id);

      return {
        skillId: skill.id,
        skillName: skill.name,
        ready: unlocked && player.level >= skill.requiredLevel && cooldownRemainingMs <= 0,
        cooldownRemainingMs,
        requiredLevel: skill.requiredLevel,
        unlocked,
      };
    });
  }

  toState(): SkillState {
    return {
      unlockedSkillIds: [...this.state.unlockedSkillIds],
      equippedSkillIds: [...this.state.equippedSkillIds],
    };
  }

  private triggerSkill(skill: SkillData, effectiveStats: EffectivePlayerStats, monster: MonsterInstance): SkillResult {
    const damage = Math.max(
      1,
      Math.floor(effectiveStats.attack * skill.damageMultiplier + skill.flatDamage - monster.data.defense),
    );

    monster.currentHp = Math.max(0, monster.currentHp - damage);
    this.runtimeState.cooldownRemainingBySkillId[skill.id] = skill.cooldownMs;

    if (monster.currentHp <= 0) {
      monster.isDead = true;
      monster.currentState = "dead";
    }

    return {
      triggered: true,
      skillId: skill.id,
      skillName: skill.name,
      damage,
      defeated: monster.isDead,
    };
  }

  private updateCooldowns(deltaMs: number): void {
    for (const [skillId, cooldownRemaining] of Object.entries(this.runtimeState.cooldownRemainingBySkillId)) {
      this.runtimeState.cooldownRemainingBySkillId[skillId] = Math.max(0, cooldownRemaining - deltaMs);
    }
  }

  private unlockAvailableSkills(player: PlayerState): void {
    for (const skill of this.skillsById.values()) {
      if (player.level < skill.requiredLevel || this.state.unlockedSkillIds.includes(skill.id)) {
        continue;
      }

      this.state.unlockedSkillIds.push(skill.id);
    }
  }

  private getCooldownRemaining(skillId: string): number {
    return this.runtimeState.cooldownRemainingBySkillId[skillId] ?? 0;
  }

  private getSkillOrThrow(skillId: string): SkillData {
    const skill = this.skillsById.get(skillId);
    if (!skill) {
      throw new Error(`Skill state references missing skillId "${skillId}".`);
    }

    return skill;
  }

  private validateState(state: SkillState): void {
    this.validateSkillIdList(state.unlockedSkillIds, "unlockedSkillIds");
    this.validateSkillIdList(state.equippedSkillIds, "equippedSkillIds");

    if (state.equippedSkillIds.length > 2) {
      throw new Error("SkillState.equippedSkillIds must include at most 2 skills.");
    }
  }

  private validateSkillIdList(skillIds: string[], label: string): void {
    const seen = new Set<string>();
    for (const skillId of skillIds) {
      if (!this.skillsById.has(skillId)) {
        throw new Error(`SkillState.${label} references missing skillId "${skillId}".`);
      }

      if (seen.has(skillId)) {
        throw new Error(`SkillState.${label} includes duplicate skillId "${skillId}".`);
      }

      seen.add(skillId);
    }
  }
}
