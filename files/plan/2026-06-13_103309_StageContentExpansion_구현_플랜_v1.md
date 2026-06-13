# Stage Content Expansion 구현 플랜 v1

작성 시각: 2026-06-13 10:33:09

대상 프로젝트: `C:\Users\jmj\Desktop\코덱스 자료\idle-rpg-mvp`

## 0. 목표

`Stage Content Expansion (스테이지 콘텐츠 확장)`의 목표는 현재 구현된 1차 시스템들이 실제 플레이 루프 안에서 잘 맞물리는지 확인할 수 있도록 초반 콘텐츠를 확장하는 것이다.

검증 대상 시스템:

```text
CombatSystem (전투 시스템)
RewardResolver (보상 계산기)
RewardSystem (보상 적용 시스템)
PlayerGrowthSystem (플레이어 성장 시스템)
EquipmentSystem (장비 시스템)
SkillSystem (스킬 시스템)
StageProgressSystem (스테이지 진행 시스템)
MonsterPoolSystem (몬스터 풀 시스템)
DropResolver (드랍 계산기)
```

중요 원칙:

```text
이번 작업은 시스템 리팩토링이 아니라 JSON data (JSON 데이터) 확장 중심이다.
기존 시스템 구조를 뒤집지 않는다.
코드 수정은 필요 최소한의 검증 로직 또는 표시 개선 정도로 제한한다.
```

## 1. 현재 데이터 구조 확인

현재 주요 데이터 파일:

```text
data/stages.json
data/monsters.json
data/monsterPools.json
data/dropTables.json
data/rewards.json
data/items.json
data/skills.json
```

현재 구조:

```text
StageData (스테이지 데이터)
-> normalMonsterPoolId
-> leaderMonsterPoolId
-> optional bossMonsterId
-> requiredNormalKills
-> clearRewardId
-> expMultiplier
-> goldMultiplier
-> dropRateBonus

MonsterData (몬스터 정적 데이터)
-> role: normal | leader | boss
-> maxHp / attack / defense
-> baseExp / baseGold
-> dropTableId

DropTableData (드랍 테이블 데이터)
-> itemId
-> dropRate
-> minAmount
-> maxAmount
```

현재 `StageProgressSystem (스테이지 진행 시스템)`은 stage order array 순서대로 다음 스테이지로 넘어간다. 따라서 `stages.json`의 배열 순서를 order와 일치시키는 것이 중요하다.

## 2. 현재 스테이지 수와 몬스터 수

현재 데이터 기준:

```text
stages: 2
monsters: 7
  normal: 4
  leader: 2
  boss: 1
monsterPools: 4
dropTables: 4
rewards: 2
items: 8
  material: 5
  equipment: 3
```

현재 Stage IDs:

```text
dawn_forest_1
mist_gate_1
```

현재 Monster IDs:

```text
dawn_slime: normal
dawn_mushroom: normal
mist_goblin: normal
mist_bat: normal
dawn_wolf: leader
mist_guardian: leader
sleepy_ogre: boss
```

## 3. MVP 범위

이번 확장 권장 범위:

```text
Stage 1~9
Region (지역) 3개
Monster (몬스터) 총 15종 내외
  normal 9종
  leader 3종
  boss 3종
Equipment (장비) 기존 3종 유지 + 필요 시 보상 연결 강화
Material (재료) 3~6종 추가 가능
```

이번 작업에서 하지 않을 것:

```text
새 전투 공식 추가
스킬 강화 구현
장비 랜덤 옵션 구현
장비 등급 가중치 구현
보스 페이즈 구현
SegmentedMonster 구현
스테이지 자동 연출/맵 전환 구현
```

## 4. 초반 지역/스테이지 구성안

3개 지역, 각 지역 3스테이지로 구성한다.

```text
Region 1: Dawn Forest (새벽 숲)
Stage 1: dawn_forest_1 (새벽 숲 1단계)
Stage 2: dawn_forest_2 (새벽 숲 2단계)
Stage 3: dawn_forest_3 (새벽 숲 3단계, boss)

Region 2: Mist Gate (안개 관문)
Stage 4: mist_gate_1 (안개 관문 1단계)
Stage 5: mist_gate_2 (안개 관문 2단계)
Stage 6: mist_gate_3 (안개 관문 3단계, boss)

Region 3: Old Mine (오래된 광산)
Stage 7: old_mine_1 (오래된 광산 1단계)
Stage 8: old_mine_2 (오래된 광산 2단계)
Stage 9: old_mine_3 (오래된 광산 3단계, boss)
```

스테이지별 흐름:

```text
Stage 1, 2: normal -> leader -> clear
Stage 3: normal -> leader -> boss -> clear
Stage 4, 5: normal -> leader -> clear
Stage 6: normal -> leader -> boss -> clear
Stage 7, 8: normal -> leader -> clear
Stage 9: normal -> leader -> boss -> clear
```

## 5. 추가할 몬스터 목록

기존 몬스터를 일부 유지하고, 총 15종 규모로 확장한다.

### Region 1 - Dawn Forest (새벽 숲)

Normal Monster (일반 몬스터):

```text
dawn_slime (새벽 슬라임) - existing
dawn_mushroom (새벽 버섯병) - existing
dawn_hornet (새벽 말벌) - new
```

Leader Monster (리더 몬스터):

```text
dawn_wolf (새벽 늑대) - existing
```

Boss Monster (보스 몬스터):

```text
dawn_treant (새벽 나무정령) - new
```

### Region 2 - Mist Gate (안개 관문)

Normal Monster (일반 몬스터):

```text
mist_goblin (안개 고블린) - existing
mist_bat (안개 박쥐) - existing
mist_sentinel (안개 파수병) - new
```

Leader Monster (리더 몬스터):

```text
mist_guardian (안개 수문장) - existing
```

Boss Monster (보스 몬스터):

```text
sleepy_ogre (졸린 오우거) - existing
```

### Region 3 - Old Mine (오래된 광산)

Normal Monster (일반 몬스터):

```text
mine_rat (광산 쥐) - new
ore_sprite (광석 정령) - new
rust_crawler (녹슨 굴착벌레) - new
```

Leader Monster (리더 몬스터):

```text
mine_foreman_golem (광산 감독 골렘) - new
```

Boss Monster (보스 몬스터):

```text
ancient_mine_guardian (고대 광산 수호자) - new
```

최종 몬스터 수:

```text
normal 9종
leader 3종
boss 3종
total 15종
```

## 6. 스테이지별 난이도 곡선

기준:

```text
초기 PlayerState:
level 1
maxHp 120
attack 14
defense 3

PlayerGrowth per level:
maxHp +12
attack +3
defense +1

Equipment bonus expected:
weapon attack +4
armor maxHp +20 / defense +2
accessory maxHp +8 / attack +1 / defense +1

Skill:
trainee_slash Lv 1
heavy_training_strike Lv 3
```

난이도 방향:

```text
Stage 1~2: 스킬 없이도 안정적으로 진행 가능
Stage 3: 첫 boss로 장비/레벨업의 의미를 확인
Stage 4~5: heavy_training_strike가 해금되기 시작하는 구간
Stage 6: 장비 2~3개 장착 시 안정적으로 클리어
Stage 7~8: 장비/스킬/레벨업이 모두 의미 있어야 진행
Stage 9: MVP 1 초반 콘텐츠 최종 검증 보스
```

권장 스탯 곡선:

| Stage | Normal HP | Normal ATK | Leader HP | Leader ATK | Boss HP | Boss ATK |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| 1 | 34~42 | 5~6 | 120 | 11 | - | - |
| 2 | 46~58 | 6~8 | 145 | 13 | - | - |
| 3 | 58~72 | 8~10 | 170 | 15 | 260 | 19 |
| 4 | 62~78 | 8~11 | 190 | 16 | - | - |
| 5 | 78~96 | 11~13 | 230 | 18 | - | - |
| 6 | 96~120 | 13~16 | 280 | 21 | 420 | 26 |
| 7 | 115~145 | 15~18 | 330 | 24 | - | - |
| 8 | 145~175 | 18~22 | 390 | 28 | - | - |
| 9 | 175~220 | 22~26 | 470 | 32 | 720 | 38 |

## 7. 스테이지별 경험치/골드/드랍률 배율

권장 `StageData (스테이지 데이터)` 배율:

| Stage | expMultiplier | goldMultiplier | dropRateBonus | requiredNormalKills |
| --- | ---: | ---: | ---: | ---: |
| 1 | 1.00 | 1.00 | 0.00 | 8~10 |
| 2 | 1.10 | 1.08 | 0.03 | 10 |
| 3 | 1.20 | 1.15 | 0.05 | 10 |
| 4 | 1.25 | 1.20 | 0.08 | 10 |
| 5 | 1.35 | 1.30 | 0.10 | 11 |
| 6 | 1.50 | 1.45 | 0.12 | 12 |
| 7 | 1.65 | 1.60 | 0.15 | 12 |
| 8 | 1.85 | 1.80 | 0.18 | 13 |
| 9 | 2.10 | 2.00 | 0.20 | 15 |

원칙:

```text
expMultiplier/goldMultiplier는 처치 보상에만 적용한다.
dropRateBonus는 드랍률에만 적용한다.
clearRewardMultiplier는 이번 단계에서 사용하지 않거나 1로 유지한다.
```

## 8. 장비 드랍과 스테이지 보상의 연결 방식

현재 장비:

```text
rusty_training_sword (낡은 수련검) - weapon
worn_apprentice_armor (수습기사의 낡은 갑옷) - armor
cracked_apprentice_ring (금 간 수습기사 반지) - accessory
```

권장 연결:

```text
Stage 1~2:
normal_forest_drop에서 rusty_training_sword 드랍 유지

Stage 3:
dawn boss/leader drop에서 cracked_apprentice_ring 낮은 확률 제공

Stage 4~5:
normal_mist_drop에서 worn_apprentice_armor 드랍 유지

Stage 6:
boss_drop에서 cracked_apprentice_ring 또는 mist_core 보상 강화

Stage 7~9:
새 dropTable old_mine_drop / old_mine_leader_drop / old_mine_boss_drop 추가
기존 장비 3종의 재획득 가능성을 유지하되, 새 장비 추가는 MVP 1에서는 선택사항
```

Stage clear reward (스테이지 클리어 보상):

```text
Stage 1: trainee_medal
Stage 2: soft_leaf
Stage 3: rusty_training_sword 1개 보장 또는 trainee_medal 강화
Stage 4: mist_shard
Stage 5: mist_core
Stage 6: worn_apprentice_armor 1개 보장 또는 mist_core 강화
Stage 7: 새 재료 old_ore_fragment
Stage 8: 새 재료 old_ore_core
Stage 9: cracked_apprentice_ring 1개 보장 또는 boss material
```

추천:

```text
초반 검증 목적상 장비 1~2개는 스테이지 클리어 보상으로 보장해도 좋다.
드랍 운이 나빠도 EquipmentSystem 검증이 가능해진다.
```

## 9. 스킬이 들어간 상태에서 몬스터 밸런스 기준

스킬 피해 공식:

```ts
skillDamage = Math.max(
  1,
  Math.floor(effectiveStats.attack * skill.damageMultiplier + skill.flatDamage - monster.data.defense)
);
```

초반 예시:

```text
Lv 1 base attack 14
trainee_slash = floor(14 * 1.5 + 2 - defense)
대략 21~22 피해

무기 장착 후 attack 18
trainee_slash = floor(18 * 1.5 + 2 - defense)
대략 27~28 피해
```

밸런스 기준:

```text
Normal Monster (일반 몬스터)
= 기본 공격 + trainee_slash 1~3회 안에 처치되는 수준

Leader Monster (리더 몬스터)
= 스킬/장비가 있으면 빠르게 잡고, 없으면 오래 걸리는 수준

Boss Monster (보스 몬스터)
= Lv 3 heavy_training_strike와 장비 보너스 체감이 있어야 안정적으로 처치되는 수준
```

주의:

```text
몬스터 공격력이 너무 높으면 자동 전투가 체력 리셋 반복처럼 보일 수 있다.
몬스터 HP가 너무 낮으면 SkillSystem 검증 전에 기본 공격만으로 사라질 수 있다.
Stage 3 이후부터는 스킬 발동 로그가 보일 만큼 HP를 약간 높이는 것이 좋다.
```

## 10. 새로 추가/수정할 데이터 파일 목록

수정 중심 파일:

```text
data/stages.json
data/monsters.json
data/monsterPools.json
data/dropTables.json
data/rewards.json
data/items.json
```

선택 수정:

```text
README.md
docs/STAGE_SYSTEM.md
docs/MONSTER_SYSTEM.md
docs/DATA_SCHEMA.md
docs/PROJECT_STATUS.md
docs/REWARD_SYSTEM.md
docs/EQUIPMENT_SYSTEM.md
docs/SKILL_SYSTEM.md
docs/AGENT_HANDOFF.md
```

새 데이터 추가 후보:

```text
old_ore_fragment (오래된 광석 조각)
old_ore_core (오래된 광석 핵)
guardian_stone (수호자의 돌)
```

새 장비는 이번 단계에서 선택사항이다. 시스템 검증 목적만 보면 기존 장비 3종으로 충분하다.

## 11. 코드 수정이 필요한지 여부

기본 결론:

```text
필수 코드 수정은 없다.
```

현재 구조로 가능한 것:

```text
스테이지 9개 추가
몬스터 15종 확장
몬스터 풀 확장
드랍 테이블 확장
스테이지 클리어 보상 확장
```

선택 코드 수정 후보:

```text
Hud stage display spacing improvement (HUD 스테이지 표시 공간 개선)
DataLoader stage order validation 추가
DataLoader duplicate stage order validation 추가
```

추천:

```text
이번 구현은 JSON 데이터 확장을 먼저 하고,
코드 수정은 DataLoader 검증 강화가 꼭 필요하다고 판단될 때만 제한적으로 한다.
```

## 12. DataLoader 검증 추가 필요 여부

현재 이미 검증되는 것:

```text
missing monsterId
missing monsterPoolId
missing dropTableId
missing itemId
monster pool role mismatch
bossMonsterId role mismatch
missing clearRewardId
duplicate id
invalid equipment data
invalid skill data
```

추가하면 좋은 검증:

```text
StageData.order 중복 금지
StageData.order는 1 이상
StageData.requiredNormalKills는 1 이상
StageData.expMultiplier/goldMultiplier는 0보다 큼
StageData.dropRateBonus는 0 이상
Stage 배열이 order 오름차순인지 확인
```

필수 여부:

```text
확인 필요:
데이터 확장만으로 진행할 경우 필수는 아니지만,
Stage 1~9처럼 수가 늘어나면 stage order 검증은 추가하는 편이 안전하다.
```

## 13. 구현 순서

권장 구현 순서:

```text
1. 현재 데이터 백업성 확인
2. data/items.json에 새 재료 2~3종 추가
3. data/dropTables.json에 old_mine 계열 드랍 테이블 추가
4. data/monsters.json을 15종 규모로 확장
5. data/monsterPools.json을 지역별 normal/leader pool로 확장
6. data/rewards.json에 Stage 1~9 clear reward 추가
7. data/stages.json을 Stage 1~9로 확장
8. npm.cmd run typecheck
9. npm.cmd run build
10. 수동 플레이 검증
11. README/docs/AGENT_HANDOFF 갱신
12. Walkthrough 저장
13. 커밋/푸시
```

주의:

```text
stages.json의 배열 순서와 order 값을 일치시킨다.
기존 저장 데이터가 old currentStageId를 참조할 수 있으므로 기존 stage id는 가능하면 유지한다.
```

## 14. 검증 방법

명령 검증:

```powershell
npm.cmd run typecheck
npm.cmd run build
```

검색 검증:

```powershell
rg "rewardMultiplier" data src docs README.md
rg "\"exp\"" data/monsters.json
rg "\"gold\"" data/monsters.json
rg "bossMonsterId" data/stages.json
rg "old_mine" data
```

데이터 검증:

```text
모든 stage.normalMonsterPoolId가 존재하는지
모든 stage.leaderMonsterPoolId가 존재하는지
모든 bossMonsterId가 role boss인지
모든 monster.dropTableId가 존재하는지
모든 dropTable entry itemId가 존재하는지
모든 clearRewardId가 존재하는지
```

수동 플레이 검증:

```text
Stage 1에서 normal 8~10마리 처치 후 leader 등장
Stage 3에서 boss 등장
Stage 4 진입 후 mist 계열 몬스터 등장
Stage 7 진입 후 old mine 계열 몬스터 등장
장비 드랍 또는 클리어 보상으로 EquipmentSystem이 동작
Lv 3 이후 heavy_training_strike 발동
스킬 처치 시 보상이 1번만 지급
Stage 9 boss까지 진행 가능
저장/불러오기 후 currentStageId 유지
```

## 15. 예상 리스크

### Risk 1. 기존 save data와 stage id 충돌

기존 저장 데이터가 `dawn_forest_1` 또는 `mist_gate_1`을 저장하고 있을 수 있다.

대응:

```text
기존 stage id는 유지한다.
mist_gate_1은 Stage 4로 이동하더라도 id 자체는 유지한다.
```

### Risk 2. 난이도 급상승

스킬과 장비를 기준으로 몬스터 HP/ATK를 올리면 장비 드랍이 늦은 플레이에서 막힐 수 있다.

대응:

```text
Stage 3 또는 Stage 6 클리어 보상으로 핵심 장비를 보장한다.
초반 몬스터 공격력은 천천히 올린다.
```

### Risk 3. 콘텐츠만 늘렸는데 HUD가 복잡해짐

스테이지명, 몬스터명, 로그가 길어질 수 있다.

대응:

```text
이번 작업에서는 텍스트 길이만 주의하고,
HUD 리디자인은 별도 작업으로 분리한다.
```

### Risk 4. 보스가 너무 빨리 죽음

SkillSystem 추가로 보스 HP가 낮으면 보스 검증이 짧게 끝날 수 있다.

대응:

```text
Stage 3 이후 보스 HP는 최소 260 이상,
Stage 6 보스 HP는 420 이상,
Stage 9 보스 HP는 720 전후로 설정한다.
```

### Risk 5. DataLoader 검증 부족

Stage order 중복이나 정렬 오류는 현재 검증이 약하다.

대응:

```text
구현 승인 시 stage order validation을 제한적으로 추가하는 것을 추천한다.
```

## 최종 추천 방향

이번 확장은 아래 방향이 가장 안전하다.

```text
Stage 1~9 확장
+ Region 3개
+ Monster 15종
+ 기존 장비 3종을 드랍/클리어 보상에 재배치
+ 새 재료 2~3종 추가
+ 코드 수정은 DataLoader stage order validation 정도로 제한
```

승인 후 구현 시 우선순위:

```text
1. JSON data expansion
2. DataLoader stage order validation
3. docs update
4. typecheck/build
5. Walkthrough
6. commit/push
```
