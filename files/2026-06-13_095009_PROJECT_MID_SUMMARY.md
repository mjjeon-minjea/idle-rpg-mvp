# 중간 정리 - Idle RPG MVP

작성 시각: 2026-06-13 09:50:09

대상 프로젝트: `C:\Users\jmj\Desktop\코덱스 자료\idle-rpg-mvp`

## 1. 현재 상태 요약

이 프로젝트는 Phaser 3 + TypeScript + Vite 기반의 local idle RPG (로컬 기반 방치형 RPG) MVP이다.

게임 제목은 아래로 정했다.

```text
피곤해서 잠들었는데 일어나 보니 환생해서 어쩌다 수습기사 되어 이세계를 무쌍한다
```

현재 목표는 Trainee Knight (수습기사)로 시작해 Auto Combat (자동 전투), Reward (보상), Player Growth (플레이어 성장), Equipment Farming (장비 파밍), Stage Progress (스테이지 진행)를 반복하면서 점점 강해지는 이세계 무쌍형 방치 RPG를 만드는 것이다.

현재 Git 상태 기준 주요 커밋은 아래와 같다.

```text
2a4b63f Add equipment system
8295c64 Add player growth system
c15797f Initial idle RPG MVP scaffold
```

`2a4b63f Add equipment system`까지 GitHub `origin/main`에 push 완료된 상태다.

## 2. 지금까지 완료한 일

## 2.1 Project Scaffold (프로젝트 뼈대)

Implemented (구현됨)

- Phaser 3 + TypeScript + Vite 기반 실행 구조
- `npm.cmd run dev`
- `npm.cmd run typecheck`
- `npm.cmd run build`
- `src/main.ts`
- `src/scenes/GameScene.ts`
- `src/ui/Hud.ts`
- JSON data (JSON 데이터) 기반 로딩 구조

## 2.2 Documentation Cleanup (문서 정리)

Implemented (구현됨)

- `README.md` 프로젝트 입구 문서 정리
- `docs/AGENT_HANDOFF.md` 새 Codex 세션 인수인계 문서 작성
- `docs/PROJECT_STATUS.md` 현재 구현 상태 정리
- `docs/DATA_SCHEMA.md` JSON 데이터 구조 정리
- `docs/COMBAT_SYSTEM.md` 전투 시스템 문서 정리
- `docs/STAGE_SYSTEM.md` 스테이지 시스템 문서 정리
- `docs/REWARD_SYSTEM.md` 보상 시스템 문서 정리
- `docs/MONSTER_SYSTEM.md` 몬스터 시스템 문서 정리
- `docs/PLAYER_GROWTH_SYSTEM.md` 성장 시스템 문서 추가
- `docs/EQUIPMENT_SYSTEM.md` 장비 시스템 문서 추가
- `docs/SAVE_SYSTEM.md`, `docs/UI_SYSTEM.md`, `docs/INVENTORY_SYSTEM.md` 갱신

문서 규칙

- 주요 아키텍처 용어는 `EnglishName (한글 설명)` 형식으로 작성한다.
- 코드 식별자, 클래스명, 함수명, 파일명은 영어 기준으로 작성한다.
- 문서와 UI 표시 문자열은 한국어를 허용한다.

## 2.3 Monster Refactor (몬스터 리팩토링)

Implemented (구현됨)

- `MonsterData (몬스터 정적 데이터)`와 `MonsterInstance (몬스터 런타임 객체)` 분리
- `MonsterFactory (몬스터 생성기)` 추가
- `MonsterPoolSystem (몬스터 풀 시스템)` 추가
- `SingleEntityMonster (단일 개체 몬스터)` MVP 방향 적용
- `MonsterState (몬스터 상태)` enum 기반 상태 구조 적용
- `CombatSystem (전투 시스템)`이 보상을 직접 지급하지 않도록 분리

핵심 흐름

```text
StageData (스테이지 데이터)
-> MonsterPoolSystem (몬스터 풀 시스템)
-> MonsterData selected (몬스터 정적 데이터 선택)
-> MonsterFactory (몬스터 생성기)
-> MonsterInstance created (몬스터 런타임 객체 생성)
-> CombatSystem handles combat (전투 시스템이 전투 처리)
-> MonsterDefeatedResult returned (몬스터 처치 결과 반환)
-> RewardResolver calculates reward (보상 계산기가 보상 계산)
-> RewardSystem applies reward (보상 시스템이 보상 적용)
```

Future (추후)

- `SegmentedMonster (세그먼트형 몬스터)`는 MVP 1에서 구현하지 않고 문서에만 남김
- Multi-Part Boss (다중 부위 보스), World Boss (월드 보스), Boss Phase (보스 페이즈)는 2차 이후 확장

## 2.4 Stage Progress System (스테이지 진행 시스템)

Implemented (구현됨)

- `StageProgressSystem (스테이지 진행 시스템)` 추가
- 일반 몬스터 처치 수 카운트
- 일반 몬스터 N마리 처치 후 Leader Monster (리더 몬스터) 등장
- 리더 처치 후 Boss Monster (보스 몬스터)가 있으면 보스 등장
- 보스가 없는 스테이지는 리더 처치 시 클리어
- 스테이지 클리어 후 다음 스테이지 진행

현재 진행 흐름

```text
Normal Monster N kills (일반 몬스터 N마리 처치)
-> Leader Monster appears (리더 몬스터 등장)
-> Leader Monster defeated (리더 처치)
-> Boss Monster appears if exists (보스가 있으면 등장)
-> Boss defeated or no boss stage cleared (보스 처치 또는 보스 없음이면 클리어)
-> Next stage (다음 스테이지)
```

## 2.5 Reward System (보상 시스템)

Implemented (구현됨)

- `RewardResolver (보상 계산기)` 추가
- `DropResolver (드랍 계산기)` 추가
- `RewardSystem (보상 적용 시스템)` 추가
- 경험치, 골드, 아이템 드랍 계산 분리
- `CombatSystem (전투 시스템)`은 보상 지급을 하지 않음

보상 책임 분리

```text
CombatSystem (전투 시스템)
= 전투 결과만 반환

RewardResolver (보상 계산기)
= 경험치, 골드, 아이템 드랍 계산

RewardSystem (보상 적용 시스템)
= 플레이어와 인벤토리에 최종 보상 적용
```

드랍률 공식

```ts
finalDropRate = Math.min(1, baseDropRate * (1 + stage.dropRateBonus));
```

## 2.6 PlayerGrowthSystem (플레이어 성장 시스템)

Implemented (구현됨)

- `src/systems/PlayerGrowthSystem.ts` 추가
- `docs/PLAYER_GROWTH_SYSTEM.md` 추가
- 경험치 누적
- 여러 번 레벨업 가능하도록 `while` 처리
- 레벨업 시 기본 스탯 상승
- 레벨업 후 `hp = maxHp` 회복
- 기존 저장 데이터에 `totalExp`가 없어도 fallback 처리

경험치 의미

```text
exp = 현재 레벨에서 다음 레벨까지의 진행 경험치
totalExp = 지금까지 누적 획득한 전체 경험치
requiredExp = 저장하지 않고 공식으로 계산하는 파생값
```

경험치 요구량 공식

```ts
requiredExp = Math.floor(40 * level * 1.25 ** (level - 1));
```

GrowthResult (성장 결과) 구조

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

## 2.7 EquipmentSystem (장비 시스템)

Implemented (구현됨)

- `src/systems/EquipmentSystem.ts` 추가
- `docs/EQUIPMENT_SYSTEM.md` 추가
- 장비 슬롯 3종 구현
- 고정 스탯 장비 데이터 구현
- 장착/해제 결과 타입 구현
- 장비 스탯과 기본 스탯 분리
- 전투 계산에 `EffectivePlayerStats (최종 플레이어 스탯)` 반영
- 저장/불러오기 fallback 처리
- HUD에 장비 보너스 표시

장비 슬롯

```ts
type EquipmentSlot = "weapon" | "armor" | "accessory";
```

핵심 원칙

```text
PlayerState (플레이어 상태)
= 성장으로 오른 기본 스탯 원본

EquipmentState (장비 상태)
= 장착한 itemId 목록

EffectivePlayerStats (최종 플레이어 스탯)
= 전투에 사용하는 기본 스탯 + 장비 보너스
```

MVP 장비 아이템

```text
rusty_training_sword (낡은 수련검)
- slot: weapon
- attack +4

worn_apprentice_armor (수습기사의 낡은 갑옷)
- slot: armor
- maxHp +20
- defense +2

cracked_apprentice_ring (금 간 수습기사 반지)
- slot: accessory
- maxHp +8
- attack +1
- defense +1
```

HP policy (HP 처리 정책)

```text
Equip (장착)
= 현재 hp 유지

Unequip (해제)
= 현재 hp가 effectiveMaxHp보다 높으면 effectiveMaxHp로 clamp
```

Inventory policy (인벤토리 정책)

```text
장비를 장착해도 inventory 수량은 차감하지 않는다.
단, 장착하려면 InventorySystem.hasItem(itemId, 1) === true 여야 한다.
```

## 2.8 SaveSystem (저장 시스템)

Implemented (구현됨)

- localStorage 저장/불러오기
- PlayerState 저장
- Inventory 저장
- Stage 진행 상태 저장
- EquipmentState 저장
- 기존 세이브에 새 필드가 없어도 fallback 처리

현재 fallback 방향

```ts
equipment: saved?.equipment ?? { equipped: {} }
totalExp: saved player data에 없으면 안전하게 기본값 처리
```

## 2.9 UI / HUD (화면 표시)

Implemented (구현됨)

- HP 표시
- ATK / DEF 표시
- EXP / Level 표시
- Stage 진행 표시
- Gold 표시
- Inventory 요약 표시
- Equipment Bonus (장비 보너스) 표시
- 장착 슬롯 표시

예시 표시 방향

```text
HP 100/120 (기본 100 + 장비 20)
ATK 18 (기본 14 + 장비 4)
DEF 5 (기본 3 + 장비 2)
Equipment Bonus: HP +20 / ATK +4 / DEF +2
```

## 3. 현재 검증 결과

마지막 구현 작업 기준 검증 결과는 아래와 같다.

```text
npm.cmd run typecheck: PASS
npm.cmd run build: PASS
```

참고

- 일반 sandbox 실행에서 `npm.cmd run build`가 권한 문제로 실패한 적이 있음
- 권한 승인 후 elevated build는 PASS
- Vite chunk size warning은 남아 있으나 build failure는 아님

검색 검증

```text
player.attack +=
player.defense +=
player.maxHp +=
```

위 직접 누적은 EquipmentSystem 장착/해제 로직에서 발견되지 않았다.
PlayerGrowthSystem 레벨업 기본 스탯 증가 로직은 예외로 허용한다.

## 4. 현재 주의할 점

## 4.1 Untracked File (추적되지 않은 파일)

현재 아래 파일이 Git에 올라가지 않은 상태로 남아 있다.

```text
files/EquipmentSystem (장비 시스템) 구현 플랜.txt
```

이 파일은 기존에 있던 별도 메모 파일로 보이며, 현재까지 작업에서는 건드리지 않았다.

처리 방향

```text
확인 필요:
이 파일을 보존할지, Git에 추가할지, 삭제할지는 전민재가 결정해야 한다.
```

## 4.2 README Encoding (README 인코딩)

PowerShell 기본 출력에서는 README 한글이 깨져 보일 수 있다.

해결 방식

```powershell
Get-Content -Raw -Encoding UTF8 README.md
```

파일 자체는 UTF-8 기준으로 읽으면 정상 한글로 확인된다.

## 4.3 Electron Preview (Electron 미리보기)

현재 `codex-electron-console` 프로젝트는 존재하지만, 게임 URL을 Electron 창 안에 자동으로 띄우는 연동은 아직 완료되지 않았다.

현재 게임 실행은 웹 기준이다.

```text
http://127.0.0.1:5173
```

다음 Electron 작업에서 이 URL을 Electron 내부 WebView 또는 BrowserWindow에 표시하도록 연결할 수 있다.

## 5. 앞으로 해야 되는 일

## 5.1 SkillSystem (스킬 시스템)

추천 우선순위: 1순위

목표

- 자동 전투 중 스킬이 자동 발동되는 구조
- 스킬 쿨타임 관리
- 스킬 피해 또는 버프 효과 적용
- 스킬 강화 비용과 레벨 관리
- 저장/불러오기 연동
- HUD 표시

MVP 범위 추천

```text
SkillData (스킬 정적 데이터)
SkillState (스킬 런타임/저장 상태)
SkillSystem (스킬 시스템)
BasicSkillBehavior (기본 스킬 방식)
Cooldown (쿨타임)
AutoTrigger (자동 발동)
```

중요 원칙

```text
CombatSystem (전투 시스템)은 스킬 결과를 전투 계산에 반영할 수 있다.
RewardResolver (보상 계산기)는 스킬과 무관하게 보상 계산만 담당한다.
SkillSystem (스킬 시스템)은 스킬 쿨타임, 발동 조건, 효과 계산을 담당한다.
```

## 5.2 Electron Game Preview Integration (Electron 게임 미리보기 연동)

추천 우선순위: 2순위

목표

- `idle-rpg-mvp`의 Vite dev server를 실행
- Electron 앱 안에서 `http://127.0.0.1:5173` 표시
- Codex 전용 로컬 콘솔처럼 게임 화면을 오른쪽 또는 별도 창에 띄우기

예상 작업

```text
codex-electron-console/
-> BrowserWindow 설정
-> game preview URL 로드
-> dev server 실행 여부 안내
-> 필요 시 start script 정리
```

주의

```text
게임 프로젝트와 Electron 콘솔 프로젝트는 현재 별도 폴더다.
무리하게 합치지 말고, 먼저 미리보기 연결만 하는 것이 안전하다.
```

## 5.3 Stage Content Expansion (스테이지 콘텐츠 확장)

추천 우선순위: 3순위

목표

- 스테이지 수 확장
- 일반 몬스터 풀 다양화
- 리더/보스 몬스터 추가
- 스테이지별 보상 차등화
- stage clear reward (스테이지 클리어 보상) 강화

확장 방향

```text
Stage 1-3: 초반 수습기사 성장 구간
Stage 4-6: 장비 파밍이 중요한 구간
Stage 7-9: 보스/리더 난이도가 올라가는 구간
```

## 5.4 Equipment Farming Expansion (장비 파밍 확장)

추천 우선순위: 4순위

현재 EquipmentSystem은 MVP 1 기준 고정 스탯 장비만 구현했다.

추후 확장 후보

```text
itemPoolId (아이템 풀 ID)
gradeWeights (등급 가중치)
equipment grade (장비 등급)
random option (랜덤 옵션)
enhancement (강화)
```

MVP 2 이후에 검토할 것

- 장비 개별 인스턴스 ID
- 같은 장비 여러 개 중 특정 1개 장착
- 랜덤 옵션
- 등급별 드랍
- 장비 강화
- 세트 효과

## 5.5 RebirthSystem (환생 시스템)

추천 우선순위: 5순위

목표

- 일정 진행 이후 reset + permanent bonus (초기화 + 영구 보너스)
- 환생 재화 추가
- 성장 속도 증가
- 장기 반복 루프 강화

아직은 구현하지 않고, SkillSystem과 Stage 확장이 어느 정도 잡힌 뒤 설계하는 것이 좋다.

## 5.6 JobSystem (전직 시스템)

추천 우선순위: 6순위

목표

- Trainee Knight (수습기사) 이후 직업 분기
- 직업별 스탯 성장률
- 직업별 스킬 해금
- 전직 조건

아직은 구현하지 않고, SkillSystem 이후 설계하는 것이 좋다.

## 5.7 Test Structure (테스트 구조)

추천 우선순위: 병행 작업

현재 검증은 `typecheck`와 `build` 중심이다.

추가하면 좋은 테스트

```text
RewardResolver unit test (보상 계산 테스트)
DropResolver unit test (드랍 계산 테스트)
PlayerGrowthSystem unit test (성장 테스트)
EquipmentSystem unit test (장비 스탯 중복 방지 테스트)
StageProgressSystem unit test (스테이지 진행 테스트)
```

## 6. 다음 작업 추천 순서

추천 순서

```text
1. SkillSystem (스킬 시스템) 구현 플랜 작성
2. SkillSystem MVP 구현
3. Electron Game Preview Integration (Electron 게임 미리보기 연동)
4. Stage Content Expansion (스테이지 콘텐츠 확장)
5. Equipment Farming Expansion (장비 파밍 확장)
6. RebirthSystem (환생 시스템) 설계
7. JobSystem (전직 시스템) 설계
```

가장 자연스러운 다음 작업은 SkillSystem (스킬 시스템)이다.

이유

- 현재 자동 전투, 성장, 장비, 보상 루프는 잡혀 있다.
- 다음 재미 요소는 전투 중 자동으로 발동되는 스킬이다.
- 스킬이 들어가면 성장/장비/스테이지 난이도 조정 기준도 더 명확해진다.

## 7. 새 대화 시작용 인수인계 문구

새 Codex 대화에서 이어갈 때 아래 문구를 사용하면 된다.

```text
C:\Users\jmj\Desktop\코덱스 자료\idle-rpg-mvp\files\2026-06-13_095009_PROJECT_MID_SUMMARY.md 를 먼저 읽고,
현재까지 구현된 Idle RPG MVP 상태를 이어받아줘.

다음 작업은 SkillSystem (스킬 시스템) 구현 플랜 작성부터 시작해줘.
아직 바로 구현하지 말고, 먼저 플랜만 작성해줘.
```

## 8. 마지막 정리

현재 MVP는 아래까지 구현된 상태다.

```text
Core Loop (핵심 루프)
+ Monster Refactor (몬스터 리팩토링)
+ Stage Progress (스테이지 진행)
+ Reward Flow (보상 흐름)
+ PlayerGrowthSystem (플레이어 성장 시스템)
+ EquipmentSystem (장비 시스템)
+ SaveSystem fallback (저장 fallback)
+ HUD display (HUD 표시)
```

다음 핵심 목표는 아래다.

```text
SkillSystem (스킬 시스템)
= 자동 전투의 재미를 올리는 첫 번째 전투 확장 시스템
```
