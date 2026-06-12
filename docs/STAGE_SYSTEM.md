# Stage System (스테이지 시스템)

## Purpose (목적)

`StageProgressSystem (스테이지 진행 시스템)`은 현재 스테이지, 일반 몬스터 처치 수, encounter type (전투 대상 종류), 클리어 흐름을 관리한다.

## Runtime Flow (런타임 흐름)

```text
Normal Monster N kills (일반 몬스터 N마리 처치)
-> Leader Monster appears (리더 몬스터 등장)
-> Leader Monster defeated (리더 처치)
-> Boss Monster appears if exists (보스가 있으면 보스 등장)
-> Boss Monster defeated or no boss stage cleared (보스 처치 또는 보스 없음이면 클리어)
```

## Responsibility (책임)

- Track current stage (현재 스테이지 추적)
- Count normal monster defeats (일반 몬스터 처치 수 계산)
- Switch to leader encounter (리더 전투로 전환)
- Switch to boss encounter when `bossMonsterId` exists (보스가 있으면 보스 전투로 전환)
- Clear stage after boss defeat (보스 처치 시 클리어)
- Clear stage after leader defeat when no boss exists (보스가 없으면 리더 처치 시 클리어)

## Current Data (현재 데이터)

`StageData (스테이지 데이터)`는 아래 필드를 사용한다.

```text
normalMonsterPoolId
leaderMonsterPoolId
bossMonsterId?
requiredNormalKills
clearRewardId
expMultiplier
goldMultiplier
dropRateBonus
clearRewardMultiplier?
```

## Current Risk (현재 위험)

현재 샘플 스테이지 수는 적다. 스테이지 콘텐츠 확장은 core loop (핵심 루프)가 안정화된 뒤 진행한다.
