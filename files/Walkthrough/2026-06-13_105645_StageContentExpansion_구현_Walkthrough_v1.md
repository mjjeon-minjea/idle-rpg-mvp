# Stage Content Expansion 구현 Walkthrough v1

작성 시각: 2026-06-13 10:56:45

대상 프로젝트: `C:\Users\jmj\Desktop\코덱스 자료\idle-rpg-mvp`

## 구현 요약

`Stage Content Expansion (스테이지 콘텐츠 확장)`을 JSON data expansion (JSON 데이터 확장) 중심으로 구현했다.

이번 작업은 시스템 대규모 리팩토링 없이 아래 시스템들이 실제 초반 콘텐츠 안에서 맞물리는지 검증할 수 있도록 구성했다.

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

## 수정 파일

```text
README.md
data/dropTables.json
data/items.json
data/monsterPools.json
data/monsters.json
data/rewards.json
data/stages.json
docs/AGENT_HANDOFF.md
docs/DATA_SCHEMA.md
docs/EQUIPMENT_SYSTEM.md
docs/MONSTER_SYSTEM.md
docs/PROJECT_STATUS.md
docs/REWARD_SYSTEM.md
docs/SAVE_SYSTEM.md
docs/SKILL_SYSTEM.md
docs/STAGE_SYSTEM.md
src/loaders/DataLoader.ts
src/types/GameTypes.ts
files/Walkthrough/2026-06-13_105645_StageContentExpansion_구현_Walkthrough_v1.md
```

## 추가된 Stage 목록

총 9개 스테이지로 확장했다.

```text
1. dawn_forest_1 (새벽 숲 1단계)
2. dawn_forest_2 (새벽 숲 2단계)
3. dawn_forest_3 (새벽 숲 3단계, boss: dawn_treant)
4. mist_gate_1 (안개 관문 1단계)
5. mist_gate_2 (안개 관문 2단계)
6. mist_gate_3 (안개 관문 3단계, boss: sleepy_ogre)
7. old_mine_1 (오래된 광산 1단계)
8. old_mine_2 (오래된 광산 2단계)
9. old_mine_3 (오래된 광산 3단계, boss: ancient_mine_guardian)
```

`requiredNormalKills (필요 일반 몬스터 처치 수)`는 모두 실제 숫자로 확정했다.

```text
Stage 1: 8
Stage 2: 10
Stage 3: 10
Stage 4: 10
Stage 5: 11
Stage 6: 12
Stage 7: 12
Stage 8: 13
Stage 9: 15
```

## 추가된 Monster 목록

총 15종 몬스터로 확장했다.

Normal Monster (일반 몬스터) 9종:

```text
dawn_slime
dawn_mushroom
dawn_hornet
mist_goblin
mist_bat
mist_sentinel
mine_rat
ore_sprite
rust_crawler
```

Leader Monster (리더 몬스터) 3종:

```text
dawn_wolf
mist_guardian
mine_foreman_golem
```

Boss Monster (보스 몬스터) 3종:

```text
dawn_treant: 260 HP
sleepy_ogre: 420 HP
ancient_mine_guardian: 720 HP
```

모든 몬스터는 `baseExp (기본 경험치)`와 `baseGold (기본 골드)`를 명확한 숫자로 가진다.

## 추가된 Item/Material 목록

새 material (재료) 3종을 추가했다.

```text
old_ore_fragment (오래된 광석 조각)
old_ore_core (오래된 광석 핵)
guardian_stone (수호자의 돌)
```

기존 MVP 장비 3종은 유지했다.

```text
rusty_training_sword
worn_apprentice_armor
cracked_apprentice_ring
```

## 추가/수정된 DropTable 목록

총 9개 드랍 테이블을 구성했다.

```text
normal_forest_drop
dawn_leader_drop
dawn_boss_drop
normal_mist_drop
mist_leader_drop
mist_boss_drop
old_mine_drop
old_mine_leader_drop
old_mine_boss_drop
```

모든 드랍률은 실제 숫자로 확정했다.

예시:

```text
rusty_training_sword: 0.03 / 0.08
worn_apprentice_armor: 0.025 / 0.08
cracked_apprentice_ring: 0.02~0.10
old_ore_fragment: 0.25 / 0.45
old_ore_core: 0.10~0.35
guardian_stone: 0.025~0.35
```

## Stage Reward 구성

총 9개 스테이지 클리어 보상을 구성했다.

장비 보장 보상:

```text
Stage 3 dawn_forest_3_clear -> rusty_training_sword
Stage 6 mist_gate_3_clear -> worn_apprentice_armor
Stage 9 old_mine_3_clear -> cracked_apprentice_ring + guardian_stone
```

이렇게 해서 드랍 운이 나빠도 `EquipmentSystem (장비 시스템)` 검증이 가능하다.

## Stage Order Validation

`DataLoader (데이터 로더)`에 StageData 검증을 추가했다.

검증 항목:

```text
StageData.order 중복 금지
StageData.order는 1 이상
StageData.requiredNormalKills는 1 이상
StageData.expMultiplier > 0
StageData.goldMultiplier > 0
StageData.dropRateBonus >= 0
stages 배열은 order 오름차순이어야 함
```

잘못된 데이터는 명확한 Error를 낸다.

## 밸런스 기준

이번 밸런스는 아래 기준으로 잡았다.

```text
Stage 1~2: 기본 공격 + trainee_slash로 안정 진행
Stage 3: 첫 보스와 장비 보장
Stage 4~5: Lv 3 이후 heavy_training_strike 체감
Stage 6: armor 보장과 중간 보스 검증
Stage 7~8: 장비/스킬/레벨 성장이 모두 필요한 광산 구간
Stage 9: MVP 1 초반 콘텐츠 최종 보스 검증
```

보스 HP 기준:

```text
Stage 3 boss: 260 HP
Stage 6 boss: 420 HP
Stage 9 boss: 720 HP
```

## Save 관련 주의사항

MVP 개발 중 스테이지 데이터 확장으로 기존 localStorage 저장 데이터가 현재 스테이지 위치와 어긋날 수 있다.

예:

```text
기존 mist_gate_1 저장 데이터는 확장 후 order 4 스테이지를 가리킨다.
```

필요 시 브라우저 콘솔에서 아래 명령으로 저장 데이터를 초기화한다.

```js
localStorage.removeItem("idle-rpg-mvp-save");
location.reload();
```

이 내용은 README, docs/SAVE_SYSTEM.md, docs/PROJECT_STATUS.md에 반영했다.

## 검증 결과

명령 검증:

```text
npm.cmd run typecheck: PASS
npm.cmd run build: PASS with elevated permission
```

참고:

```text
일반 sandbox build는 기존과 같은 Access is denied 문제로 실패했다.
권한 상승 후 build는 성공했다.
Vite chunk size warning은 남아 있으나 build failure는 아니다.
```

검색 검증:

```text
rg "rewardMultiplier" data src docs README.md
-> no matches

rg '"exp"' data/monsters.json
-> no matches

rg '"gold"' data/monsters.json
-> no matches

rg "bossMonsterId" data/stages.json
-> dawn_treant / sleepy_ogre / ancient_mine_guardian 확인

rg "old_mine" data
-> stages / monsters / monsterPools / dropTables / rewards 연결 확인
```

데이터 참조 무결성 스크립트:

```text
ok: true
stages: 9
monsters: 15
normal: 9
leader: 3
boss: 3
pools: 6
drops: 9
rewards: 9
items: 11
```

## 남은 TODO

```text
수동 플레이로 Stage 1~9 진행 확인
스테이지별 체감 난이도 조정
HUD 긴 텍스트 레이아웃 점검
Stage 9 이후 콘텐츠 설계
Skill Upgrade (스킬 강화) 설계
Electron game preview integration (Electron 게임 미리보기 연동)
```

## 다음 추천 작업

추천 순서:

```text
1. 직접 플레이로 Stage 1~9 밸런스 확인
2. 필요하면 몬스터 HP/ATK/baseExp/baseGold 미세 조정
3. Electron game preview integration
4. Skill Upgrade plan
```
