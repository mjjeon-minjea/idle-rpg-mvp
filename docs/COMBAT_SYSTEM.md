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

```ts
monsterDamage = Math.max(1, player.attack - monster.data.defense);
playerDamage = Math.max(1, monster.data.attack - player.defense);
```

## Current Risk (현재 위험)

- Level-up (레벨업)
- Equipment stats (장비 스탯)
- Skill effects (스킬 효과)
- Critical hit (치명타)

위 항목은 아직 전투 공식에 포함되지 않았다.
