# Manual Playtest Checklist (수동 플레이 검증 체크리스트)

Last updated: 2026-06-13

## Purpose (목적)

이 문서는 Codex 또는 자동화 도구가 브라우저를 직접 조작하지 못할 때, 사용자가 직접 `Stage 1~9 Manual Browser Verification (스테이지 1~9 브라우저 수동 검증)`을 진행하기 위한 체크리스트다.

이번 검증은 새 시스템 구현이 아니라 현재 구현된 `CombatSystem (전투 시스템)`, `RewardSystem (보상 시스템)`, `PlayerGrowthSystem (플레이어 성장 시스템)`, `EquipmentSystem (장비 시스템)`, `SkillSystem (스킬 시스템)`, `SaveSystem (저장 시스템)`이 실제 화면에서 잘 맞물리는지 확인하는 목적이다.

## 1. Development Server (개발 서버 실행)

PowerShell에서 아래 명령을 실행한다.

```powershell
cd "C:\Users\jmj\Desktop\코덱스 자료\idle-rpg-mvp"
npm.cmd run dev
```

기본 주소는 보통 아래와 같다.

```text
http://127.0.0.1:5173/
```

이미 포트가 사용 중이면 Vite가 `5174`, `5175`처럼 다른 주소를 보여줄 수 있다. 터미널에 표시된 `Local:` 주소를 브라우저에서 열면 된다.

## 2. Save Reset (저장 데이터 초기화)

MVP 개발 중에는 stage data (스테이지 데이터)가 바뀌면 기존 저장 데이터와 현재 데이터가 어긋날 수 있다.

브라우저 개발자 도구 콘솔에서 아래 명령을 실행한다.

```js
localStorage.removeItem("idle-rpg-mvp-save");
location.reload();
```

Chrome 기준 개발자 도구 열기:

```text
F12
또는 Ctrl + Shift + I
```

## 3. Basic Screen Check (기본 화면 확인)

아래 항목이 화면에 정상 표시되는지 확인한다.

- Game title (게임 제목)
- Stage name (스테이지 이름)
- Stage progress (스테이지 진행도)
- Encounter type (전투 단계)
- Player stats (플레이어 스탯)
- Effective stats (최종 스탯)
- Equipment bonus (장비 보너스)
- Skill cooldown (스킬 쿨타임)
- Current monster (현재 몬스터)
- Inventory (인벤토리)
- Combat log (전투 로그)
- Player HP bar (플레이어 체력 바)
- Monster HP bar (몬스터 체력 바)
- Player placeholder (플레이어 임시 표시)
- Monster placeholder (몬스터 임시 표시)

한글이 깨져 보이면 브라우저 새로고침 후 다시 확인한다. 계속 깨지면 `src/scenes/GameScene.ts`, `src/ui/Hud.ts`, JSON 데이터 파일의 인코딩을 UTF-8로 확인해야 한다.

## 3-1. MVP Visual Readability Pass Check (MVP 화면 가독성 확인)

현재 화면은 정식 아트가 아니라 수동 검증을 위한 임시 시각화다.

아래 항목을 확인한다.

- Top Area (상단 영역): 제목, 현재 스테이지, 진행도가 겹치지 않는다.
- Left Panel (왼쪽 패널): 플레이어 레벨, HP bar, ATK/DEF, EXP/Gold가 한눈에 보인다.
- Center Area (중앙 전투 영역): 플레이어 placeholder와 몬스터 placeholder가 구분된다.
- Right Panel (오른쪽 패널): 전투 로그가 6~8줄 정도 보이고 다른 UI와 겹치지 않는다.
- Bottom Area (하단 영역): 스킬, 장비, 인벤토리 요약이 한눈에 보인다.
- Normal Monster (일반 몬스터)는 초록 원으로 보인다.
- Leader Monster (리더 몬스터)는 노란 원으로 보인다.
- Boss Monster (보스 몬스터)는 큰 빨간 원으로 보인다.
- 플레이어와 몬스터 HP bar가 전투 중 줄어드는지 확인한다.
- 최소 `1280 x 720` 화면에서 텍스트가 겹치지 않는다.

## 4. Stage 1~9 Flow Check (스테이지 1~9 흐름 확인)

아래 순서대로 진행되는지 확인한다.

```text
dawn_forest_1
-> dawn_forest_2
-> dawn_forest_3
-> mist_gate_1
-> mist_gate_2
-> mist_gate_3
-> old_mine_1
-> old_mine_2
-> old_mine_3
```

### Stage 1~2 (초반 진행)

- `normal (일반 몬스터)` 처치 수가 올라가는지 확인한다.
- 요구 처치 수를 채우면 `leader (리더 몬스터)`로 바뀌는지 확인한다.
- 리더 처치 후 다음 스테이지로 넘어가는지 확인한다.

### Stage 3 (첫 보스)

- 리더 처치 후 `boss (보스 몬스터)`가 등장하는지 확인한다.
- 보스 placeholder가 일반/리더보다 큰 빨간 원으로 표시되는지 확인한다.
- 보스 처치 후 `rusty_training_sword (낡은 수련검)`이 지급되는지 확인한다.
- 지급 후 장비 목록의 `weapon (무기)` 슬롯에 장착되는지 확인한다.

### Stage 4~5 (스킬 체감)

- 플레이어가 Lv 3 이상이면 `heavy_training_strike (묵직한 수련 일격)`이 표시되고 자동 발동되는지 확인한다.
- 스킬 쿨타임이 `준비됨`과 `초 단위 대기`로 바뀌는지 확인한다.
- 장비 장착 후 기본 공격 피해와 스킬 피해가 이전보다 커지는지 전투 로그에서 확인한다.

### Stage 6 (방어구 보장)

- 보스가 정상 등장하는지 확인한다.
- 보스 HP bar가 표시되는지 확인한다.
- 클리어 후 `worn_apprentice_armor (수습기사의 낡은 갑옷)`이 지급되는지 확인한다.
- 지급 후 `armor (방어구)` 슬롯에 장착되는지 확인한다.
- HP/DEF 장비 보너스가 증가하는지 확인한다.

### Stage 7~9 (광산 구간)

- `old_mine` 계열 스테이지로 정상 진입하는지 확인한다.
- 광산 몬스터와 보상이 화면에 어색하지 않게 연결되는지 확인한다.
- Stage 9에서 `ancient_mine_guardian (고대 광산 수호자)`가 보스로 등장하는지 확인한다.
- Stage 9 보스가 Boss Monster (보스 몬스터) 색상/크기/라벨로 구분되는지 확인한다.
- Stage 9 클리어 후 `cracked_apprentice_ring (금 간 수습기사 반지)`와 `guardian_stone (수호자의 돌)`이 지급되는지 확인한다.

## 5. Save / Load Check (저장 / 불러오기 확인)

게임은 약 3초마다 자동 저장된다. 아래 순서로 확인한다.

1. Stage 3 이후까지 진행한다.
2. 장비 또는 아이템이 지급된 상태인지 확인한다.
3. 브라우저에서 새로고침한다.
4. 아래 값이 유지되는지 확인한다.

- `currentStageId (현재 스테이지 ID)`
- `player.level (플레이어 레벨)`
- `player.exp / player.totalExp (경험치)`
- `inventory (인벤토리)`
- `equipment (장착 상태)`
- `skills (스킬 상태)`

콘솔에서 저장 데이터를 직접 확인하려면 아래 명령을 사용한다.

```js
JSON.parse(localStorage.getItem("idle-rpg-mvp-save"));
```

저장 데이터에 최소한 아래 키가 있어야 한다.

```text
player
inventory
equipment
skills
stage
```

## 6. Reward Duplication Check (보상 중복 지급 확인)

스킬로 몬스터가 죽었을 때 아래를 확인한다.

- 전투 로그에 처치 보상이 한 번만 찍히는지 확인한다.
- 같은 몬스터 처치로 골드/경험치가 두 번 오르지 않는지 확인한다.
- 스킬 처치 직후 같은 tick에서 기본 공격 로그가 추가로 찍히지 않는지 확인한다.

## 7. Balance Record Format (밸런스 기록 양식)

각 스테이지를 클리어할 때 아래 형식으로 기록한다.

```text
Stage ID:
Player Level at clear:
Main equipment owned:
Clear feeling:
- too easy
- good
- too hard
- too slow

Issue:
Suggested adjustment:
```

중점 확인:

```text
Stage 1~2: 초반 진행 속도
Stage 3: 첫 보스 체감
Stage 4~5: Lv 3 스킬 체감
Stage 6: armor 보장 후 난이도 변화
Stage 7~8: 광산 구간 난이도 상승
Stage 9: MVP 1 최종 보스 난이도
```

## 8. Current Known Notes (현재 참고 사항)

- MVP 개발 중 stage data (스테이지 데이터)를 확장하면 기존 `localStorage` 저장 데이터 초기화가 필요할 수 있다.
- 현재 저장 데이터에는 별도 version field (버전 필드)가 없다.
- `SkillRuntimeState (스킬 런타임 상태)`의 cooldown (쿨타임)은 저장하지 않는다. 새로고침 후 쿨타임은 0부터 시작한다.
- UI는 현재 MVP용 텍스트 HUD이며, 최종 디자인/반응형 레이아웃은 아직 아니다.
- 현재 `MVP Visual Readability Pass (MVP 화면 가독성 개선)`는 정식 아트 작업이 아니라 수동 검증을 위한 임시 레이아웃이다.
