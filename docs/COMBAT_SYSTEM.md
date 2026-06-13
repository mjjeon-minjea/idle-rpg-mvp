# Combat System (전투 시스템)

## Purpose (목적)

`CombatSystem (전투 시스템)`은 MVP 자동 전투의 피해 계산과 처치 결과 반환만 담당한다.

## Responsibility (책임)

- Attack interval tick (공격 간격 처리)
- Player damage to monster (플레이어가 몬스터에게 주는 피해)
- Monster damage to player (몬스터가 플레이어에게 주는 피해)
- Monster state update (몬스터 상태 갱신)
- `MonsterDefeatedResult (몬스터 처치 결과)` 반환

## Forbidden Responsibility (금지 책임)

`CombatSystem (전투 시스템)`은 아래를 직접 처리하지 않는다.

- 경험치 지급
- 골드 지급
- 아이템 지급
- 인벤토리 수정
- 스테이지 클리어 보상 지급

## Current Formula (현재 공식)

Basic attack formula (기본 공격 공식):

```ts
monsterDamage = Math.max(1, effectiveStats.attack - monster.data.defense);
playerDamage = Math.max(1, monster.data.attack - effectiveStats.defense);
```

Skill damage formula (스킬 피해 공식):

```ts
skillDamage = Math.max(
  1,
  Math.floor(effectiveStats.attack * skill.damageMultiplier + skill.flatDamage - monster.data.defense)
);
```

`EffectivePlayerStats (최종 플레이어 스탯)` includes equipment bonuses (장비 보너스).

Future note (추후 계획):

- Damage formula (피해 공식)는 추후 `DamageFormula (피해 공식)` 또는 `CombatFormula (전투 공식)` 모듈로 분리할 수 있다.

## Skill Connection (스킬 연결)

`SkillSystem (스킬 시스템)`은 기본 공격을 대체하지 않고 additional auto attack (자동 발동 추가 공격)으로 동작한다.

```text
SkillSystem.update
-> if monster defeated by skill, skip CombatSystem.update for that tick
-> otherwise CombatSystem.update runs normally
```

스킬 발동 자체는 monster counterattack (몬스터 즉시 반격)을 유발하지 않는다. 몬스터 공격 타이밍은 `CombatSystem (전투 시스템)`이 계속 관리한다.

## Current Risk (현재 위험)

- Critical hit (치명타)

위 항목은 아직 전투 공식에 포함되지 않았다.
