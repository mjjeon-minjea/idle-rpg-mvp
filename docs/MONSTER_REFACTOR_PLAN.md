# Monster Refactor Plan (몬스터 리팩토링 계획)

## 1. Goal (목표)

Monster System (몬스터 시스템)을 data-driven architecture (데이터 기반 아키텍처)로 유지한다. MVP 1에서는 과한 상속 구조를 만들지 않고 `MonsterData (몬스터 정적 데이터)`와 `MonsterInstance (몬스터 런타임 객체)`를 분리하는 데 집중한다.

## 2. Current Implemented Scope (현재 구현 범위)

Implemented (구현됨)

- `MonsterData (몬스터 정적 데이터)` uses `baseExp`, `baseGold`, and `dropTableId`.
- `MonsterInstance (몬스터 런타임 객체)` stores runtime combat state.
- `MonsterFactory (몬스터 생성기)` creates runtime monsters.
- `MonsterPoolSystem (몬스터 풀 시스템)` selects monsters by stage pool and weight.
- `CombatSystem (전투 시스템)` returns combat results and does not grant rewards.
- `RewardResolver (보상 계산기)` calculates monster kill rewards.
- `DropResolver (드랍 계산기)` applies `dropRateBonus`.

Documented / Designed (문서화/설계됨)

- `SingleEntityMonster (단일 개체 몬스터)` as the MVP runtime model.
- `SegmentedMonster (세그먼트형 몬스터)` as a future boss/world-boss extension.
- `StateMachine (상태 머신)` direction.
- `Strategy Pattern (전략 패턴)` direction.
- `Component Composition (컴포넌트 조합)` direction.

## 3. Reward Rules (보상 규칙)

```ts
finalExp = Math.floor(monster.baseExp * stage.expMultiplier);
finalGold = Math.floor(monster.baseGold * stage.goldMultiplier);

finalDropRate = baseDropRate * (1 + stage.dropRateBonus);
finalDropRate = clamp(finalDropRate, 0, 1);
```

- `dropRateBonus` applies only to item drop rates.
- `CombatSystem (전투 시스템)` must not apply rewards.
- `RewardResolver (보상 계산기)` calculates exp, gold, and item drops.
- `RewardSystem (보상 적용 시스템)` applies final rewards to player and inventory.

## 4. Source Migration TODO (소스 이동 TODO)

Current source files are still flat under `src/systems/`.

```text
src/systems/
├─ CombatSystem.ts
├─ DropResolver.ts
├─ InventorySystem.ts
├─ MonsterFactory.ts
├─ MonsterPoolSystem.ts
├─ RandomService.ts
├─ RewardResolver.ts
├─ RewardSystem.ts
├─ SaveSystem.ts
└─ StageProgressSystem.ts
```

Future target structure (추후 목표 구조):

```text
src/systems/
├─ combat/
├─ monster/
├─ reward/
├─ stage/
├─ random/
├─ inventory/
└─ save/
```

이번 README/docs 정리 작업에서는 source migration (소스 이동)을 하지 않는다. 이동 시 `GameScene.ts`, `DataLoader.ts`, `src/systems/**`, `src/types/**`의 import path (import 경로)를 함께 수정해야 한다.

## 5. Future Extension (추후 확장)

- `EquipmentSystem (장비 시스템)`에서 장비 등급별 랜덤 드랍을 `itemPoolId/gradeWeights`로 확장한다.
- `SegmentedMonster (세그먼트형 몬스터)`는 MVP 2 이후 Multi-Part Boss (다중 부위 보스), World Boss (월드 보스), Boss Phase (보스 페이즈)에 사용한다.
