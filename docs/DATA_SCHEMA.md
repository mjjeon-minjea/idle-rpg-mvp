# Data Schema (데이터 스키마)

Balance data (밸런스 데이터)는 가능한 JSON에 둔다. 코드에서는 구조와 검증만 담당한다.

## 1. GameConfigData (게임 설정 데이터)

File (파일): `data/gameConfig.json`

```ts
interface GameConfigData {
  title: string;
  subtitle: string;
}
```

## 2. MonsterData (몬스터 정적 데이터)

File (파일): `data/monsters.json`

```ts
interface MonsterData {
  id: string;
  name: string;
  role: "normal" | "leader" | "boss";
  maxHp: number;
  attack: number;
  defense: number;
  baseExp: number;
  baseGold: number;
  dropTableId: string;
}
```

Rules (규칙):

- `MonsterData` must not have `exp` or `gold`.
- `MonsterData` must use `baseExp`, `baseGold`, and `dropTableId`.
- `dropTableId` must reference an existing `DropTableData (드랍 테이블 데이터)`.

## 3. MonsterPoolData (몬스터 풀 데이터)

File (파일): `data/monsterPools.json`

```ts
interface MonsterPoolData {
  id: string;
  role: "normal" | "leader" | "boss";
  entries: MonsterPoolEntryData[];
}

interface MonsterPoolEntryData {
  monsterId: string;
  weight: number;
}
```

Rules (규칙):

- `monsterId` must reference an existing `MonsterData (몬스터 정적 데이터)`.
- A normal pool must contain only `normal` monsters.
- A leader pool must contain only `leader` monsters.
- Weight (가중치)는 0보다 커야 한다.

## 4. DropTableData (드랍 테이블 데이터)

File (파일): `data/dropTables.json`

```ts
interface DropTableData {
  id: string;
  entries: DropTableEntryData[];
}

interface DropTableEntryData {
  itemId: string;
  dropRate: number;
  minAmount: number;
  maxAmount: number;
}
```

Rules (규칙):

- `itemId` must reference an existing `ItemData (아이템 데이터)`.
- `dropRate` range is 0 to 1.
- MVP 1 does not use `gradeWeight`.
- Future equipment farming can use `itemPoolId/gradeWeights`.

Drop formula (드랍 공식):

```ts
finalDropRate = Math.min(1, baseDropRate * (1 + stage.dropRateBonus));
```

## 5. StageData (스테이지 데이터)

File (파일): `data/stages.json`

```ts
interface StageData {
  id: string;
  name: string;
  order: number;
  normalMonsterPoolId: string;
  leaderMonsterPoolId: string;
  bossMonsterId?: string;
  requiredNormalKills: number;
  clearRewardId: string;
  expMultiplier: number;
  goldMultiplier: number;
  dropRateBonus: number;
  clearRewardMultiplier?: number;
}
```

Rules (규칙):

- `StageData` must not use `normalMonsterId` or `leaderMonsterId`.
- `StageData` must use `normalMonsterPoolId`, `leaderMonsterPoolId`, and optional `bossMonsterId`.
- Do not use `rewardMultiplier`.
- Use `clearRewardMultiplier` only for stage clear rewards if needed.
- `bossMonsterId` must reference a monster whose role is `boss`.

## 6. StageClearRewardData (스테이지 클리어 보상 데이터)

File (파일): `data/rewards.json`

Current type name in code (현재 코드 타입명): `RewardData`

```ts
interface StageClearRewardData {
  id: string;
  exp: number;
  gold: number;
  items: RewardItemData[];
}
```

This data is used for stage clear rewards. Monster kill rewards are calculated by `RewardResolver (보상 계산기)`.

## 7. ItemData (아이템 데이터)

File (파일): `data/items.json`

```ts
interface ItemData {
  id: string;
  name: string;
  type: "material" | "equipment";
  rarity: "common" | "advanced" | "rare";
  equipment?: EquipmentData;
}

interface EquipmentData {
  slot: "weapon" | "armor" | "accessory";
  stats: EquipmentStatBonus;
}

interface EquipmentStatBonus {
  maxHp: number;
  attack: number;
  defense: number;
}
```

MVP 1 장비 스탯은 고정값이며 음수를 허용하지 않는다.

## 8. ResolvedReward (계산 완료 보상)

Runtime type (런타임 타입):

```ts
interface ResolvedReward {
  exp: number;
  gold: number;
  items: RewardItemData[];
}
```

`ResolvedReward (계산 완료 보상)`는 `RewardResolver (보상 계산기)`가 만든 최종 보상이며, `RewardSystem (보상 적용 시스템)`이 플레이어와 인벤토리에 적용한다.

## 9. PlayerState (플레이어 상태)

Runtime/save type (런타임/저장 타입):

```ts
interface PlayerState {
  level: number;
  exp: number;
  totalExp: number;
  gold: number;
  maxHp: number;
  hp: number;
  attack: number;
  defense: number;
}
```

Experience rules (경험치 규칙):

```text
exp = 현재 레벨에서 다음 레벨까지의 진행 경험치
totalExp = 지금까지 누적 획득한 전체 경험치
requiredExp = 저장하지 않고 PlayerGrowthSystem 공식으로 계산하는 파생값
```

기존 저장 데이터에는 `totalExp`가 없을 수 있으므로 `GameScene (게임 씬)`에서 fallback/migration (fallback/마이그레이션)을 처리한다.

## 10. EquipmentState (장착 상태)

Runtime/save type (런타임/저장 타입):

```ts
interface EquipmentState {
  equipped: Partial<Record<"weapon" | "armor" | "accessory", string>>;
}
```

기존 저장 데이터에는 `equipment`가 없을 수 있으므로 아래 fallback을 사용한다.

```ts
equipment: saved?.equipment ?? { equipped: {} }
```

## 11. EffectivePlayerStats (최종 플레이어 스탯)

Runtime type (런타임 타입):

```ts
interface EffectivePlayerStats {
  maxHp: number;
  attack: number;
  defense: number;
}
```

`EffectivePlayerStats (최종 플레이어 스탯)`는 `PlayerState (기본 성장 스탯)`와 `EquipmentState (장착 상태)`의 장비 보너스를 합산한 전투용 파생값이다.

## 12. GrowthResult (성장 결과)

Runtime type (런타임 타입):

```ts
interface GrowthResult {
  gainedExp: number;
  totalExp: number;
  levelBefore: number;
  levelAfter: number;
  levelsGained: number;
  expBefore: number;
  expAfter: number;
  requiredExpBefore: number;
  requiredExpAfter: number;
  statGain: {
    maxHp: number;
    attack: number;
    defense: number;
  };
}
```

## 13. Validation Rules (검증 규칙)

`DataLoader (데이터 로더)` must throw clear errors for:

- Missing monsterId (없는 몬스터 ID)
- Missing monsterPoolId (없는 몬스터 풀 ID)
- Missing dropTableId (없는 드랍 테이블 ID)
- Missing itemId (없는 아이템 ID)
- Leader pool contains non-leader monster (리더 풀에 리더가 아닌 몬스터 포함)
- Normal pool contains non-normal monster (일반 풀에 일반 몬스터가 아닌 몬스터 포함)
- bossMonsterId points to a non-boss monster (보스 ID가 보스 역할이 아닌 몬스터를 참조)
- Duplicate IDs (중복 ID)
- Equipment item missing equipment data (장비 아이템의 장비 데이터 누락)
- Material item includes equipment data (재료 아이템에 장비 데이터 포함)
- Invalid equipment slot (잘못된 장비 슬롯)
- Negative equipment stats (음수 장비 스탯)

No silent fallback (조용히 무시하는 fallback 금지).
