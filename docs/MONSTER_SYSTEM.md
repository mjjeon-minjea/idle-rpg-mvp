# Monster System Architecture (몬스터 시스템 아키텍처)

## 1. Architecture Design (아키텍처 설계)

### 1.1 Core Principles (핵심 원칙)

- Single Responsibility Principle (단일 책임 원칙)
- Open-Closed Principle (개방-폐쇄 원칙)
- Dependency Inversion (의존성 역전)
- Composition over Inheritance (상속보다 조합 우선)
- Data-Driven Design (데이터 기반 설계)

### 1.2 Monster Type Classification (몬스터 타입 분류)

```text
MonsterBase (몬스터 공통 기반 / 추상 개념)
├─ SingleEntityMonster (단일 개체 몬스터)
│  ├─ BasicMonster (기본 몬스터 / 일반 몬스터)
│  ├─ LeaderMonster (리더 몬스터 / 중간 강화 몬스터)
│  └─ BossMonster (보스 몬스터)
│
└─ SegmentedMonster (세그먼트형 몬스터 / 추후 확장)
   ├─ MultiPartBossMonster (다중 부위 보스)
   ├─ WorldBossMonster (월드 보스)
   └─ PhaseBossMonster (페이즈 보스)
```

MVP 1 rule (1차 MVP 원칙):

```text
MVP 1 = SingleEntityMonster only
1차 MVP = 단일 개체 몬스터만 실제 구현
```

현재 코드에서는 `BasicMonster`, `LeaderMonster`, `BossMonster` 클래스를 따로 만들지 않는다. `MonsterData.role` 값인 `normal`, `leader`, `boss`로 구분한다.

`SegmentedMonster (세그먼트형 몬스터)`는 MVP 1에서 구현하지 않고 추후 확장 구조로 문서에만 남긴다.

### 1.3 Data vs Runtime Object (데이터와 런타임 객체 분리)

`MonsterData (몬스터 정적 데이터)`는 JSON에 저장되는 static source data (정적 원본 데이터)입니다.

```text
MonsterData
├─ id
├─ name
├─ role
├─ maxHp
├─ attack
├─ defense
├─ baseExp
├─ baseGold
└─ dropTableId
```

`MonsterInstance (몬스터 런타임 객체)`는 전투 중 생성되는 actual monster object (실제 몬스터 객체)입니다.

```text
MonsterInstance
├─ data
├─ currentHp
├─ currentState
├─ attackCooldown
├─ isDead
├─ spawnedAt
└─ lastAttackAt
```

중요 규칙:

```text
MonsterData = static source data (정적 원본 데이터)
MonsterInstance = runtime combat object (전투 중 살아있는 객체)
```

### 1.4 Runtime Flow (런타임 흐름)

```text
StageData (스테이지 데이터)
-> MonsterPoolSystem (몬스터 풀 시스템)
-> MonsterData selected (몬스터 정적 데이터 선택)
-> MonsterFactory (몬스터 생성기)
-> MonsterInstance created (몬스터 런타임 객체 생성)
-> CombatSystem (전투 시스템)
-> MonsterDefeatedResult (몬스터 처치 결과)
-> RewardResolver (보상 계산기)
-> RewardSystem (보상 적용 시스템)
```

## 2. Current Files (현재 파일)

```text
src/
├─ types/
│  └─ GameTypes.ts                # MonsterData / MonsterInstance / MonsterRole types
├─ systems/
│  ├─ MonsterFactory.ts           # MonsterFactory (몬스터 생성기)
│  ├─ MonsterPoolSystem.ts        # MonsterPoolSystem (몬스터 풀 시스템)
│  ├─ CombatSystem.ts             # CombatSystem (전투 시스템)
│  ├─ DropResolver.ts             # DropResolver (드랍 계산기)
│  ├─ RewardResolver.ts           # RewardResolver (보상 계산기)
│  └─ RewardSystem.ts             # RewardSystem (보상 적용 시스템)
└─ loaders/
   └─ DataLoader.ts               # JSON load and validation (JSON 로딩/검증)
```

## 3. Current Data Files (현재 데이터 파일)

```text
data/
├─ monsters.json                  # MonsterData (몬스터 정적 데이터)
├─ monsterPools.json              # MonsterPoolData (몬스터 풀 데이터)
├─ dropTables.json                # DropTableData (드랍 테이블 데이터)
└─ stages.json                    # StageData (스테이지 데이터)
```

Current content scale (현재 콘텐츠 규모):

```text
normal monsters: 9
leader monsters: 3
boss monsters: 3
total monsters: 15
stages: 9
```

Current regions (현재 지역):

```text
Dawn Forest (새벽 숲)
Mist Gate (안개 관문)
Old Mine (오래된 광산)
```

## 4. StateMachine (상태 머신)

현재 MVP는 enum-based state (문자열 상태)로 관리한다.

```text
spawning -> idle -> attacking -> idle
any state -> stunned
any state -> dead
```

MVP state values (상태 값):

- `spawning`
- `idle`
- `attacking`
- `stunned`
- `dead`

이전 액션 게임식 상태인 `Moving (이동)`, `Rewinding (되감기)`는 이번 idle RPG (방치형 RPG) 구조에서 제외한다.

## 5. Responsibility Boundary (책임 경계)

| System | Responsibility |
| --- | --- |
| `MonsterFactory (몬스터 생성기)` | `MonsterData`로 `MonsterInstance` 생성 |
| `MonsterPoolSystem (몬스터 풀 시스템)` | 스테이지와 encounter type 기준 몬스터 선택 |
| `CombatSystem (전투 시스템)` | 피해 계산과 처치 결과 반환 |
| `RewardResolver (보상 계산기)` | 경험치, 골드, 아이템 드랍 계산 |
| `RewardSystem (보상 적용 시스템)` | 최종 보상을 플레이어와 인벤토리에 적용 |

`CombatSystem (전투 시스템)`은 경험치, 골드, 아이템을 직접 지급하지 않는다.

## 6. Future Target Structure (추후 목표 구조)

아래 구조는 미래 목표이며, 현재 코드에는 아직 적용하지 않았다.

```text
src/systems/
├─ combat/
│  ├─ CombatSystem.ts
│  └─ MonsterDefeatedResult.ts
├─ monster/
│  ├─ MonsterFactory.ts
│  ├─ MonsterInstance.ts
│  ├─ MonsterPoolSystem.ts
│  ├─ MonsterStateMachine.ts
│  └─ MonsterValidator.ts
├─ reward/
│  ├─ DropResolver.ts
│  ├─ RewardResolver.ts
│  └─ RewardSystem.ts
├─ stage/
│  └─ StageProgressSystem.ts
├─ random/
│  ├─ RandomService.ts
│  └─ RandomSource.ts
├─ inventory/
│  └─ InventorySystem.ts
└─ save/
   └─ SaveSystem.ts
```

미래 전용 구조는 실제 필요가 생기기 전까지 코드로 만들지 않는다. Git에 남지 않는 빈 폴더만 만들지 않는다.
