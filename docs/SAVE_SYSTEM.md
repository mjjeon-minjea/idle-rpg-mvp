# Save System (저장 시스템)

## Purpose (목적)

`SaveSystem (저장 시스템)`은 MVP 상태를 `localStorage`에 저장하고 불러온다.

## Saved Data (저장 데이터)

- PlayerState (플레이어 상태)
- InventoryEntry[] (인벤토리 목록)
- StageState (스테이지 상태)

## Current Storage (현재 저장 방식)

```text
localStorage
```

## Current Risk (현재 위험)

- Save versioning (저장 버전 관리)이 아직 없다.
- Save migration (저장 데이터 마이그레이션)이 아직 없다.
- PlayerGrowthSystem, EquipmentSystem, SkillSystem 추가 전 저장 포맷 버전 필드를 검토해야 한다.

## Player Growth Fallback (플레이어 성장 fallback)

기존 저장 데이터에는 `PlayerState.totalExp`가 없을 수 있다.

현재 fallback rule (fallback 규칙):

```text
totalExp = saved.totalExp ?? getTotalExpAtLevelStart(level) + exp
```

`requiredExp (필요 경험치)`는 저장하지 않고 `PlayerGrowthSystem (플레이어 성장 시스템)`이 공식으로 계산한다.
