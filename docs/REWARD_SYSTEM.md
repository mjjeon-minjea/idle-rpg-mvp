# Reward System (보상 시스템)

## Purpose (목적)

Reward flow (보상 흐름)는 계산과 적용을 분리한다.

```text
CombatSystem (전투 시스템)
= combat result only (전투 결과만 반환)

RewardResolver (보상 계산기)
= calculates exp/gold/items (경험치/골드/아이템 계산)

RewardSystem (보상 적용 시스템)
= applies final reward to player/inventory (최종 보상을 플레이어/인벤토리에 적용)

PlayerGrowthSystem (플레이어 성장 시스템)
= applies exp progress, level up, and stat growth (경험치 진행/레벨업/스탯 성장 적용)
```

## Monster Kill Reward (몬스터 처치 보상)

`RewardResolver (보상 계산기)`가 계산하고, `RewardSystem (보상 적용 시스템)`이 `PlayerGrowthSystem (플레이어 성장 시스템)`에 경험치 적용을 위임한다.

```ts
finalExp = Math.floor(monster.baseExp * stage.expMultiplier);
finalGold = Math.floor(monster.baseGold * stage.goldMultiplier);
```

## Item Drop Reward (아이템 드랍 보상)

`DropResolver (드랍 계산기)`가 계산한다.

```ts
finalDropRate = baseDropRate * (1 + stage.dropRateBonus);
finalDropRate = clamp(finalDropRate, 0, 1);
```

현재 구현에서는 `Math.min(1, ...)`으로 1.0 초과를 제한한다.

## Stage Clear Reward (스테이지 클리어 보상)

`data/rewards.json`의 clear reward (클리어 보상)를 `RewardSystem (보상 적용 시스템)`이 적용한다.

Current stage clear reward guarantee (현재 스테이지 클리어 보상 보장):

```text
Stage 3 dawn_forest_3_clear -> rusty_training_sword
Stage 6 mist_gate_3_clear -> worn_apprentice_armor
Stage 9 old_mine_3_clear -> cracked_apprentice_ring + guardian_stone
```

이 보장은 드랍 운이 나빠도 `EquipmentSystem (장비 시스템)`과 후반 스테이지 진행을 검증할 수 있게 하기 위한 MVP 정책이다.

## Rules (규칙)

- `dropRateBonus` applies only to item drop rate.
- `CombatSystem (전투 시스템)` must not grant rewards.
- `SkillSystem (스킬 시스템)` must not grant rewards.
- `RewardSystem (보상 적용 시스템)` remains the reward application entry point.
- `PlayerGrowthSystem (플레이어 성장 시스템)` owns exp accumulation, level up, required exp, and stat growth.
- `MonsterData (몬스터 정적 데이터)` uses `baseExp` and `baseGold`.
- Legacy generic reward multiplier fields are not used.
- Equipment item drops (장비 아이템 드랍) still use the same `DropResolver -> RewardResolver -> RewardSystem -> InventorySystem` flow.
- Skill defeats (스킬 처치) reuse the same `handleMonsterDefeat -> RewardResolver -> RewardSystem` flow, so rewards are applied once.
