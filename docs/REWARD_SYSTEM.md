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
```

## Monster Kill Reward (몬스터 처치 보상)

`RewardResolver (보상 계산기)`가 계산한다.

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

## Rules (규칙)

- `dropRateBonus` applies only to item drop rate.
- `CombatSystem (전투 시스템)` must not grant rewards.
- `MonsterData (몬스터 정적 데이터)` uses `baseExp` and `baseGold`.
- `rewardMultiplier` is not used.
- `clearRewardMultiplier` is reserved only for stage clear rewards if needed.
