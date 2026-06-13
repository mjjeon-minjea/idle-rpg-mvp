import type { EffectivePlayerStats, MonsterDefeatedResult, MonsterInstance, PlayerState } from "../types/GameTypes";

export interface CombatResult {
  monsterDefeated: boolean;
  playerDamage: number;
  monsterDamage: number;
  defeated?: MonsterDefeatedResult;
}

export class CombatSystem {
  private elapsedMs = 0;

  update(deltaMs: number, player: PlayerState, effectiveStats: EffectivePlayerStats, monster: MonsterInstance): CombatResult | null {
    this.elapsedMs += deltaMs;

    if (this.elapsedMs < monster.attackCooldown || monster.isDead) {
      return null;
    }

    this.elapsedMs = 0;
    monster.currentState = "attacking";

    const monsterDamage = Math.max(1, effectiveStats.attack - monster.data.defense);
    monster.currentHp = Math.max(0, monster.currentHp - monsterDamage);

    if (monster.currentHp <= 0) {
      monster.isDead = true;
      monster.currentState = "dead";

      return {
        monsterDefeated: true,
        playerDamage: 0,
        monsterDamage,
        defeated: {
          defeatedMonsterId: monster.data.id,
          monsterRole: monster.data.role,
          playerDamage: 0,
          monsterDamage,
        },
      };
    }

    const playerDamage = Math.max(1, monster.data.attack - effectiveStats.defense);
    player.hp = Math.max(0, player.hp - playerDamage);
    monster.lastAttackAt += monster.attackCooldown;
    monster.currentState = "idle";

    if (player.hp <= 0) {
      player.hp = effectiveStats.maxHp;
    }

    return {
      monsterDefeated: false,
      playerDamage,
      monsterDamage,
    };
  }
}
