# 2026-06-13 13:45:21 - Balance Patch 1 Analysis Plan v1

## Status Note (상태 기록)

`Electron Preview Integration (Electron 게임 미리보기 연동)`은 기술 구현과 GitHub push까지 완료된 것으로 처리한다.

다만 아래 항목은 사용자가 직접 시각 확인하지 않았으므로 `Manual Visual Verification Deferred (수동 시각 검증 보류)` 상태로 기록한다.

- Electron 창 안에서 5173 / 5174 / 5175 버튼 실제 클릭 동작
- iframe 안 게임 화면 표시 여부
- Phaser 화면 스케일 정상 여부
- 마우스/키보드 포커스 정상 여부
- dev server를 끈 상태에서 안내 문구가 충분히 보이는지

위 항목은 추후 `UI / Image / Animation / Effect (UI / 이미지 / 애니메이션 / 이펙트)` 작업 단계에서 다시 확인한다.

---

## Scope (범위)

이번 작업은 `Balance Patch 1 (밸런스 패치 1)`의 분석 플랜이다.

아직 구현하지 않는다.

금지 사항:

- `CombatSystem (전투 시스템)` 구조 변경 금지
- `RewardSystem (보상 적용 시스템)` 구조 변경 금지
- `PlayerGrowthSystem (플레이어 성장 시스템)` 구조 변경 금지
- `EquipmentSystem (장비 시스템)` 구조 변경 금지
- `SkillSystem (스킬 시스템)` 구조 변경 금지
- `StageProgressSystem (스테이지 진행 시스템)` 구조 변경 금지
- 코드 수정 금지

수정이 필요할 경우 후보는 우선 `data/*.json` 중심으로 제한한다.

---

## Data Files To Analyze (분석 대상 데이터 파일)

- `data/stages.json`
- `data/monsters.json`
- `data/monsterPools.json`
- `data/dropTables.json`
- `data/rewards.json`
- `data/items.json`
- `data/skills.json`

Node JSON parse 기준으로 위 파일들은 모두 정상 파싱된다.

주의:

PowerShell 콘솔에서는 일부 Korean display text (한글 표시 문자열)이 깨져 보일 수 있다. 현재 분석 기준으로는 `Node JSON.parse (Node JSON 파서)`가 정상 통과했으므로 데이터 파일 자체는 유효한 JSON으로 본다.

---

## 1. Current Stage 1-9 Balance Structure (현재 Stage 1~9 밸런스 구조 요약)

현재 Stage (스테이지)는 3개 Region (지역), 9개 Stage (스테이지)로 구성되어 있다.

```text
Region 1: Dawn Forest (새벽 숲)
- dawn_forest_1
- dawn_forest_2
- dawn_forest_3 boss

Region 2: Mist Gate (안개 관문)
- mist_gate_1
- mist_gate_2
- mist_gate_3 boss

Region 3: Old Mine (오래된 광산)
- old_mine_1
- old_mine_2
- old_mine_3 boss
```

Stage progression values (스테이지 진행 수치):

| Stage | requiredNormalKills | expMultiplier | goldMultiplier | dropRateBonus | Boss |
|---|---:|---:|---:|---:|---|
| dawn_forest_1 | 8 | 1.00 | 1.00 | 0.00 | none |
| dawn_forest_2 | 10 | 1.10 | 1.08 | 0.03 | none |
| dawn_forest_3 | 10 | 1.20 | 1.15 | 0.05 | dawn_treant |
| mist_gate_1 | 10 | 1.25 | 1.20 | 0.08 | none |
| mist_gate_2 | 11 | 1.35 | 1.30 | 0.10 | none |
| mist_gate_3 | 12 | 1.50 | 1.45 | 0.12 | sleepy_ogre |
| old_mine_1 | 12 | 1.65 | 1.60 | 0.15 | none |
| old_mine_2 | 13 | 1.85 | 1.80 | 0.18 | none |
| old_mine_3 | 15 | 2.10 | 2.00 | 0.20 | ancient_mine_guardian |

Expected reward flow (예상 보상 흐름) based on weighted monster pools:

| Stage | Expected Exp | Expected Gold | Estimated Level After Clear | Avg Normal HP | Leader HP | Boss HP |
|---|---:|---:|---|---:|---:|---:|
| dawn_forest_1 | 110 | 98 | Lv2, 70/100 EXP | 50.3 | 165 | - |
| dawn_forest_2 | 148 | 130 | Lv3, 118/187 EXP | 50.3 | 165 | - |
| dawn_forest_3 | 299 | 276 | Lv4, 230/312 EXP | 50.3 | 165 | 260 |
| mist_gate_1 | 265 | 234 | Lv5, 183/488 EXP | 83.2 | 280 | - |
| mist_gate_2 | 319 | 288 | Lv6, 14/732 EXP | 83.2 | 280 | - |
| mist_gate_3 | 630 | 574 | Lv6, 644/732 EXP | 83.2 | 280 | 420 |
| old_mine_1 | 670 | 582 | Lv7, 582/1068 EXP | 152.8 | 470 | - |
| old_mine_2 | 800 | 711 | Lv8, 314/1525 EXP | 152.8 | 470 | - |
| old_mine_3 | 1585 | 1445 | Lv9, 374/2145 EXP | 152.8 | 470 | 720 |

Initial read:

- Stage 1~3 level-up speed is fast enough to unlock `heavy_training_strike (묵직한 수련 일격)` before or around the first boss region.
- Stage 6 clear reaches near Lv7 but not fully, which may be acceptable for pacing.
- Stage 9 clear reaches Lv9 early, giving room for MVP 2 systems such as `SkillUpgradeSystem (스킬 강화 시스템)` or `RebirthSystem (환생 시스템)`.

---

## 2. Monster HP / Attack / Defense Curve Review (몬스터 HP / 공격력 / 방어력 성장 곡선 검토)

Normal Monster (일반 몬스터):

| Region | HP Range | Attack Range | Defense Range |
|---|---:|---:|---:|
| Dawn Forest | 42 ~ 66 | 5 ~ 8 | 1 ~ 2 |
| Mist Gate | 74 ~ 102 | 10 ~ 13 | 2 ~ 4 |
| Old Mine | 128 ~ 188 | 16 ~ 23 | 4 ~ 7 |

Leader Monster (리더 몬스터):

| Monster | HP | Attack | Defense |
|---|---:|---:|---:|
| dawn_wolf | 165 | 14 | 4 |
| mist_guardian | 280 | 21 | 6 |
| mine_foreman_golem | 470 | 32 | 10 |

Boss Monster (보스 몬스터):

| Monster | HP | Attack | Defense |
|---|---:|---:|---:|
| dawn_treant | 260 | 19 | 6 |
| sleepy_ogre | 420 | 26 | 8 |
| ancient_mine_guardian | 720 | 38 | 13 |

Review points:

- HP curve increases clearly by region.
- Attack curve jumps most noticeably from `mist_gate` to `old_mine`.
- `ancient_mine_guardian (고대 광산 수호자)` has high enough HP to show multiple skill cycles.
- Need manual check for `old_mine_2 -> old_mine_3` pacing because normal HP and boss HP both rise sharply.

---

## 3. PlayerGrowthSystem Leveling Speed Review (PlayerGrowthSystem 기준 레벨업 속도 검토)

Current formula:

```ts
requiredExp = Math.floor(40 * level * 1.25 ** (level - 1));
```

Per level stat gain:

```text
maxHp +12
attack +3
defense +1
```

Estimated level milestones:

- Stage 1 clear: Lv2
- Stage 2 clear: Lv3
- Stage 3 clear: Lv4
- Stage 5 clear: Lv6
- Stage 7 clear: Lv7
- Stage 8 clear: Lv8
- Stage 9 clear: Lv9

Review points:

- Lv3 requirement for `heavy_training_strike (묵직한 수련 일격)` is reached early enough.
- Growth speed is generous for MVP manual testing.
- If Stage 1~3 feels too fast, reduce clear reward EXP before changing monster EXP.
- If Stage 7~9 feels too slow, adjust monster baseExp or stage expMultiplier rather than changing growth formula.

---

## 4. Stage Clear Reward Review (Stage clear reward 보상량 검토)

Clear reward EXP / Gold:

| Stage | Exp | Gold | Guaranteed Item |
|---|---:|---:|---|
| dawn_forest_1 | 40 | 50 | trainee_medal x1 |
| dawn_forest_2 | 55 | 65 | soft_leaf x2 |
| dawn_forest_3 | 85 | 100 | rusty_training_sword x1 |
| mist_gate_1 | 70 | 90 | mist_shard x2 |
| mist_gate_2 | 95 | 120 | mist_core x1 |
| mist_gate_3 | 135 | 160 | worn_apprentice_armor x1 |
| old_mine_1 | 130 | 170 | old_ore_fragment x2 |
| old_mine_2 | 170 | 220 | old_ore_core x1 |
| old_mine_3 | 240 | 320 | cracked_apprentice_ring x1, guardian_stone x1 |

Review points:

- Guaranteed equipment timing is well placed:
  - Stage 3: weapon
  - Stage 6: armor
  - Stage 9: accessory
- Stage 4 clear EXP is lower than Stage 3 clear EXP, but total stage reward remains acceptable because monster rewards contribute.
- Stage 7 clear EXP is lower than Stage 6 boss stage clear EXP, but non-boss transition stages can be lighter.

Potential adjustment candidates:

- If Stage 4 feels underwhelming after first boss, raise `mist_gate_1_clear.exp` slightly.
- If Stage 7 feels flat after armor acquisition, raise `old_mine_1_clear.exp` or `old_mine_1_clear.gold` slightly.

---

## 5. DropTable Item Drop Rate Review (DropTable 아이템 드랍률 검토)

Current equipment drop rates:

| Drop Table | Equipment Item | Drop Rate |
|---|---|---:|
| normal_forest_drop | rusty_training_sword | 0.03 |
| dawn_leader_drop | cracked_apprentice_ring | 0.02 |
| dawn_boss_drop | rusty_training_sword | 0.08 |
| dawn_boss_drop | cracked_apprentice_ring | 0.04 |
| normal_mist_drop | worn_apprentice_armor | 0.025 |
| mist_leader_drop | cracked_apprentice_ring | 0.04 |
| mist_boss_drop | worn_apprentice_armor | 0.08 |
| mist_boss_drop | cracked_apprentice_ring | 0.05 |
| old_mine_drop | guardian_stone | 0.025 |
| old_mine_drop | worn_apprentice_armor | 0.02 |
| old_mine_leader_drop | guardian_stone | 0.05 |
| old_mine_leader_drop | cracked_apprentice_ring | 0.04 |
| old_mine_boss_drop | cracked_apprentice_ring | 0.10 |
| old_mine_boss_drop | worn_apprentice_armor | 0.08 |

Review points:

- Drop rates are low enough that guaranteed clear rewards are important.
- `dropRateBonus (드랍률 보너스)` reaches 0.20 by Stage 9, so final rates remain controlled:

```text
finalDropRate = min(1, baseDropRate * (1 + dropRateBonus))
```

- Example: old_mine_boss cracked ring 0.10 with 0.20 bonus becomes 0.12.

Potential adjustment candidates:

- If equipment testing feels too random, do not raise normal drop rates first.
- Prefer guaranteed clear rewards or one-time tutorial-like rewards for MVP testing.

---

## 6. Guaranteed Equipment Timing Review (보장 장비 보상 타이밍 검토)

Current guaranteed equipment:

```text
Stage 3 clear -> rusty_training_sword (weapon, attack +4)
Stage 6 clear -> worn_apprentice_armor (armor, maxHp +20, defense +2)
Stage 9 clear -> cracked_apprentice_ring (accessory, maxHp +8, attack +1, defense +1)
```

Review points:

- Stage 3 weapon arrives before Mist Gate, improving basic attack and skill damage.
- Stage 6 armor arrives before Old Mine, improving survival.
- Stage 9 accessory arrives at MVP endpoint and validates accessory slot.

Potential issue:

- If auto-equip is not present, the player may own equipment but not benefit unless manually equipped through current UI/control path.
- Balance test should record `owned` and `equipped` separately.

---

## 7. Skill Damage / Cooldown Feel Review (Skill damage / cooldown 체감 검토)

Current skills:

| Skill | Required Level | Cooldown | Formula |
|---|---:|---:|---|
| trainee_slash | 1 | 2500ms | attack * 1.5 + 2 - monster.defense |
| heavy_training_strike | 3 | 6000ms | attack * 2.4 + 5 - monster.defense |

Sample skill damage with expected equipment:

| Sample | Effective Attack | Skill | Damage | Boss HP |
|---|---:|---|---:|---:|
| Stage 3 boss | 27 | trainee_slash | 36 | 260 |
| Stage 3 boss | 27 | heavy_training_strike | 63 | 260 |
| Stage 6 boss | 33 | trainee_slash | 43 | 420 |
| Stage 6 boss | 33 | heavy_training_strike | 76 | 420 |
| Stage 9 boss | 43 | trainee_slash | 53 | 720 |
| Stage 9 boss | 43 | heavy_training_strike | 95 | 720 |

Review points:

- Skill damage is meaningful but not instant-kill.
- Heavy skill should visibly matter on bosses.
- Stage 3 boss may die fast if basic attacks plus both skills align; manual playtest should check whether skill cycles are visible enough.

Potential adjustment candidates:

- If skills feel too frequent, increase `trainee_slash.cooldownMs` from 2500 to 3000.
- If heavy skill feels too strong early, reduce `heavy_training_strike.damageMultiplier` from 2.4 to 2.2.
- If Stage 9 feels too slow, avoid changing skill first; check boss HP and Old Mine attack pressure.

---

## 8. Boss Difficulty Review (Boss 난이도 검토)

Boss targets:

| Stage | Boss | HP | Attack | Defense | Intended Role |
|---|---|---:|---:|---:|---|
| Stage 3 | dawn_treant | 260 | 19 | 6 | first boss check |
| Stage 6 | sleepy_ogre | 420 | 26 | 8 | armor reward gate |
| Stage 9 | ancient_mine_guardian | 720 | 38 | 13 | MVP 1 final boss |

Review points:

- Stage 3 boss has enough HP for 2~4 skill events if combat lasts long enough.
- Stage 6 boss should test armor value after clear, but armor is rewarded after the boss, not before it.
- Stage 9 boss attack may be the main survival check.

Potential adjustment candidates:

- If Stage 6 boss is too hard before armor, lower `sleepy_ogre.attack` or `sleepy_ogre.hp` slightly.
- If Stage 9 boss is too slow, lower `ancient_mine_guardian.maxHp` before changing reward/growth systems.
- If Stage 9 boss kills player too often, lower `ancient_mine_guardian.attack` or increase Stage 8 clear reward.

---

## 9. First 10 Minutes Expected Flow (초반 10분 플레이 기준 예상 흐름)

Expected flow:

```text
Stage 1
-> quick Lv2
-> basic loop confirmation

Stage 2
-> Lv3 reached
-> heavy_training_strike becomes available

Stage 3
-> first boss
-> rusty_training_sword guaranteed
-> attack and skill damage increase after equip

Stage 4~5
-> skill impact should be visible
-> Mist Gate monsters test increased damage intake

Stage 6
-> second boss
-> worn_apprentice_armor guaranteed

Stage 7~8
-> Old Mine durability check
-> armor should noticeably help

Stage 9
-> final MVP boss
-> accessory and guardian material guaranteed
```

Manual feel labels to record:

```text
too easy
good
too hard
too slow
```

---

## 10. Data File Adjustment Candidates (수정 필요 시 data 파일별 수정 후보)

No implementation yet. Candidate-only list:

### `data/stages.json`

Possible adjustments:

- `requiredNormalKills`
- `expMultiplier`
- `goldMultiplier`
- `dropRateBonus`

Use when:

- 전체 스테이지 속도가 너무 빠르거나 느릴 때
- 특정 지역 전환이 갑자기 튈 때

### `data/monsters.json`

Possible adjustments:

- `maxHp`
- `attack`
- `defense`
- `baseExp`
- `baseGold`

Use when:

- 특정 몬스터/보스가 너무 빨리 죽거나 너무 오래 걸릴 때
- 특정 구간에서 플레이어 HP가 과하게 흔들릴 때

### `data/rewards.json`

Possible adjustments:

- clear reward `exp`
- clear reward `gold`
- guaranteed item quantity

Use when:

- 레벨업 타이밍이 어긋날 때
- 장비 보장 타이밍을 유지하면서 성장 속도만 바꾸고 싶을 때

### `data/dropTables.json`

Possible adjustments:

- `dropRate`
- `minAmount`
- `maxAmount`

Use when:

- 반복 파밍 보상이 너무 비거나 너무 많이 쌓일 때

### `data/items.json`

Possible adjustments:

- equipment fixed stats

Use when:

- 장비 장착 체감이 약하거나 과할 때

### `data/skills.json`

Possible adjustments:

- `cooldownMs`
- `damageMultiplier`
- `flatDamage`
- `requiredLevel`

Use when:

- 스킬 체감이 너무 약하거나 강할 때

---

## 11. User Approval Required Before Implementation (구현 전 사용자 승인 필요 항목)

Balance Patch 1 implementation requires user approval for:

- Stage difficulty changes (스테이지 난이도 변경)
- Monster stat changes (몬스터 스탯 변경)
- Reward amount changes (보상량 변경)
- Drop rate changes (드랍률 변경)
- Equipment stat changes (장비 스탯 변경)
- Skill cooldown/damage changes (스킬 쿨타임/피해 변경)
- Korean display text recovery in data files (데이터 표시 문자열 한글 복구)

Especially important:

```text
Do not change systems.
Change data first.
```

---

## 12. Validation Method (검증 방법)

Before implementation:

```powershell
git status --short
git diff -- src/systems src/scenes/GameScene.ts src/ui/Hud.ts data
node -e "JSON.parse(require('fs').readFileSync('data/stages.json','utf8'))"
```

After any approved data patch:

```powershell
npm.cmd run typecheck
npm.cmd run build
```

Search validation:

```powershell
rg "rewardMultiplier" data src docs README.md
rg "\"exp\"" data/monsters.json
rg "\"gold\"" data/monsters.json
rg "bossMonsterId" data/stages.json
rg "old_mine" data
```

Manual playtest validation:

```text
Stage ID:
Player Level at clear:
Main equipment owned:
Main equipment equipped:
Clear feeling:
Issue:
Suggested adjustment:
```

---

## 13. Expected Risks (예상 리스크)

1. Manual Visual Verification Deferred (수동 시각 검증 보류)
   - Electron 내부 화면은 아직 사용자가 직접 확인하지 않았다.
   - Balance analysis should not assume Electron preview is visually perfect.

2. Korean Display Encoding (한글 표시 인코딩)
   - PowerShell 출력에서는 일부 `name` 값이 깨져 보인다.
   - Node JSON parse는 정상이다.
   - 실제 브라우저 UI에서 깨져 보이면 별도 `Korean Data Text Fix (데이터 한글 표시 수정)`가 필요하다.

3. Auto Equip Assumption (자동 장착 가정 위험)
   - 보장 장비를 획득해도 실제 장착 여부에 따라 체감이 달라진다.
   - 테스트 기록에서 owned/equipped를 분리해야 한다.

4. Skill Kill Timing (스킬 처치 타이밍)
   - 스킬로 처치한 tick에서 보상 중복 지급이 없는지는 시스템상 설계되어 있으나, 수동 로그 확인이 필요하다.

5. Stage 9 Time-To-Kill (Stage 9 처치 시간)
   - Final boss HP 720은 스킬 체감에는 좋지만 너무 느릴 수 있다.

6. Gold Sink Missing (골드 소비처 부재)
   - 현재 골드는 쌓이기만 할 수 있다.
   - Balance Patch 1에서는 gold sink를 구현하지 않는다.

---

## Recommended Analysis Order (추천 분석 순서)

1. `DataValidityCheck (데이터 유효성 점검)`
2. `StageRewardSimulation (스테이지 보상 시뮬레이션)`
3. `LevelMilestoneCheck (레벨 도달 시점 확인)`
4. `EquipmentTimingCheck (장비 획득/장착 타이밍 확인)`
5. `SkillDamageCheck (스킬 피해 체감 확인)`
6. `BossTimeToKillCheck (보스 처치 시간 확인)`
7. `ManualPlaytestSheet (수동 플레이 기록표)` 작성
8. 사용자 승인 후 `data/*.json` 중심으로 최소 수정

