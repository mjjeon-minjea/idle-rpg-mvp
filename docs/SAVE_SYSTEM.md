# Save System (저장 시스템)

## Purpose (목적)

`SaveSystem (저장 시스템)`은 MVP 상태를 `localStorage`에 저장하고 불러온다.

## Saved Data (저장 데이터)

- PlayerState (플레이어 상태)
- InventoryEntry[] (인벤토리 목록)
- EquipmentState (장착 상태)
- SkillState (스킬 상태)
- StageState (스테이지 상태)

## Current Storage (현재 저장 방식)

```text
localStorage
```

## Current Risk (현재 위험)

- Save versioning (저장 버전 관리)이 아직 없다.
- Save migration (저장 데이터 마이그레이션)이 아직 없다.
- RebirthSystem, JobSystem 같은 장기 진행 시스템을 추가하기 전 저장 포맷 버전 필드를 검토해야 한다.
- Stage data expansion (스테이지 데이터 확장) 후 기존 localStorage 저장 데이터는 현재 스테이지 위치가 어긋날 수 있다.

## Player Growth Fallback (플레이어 성장 fallback)

기존 저장 데이터에는 `PlayerState.totalExp`가 없을 수 있다.

현재 fallback rule (fallback 규칙):

```text
totalExp = saved.totalExp ?? getTotalExpAtLevelStart(level) + exp
```

`requiredExp (필요 경험치)`는 저장하지 않고 `PlayerGrowthSystem (플레이어 성장 시스템)`이 공식으로 계산한다.

## Equipment Fallback (장비 fallback)

기존 저장 데이터에는 `equipment`가 없을 수 있다.

```text
equipment = saved.equipment ?? { equipped: {} }
```

장착 상태는 `EquipmentSystem.toState()` 결과로 저장한다.

## Skill Fallback (스킬 fallback)

기존 저장 데이터에는 `skills`가 없을 수 있다.

```text
skills = saved.skills ?? defaultSkillState
```

MVP 1 default skill state (1차 MVP 기본 스킬 상태):

```ts
{
  unlockedSkillIds: ["trainee_slash"],
  equippedSkillIds: ["trainee_slash", "heavy_training_strike"]
}
```

`SkillRuntimeState (스킬 런타임 상태)`는 저장하지 않는다.

```text
저장/불러오기 후 쿨타임은 0부터 시작한다.
```

## MVP Development Reset (MVP 개발 중 저장 초기화)

MVP 개발 중 스테이지 데이터가 확장되면 기존 저장 데이터의 `currentStageId (현재 스테이지 ID)`가 의도와 다르게 해석될 수 있다. 예를 들어 기존 `mist_gate_1` 저장 데이터는 확장 후 Stage 4 위치를 가리킨다.

개발 중에는 필요 시 브라우저 콘솔에서 아래 명령으로 저장 데이터를 초기화한다.

```js
localStorage.removeItem("idle-rpg-mvp-save");
location.reload();
```

## Manual Save Verification (수동 저장 검증)

브라우저에서 저장 데이터를 직접 확인하려면 개발자 도구 콘솔에서 아래 명령을 실행한다.

```js
JSON.parse(localStorage.getItem("idle-rpg-mvp-save"));
```

저장 데이터에는 최소한 아래 항목이 포함되어야 한다.

```text
player
inventory
equipment
skills
stage
```

수동 검증 절차는 `docs/MANUAL_PLAYTEST_CHECKLIST.md`를 따른다.
