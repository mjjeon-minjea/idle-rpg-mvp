import type { MonsterData, MonsterInstance, MonsterRuntimeState } from "../types/GameTypes";

export class HealthComponent {
  constructor(maxHp: number, private currentHp: number = maxHp) {}

  takeDamage(amount: number): number {
    const damage = Math.max(0, amount);
    this.currentHp = Math.max(0, this.currentHp - damage);
    return damage;
  }

  getCurrentHp(): number {
    return this.currentHp;
  }

  isDead(): boolean {
    return this.currentHp <= 0;
  }
}

export class StatComponent {
  constructor(readonly attack: number, readonly defense: number) {}
}

export class MonsterFactory {
  create(data: MonsterData, now: number): MonsterInstance {
    const health = new HealthComponent(data.maxHp);
    const currentState: MonsterRuntimeState = "idle";

    return {
      data,
      currentHp: health.getCurrentHp(),
      currentState,
      attackCooldown: 850,
      isDead: health.isDead(),
      spawnedAt: now,
      lastAttackAt: now,
    };
  }
}
