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
```

## Current Stage Content (현재 스테이지 콘텐츠)

현재 MVP 데이터는 3개 지역, 9개 스테이지로 구성된다.

```text
Region 1: Dawn Forest (새벽 숲)
1. dawn_forest_1
2. dawn_forest_2
3. dawn_forest_3 boss: dawn_treant

Region 2: Mist Gate (안개 관문)
4. mist_gate_1
5. mist_gate_2
6. mist_gate_3 boss: sleepy_ogre

Region 3: Old Mine (오래된 광산)
7. old_mine_1
8. old_mine_2
9. old_mine_3 boss: ancient_mine_guardian
```

Content scale (콘텐츠 규모):

```text
stages: 9
normal monsters: 9
leader monsters: 3
boss monsters: 3
```

## Stage Validation (스테이지 검증)

`DataLoader (데이터 로더)`는 아래를 검증한다.

```text
StageData.order 중복 금지
StageData.order는 1 이상
StageData.requiredNormalKills는 1 이상
StageData.expMultiplier > 0
StageData.goldMultiplier > 0
StageData.dropRateBonus >= 0
stages 배열은 order 오름차순
```

## Current Risk (현재 위험)

MVP 개발 중 stage id/order (스테이지 ID/순서) 변경은 기존 localStorage 저장 데이터와 어긋날 수 있다. 필요하면 저장 데이터를 초기화한다.
