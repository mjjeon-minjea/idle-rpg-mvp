# Player Growth System (플레이어 성장 시스템)

## Purpose (목적)

`PlayerGrowthSystem (플레이어 성장 시스템)`은 플레이어의 Experience Accumulation (경험치 누적), Required Exp Calculation (필요 경험치 계산), Level Up Processing (레벨업 처리), Stat Growth (스탯 상승)을 담당한다.

## Responsibility (책임)

- Add gained experience (획득 경험치 적용)
- Track current level progress exp (현재 레벨 진행 경험치 추적)
- Track total accumulated exp (전체 누적 경험치 추적)
- Calculate required exp (필요 경험치 계산)
- Process multiple level ups with `while` (여러 번 레벨업 처리)
- Apply level-up stat gains (레벨업 스탯 상승 적용)
- Restore HP to max HP after level up (레벨업 후 체력 회복)
- Return `GrowthResult (성장 결과)`

## Experience Meaning (경험치 의미)

```text
exp = 현재 레벨에서 다음 레벨까지의 진행 경험치
totalExp = 지금까지 누적 획득한 전체 경험치
requiredExp = 저장하지 않고 공식으로 계산하는 파생값
```

## Required Exp Formula (필요 경험치 공식)

MVP 1 formula (1차 MVP 공식):

```ts
requiredExp = Math.floor(40 * level * 1.25 ** (level - 1));
```

Future note (추후 계획):

- Growth formula (성장 공식)는 추후 `GrowthConfig (성장 설정)` JSON 데이터로 분리할 수 있다.
- 현재는 MVP 검증을 위해 `PlayerGrowthSystem (플레이어 성장 시스템)` 내부 공식으로 유지한다.

## Level Up Flow (레벨업 흐름)

```text
Gain experience (경험치 획득)
-> Add to player.exp and player.totalExp (현재/누적 경험치 증가)
-> If player.exp >= requiredExp, level up (필요 경험치 이상이면 레벨업)
-> Subtract requiredExp from player.exp (필요 경험치 차감)
-> Apply stat gains (스탯 상승 적용)
-> Repeat while player.exp >= next requiredExp (남은 경험치로 반복 확인)
-> If at least one level gained, hp = maxHp (레벨업했다면 최종 체력 회복)
```

## Stat Growth (스탯 상승)

Per level (1레벨당):

```text
maxHp +12
attack +3
defense +1
```

`statGain (스탯 상승량)`은 이번 경험치 적용으로 오른 전체 증가량을 합산한다.

Example (예시):

```text
3 levels gained
maxHp +36
attack +9
defense +3
```

## Reward Connection (보상 연결)

```text
RewardResolver (보상 계산기)
-> calculates exp/gold/items (경험치/골드/아이템 계산)
-> RewardSystem (보상 적용 시스템)
-> PlayerGrowthSystem.addExp (경험치 누적/레벨업)
-> InventorySystem (아이템 적용)
```

Rules (규칙):

- `CombatSystem (전투 시스템)`은 보상을 지급하지 않는다.
- `RewardResolver (보상 계산기)`는 보상을 계산만 한다.
- `RewardSystem (보상 적용 시스템)`은 보상 적용 진입점이다.
- `PlayerGrowthSystem (플레이어 성장 시스템)`은 경험치/레벨/스탯 성장만 담당한다.
- `SkillSystem (스킬 시스템)`은 스킬 발동으로 `PlayerState (플레이어 상태)`의 기본 스탯을 직접 변경하지 않는다.

## Save Fallback (저장 데이터 fallback)

기존 저장 데이터에는 `totalExp`가 없을 수 있다.

Fallback rule (fallback 규칙):

```ts
totalExp = saved.totalExp ?? getTotalExpAtLevelStart(level) + exp;
```

이렇게 하면 기존 저장 데이터가 깨지지 않고, 현재 레벨과 현재 경험치를 기준으로 누적 경험치를 추정할 수 있다.
