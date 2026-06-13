# 2026-06-13 14:06:21 - UI Panel Refinement Plan v1

## Purpose (목적)

`UI Panel Refinement (UI 패널 개선)`의 목표는 사용자가 화면을 봤을 때 현재 게임 상태와 전투 흐름을 더 쉽게 이해할 수 있도록 HUD (헤드업 디스플레이), Panel (패널), Battle Log (전투 로그) 구성을 개선하는 것이다.

이번 단계는 Plan Only (플랜 전용)이다.

아직 구현하지 않는다.

---

## Scope Rules (범위 규칙)

금지:

- Game Logic (게임 로직) 수정 금지
- `CombatSystem (전투 시스템)` 수정 금지
- `RewardSystem (보상 시스템)` 수정 금지
- `PlayerGrowthSystem (플레이어 성장 시스템)` 수정 금지
- `EquipmentSystem (장비 시스템)` 수정 금지
- `SkillSystem (스킬 시스템)` 수정 금지
- `StageProgressSystem (스테이지 진행 시스템)` 수정 금지
- Formal Image / Animation / Effect (정식 이미지 / 애니메이션 / 이펙트) 작업 금지

허용 후보:

- HUD layout (HUD 배치) 개선
- Text grouping (텍스트 묶음) 개선
- Log category (로그 분류) 개선
- Placeholder label (임시 표시 라벨) 개선
- Panel title (패널 제목) 개선
- Manual validation readability (수동 검증 가독성) 개선

---

## 1. Current HUD / Screen Summary (현재 HUD / 화면 구성 요약)

현재 화면은 `MVP Visual Readability Pass (MVP 화면 가독성 개선)` 이후 아래 구조를 가진다.

```text
Top Area (상단 영역)
- Game title
- Current stage name
- Stage progress

Left Panel (왼쪽 패널)
- Player level
- Player HP bar
- ATK / DEF
- EXP / Gold

Center Area (중앙 전투 영역)
- Player placeholder
- Monster placeholder
- Monster HP bar
- Current target name
- Monster role / state

Right Panel (오른쪽 패널)
- Battle log

Bottom Area (하단 영역)
- Skill cooldowns
- Equipment slots
- Inventory summary
```

현재 장점:

- 텍스트 겹침은 이전보다 줄었다.
- Player (플레이어), Monster (몬스터), HP Bar (체력 바), Battle Log (전투 로그)를 분리했다.
- Stage 1~9 manual playtest (수동 검증)에 필요한 최소 정보가 보인다.

현재 한계:

- Owned Equipment (보유 장비)와 Equipped Equipment (장착 장비)가 명확히 분리되어 보이지 않을 수 있다.
- Death / Reset (사망 / 회복) 로그가 일반 전투 로그에 묻힐 수 있다.
- Next Objective (다음 목표)가 충분히 명확하지 않을 수 있다.
- Monster Type (normal / leader / boss)이 색상 외 텍스트로 더 명확히 필요하다.

---

## 2. Confusing Information (사용자가 헷갈릴 수 있는 정보)

헷갈릴 수 있는 항목:

- Current Stage (현재 스테이지)가 어느 Region (지역)에 속하는지
- 현재 목표가 Normal Kill Count (일반 몬스터 처치 수)인지 Leader (리더)인지 Boss (보스)인지
- Monster Type (몬스터 타입)이 normal / leader / boss 중 무엇인지
- Player Stat (플레이어 스탯)이 Base Stat (기본 스탯)인지 Effective Stat (최종 스탯)인지
- 장비를 owned (보유)만 한 상태인지 equipped (장착)한 상태인지
- Skill Cooldown (스킬 쿨타임)이 준비됨인지 레벨 제한인지 쿨타임 중인지
- Skill Cast Log (스킬 발동 로그)가 실제 피해를 줬는지
- Death / Reset (사망 / 회복)이 발생했는지
- Stage clear reward (스테이지 클리어 보상)를 받았는지

---

## 3. Display Information To Add / Improve (추가 또는 개선할 표시 정보)

### Current Stage (현재 스테이지)

표시 후보:

```text
Stage 3 / 9 - dawn_forest_3
```

가능하면 Korean display name (한글 표시명)도 같이 표시한다.

주의:

Korean Display Text Fix (한글 표시 문자열 수정)는 별도 작업이므로, 이번 UI 플랜에서는 구조만 잡는다.

### Region (지역)

표시 후보:

```text
Region: Dawn Forest (새벽 숲)
```

Region 정보가 현재 StageData에 별도 필드로 없다면 구현 단계에서 아래 중 선택한다.

- Stage ID prefix (스테이지 ID 접두어)로 임시 계산
- `region` 필드 추가는 data patch이므로 별도 승인 후 진행

### Monster Type (몬스터 타입)

표시 후보:

```text
Type: Normal (일반)
Type: Leader (리더)
Type: Boss (보스)
```

색상 + 라벨을 함께 사용한다.

### Player Level / EXP (플레이어 레벨 / 경험치)

표시 후보:

```text
Lv 6
EXP 644 / 732
Next Lv: 88 EXP
Total EXP: 1771
```

### Player HP (플레이어 체력)

표시 후보:

```text
HP 180 / 200
Base HP 180 + Equipment 20
```

### Effective Attack / Defense (최종 공격력 / 방어력)

표시 후보:

```text
ATK 33 (Base 29 + Equip 4)
DEF 10 (Base 8 + Equip 2)
```

### Owned Equipment (보유 장비)

표시 후보:

```text
Owned:
- rusty_training_sword x1
- worn_apprentice_armor x1
```

장비만 우선 표시하고 material (재료)은 Inventory Summary (인벤토리 요약)에 둔다.

### Equipped Equipment (장착 장비)

표시 후보:

```text
Equipped:
Weapon: rusty_training_sword
Armor: worn_apprentice_armor
Accessory: empty
```

### Skill Cooldown / Skill Cast Log (스킬 쿨타임 / 스킬 발동 로그)

표시 후보:

```text
Skills:
trainee_slash: Ready
heavy_training_strike: 3.2s
```

로그 후보:

```text
[Skill] trainee_slash dealt 43 damage
[Skill] heavy_training_strike defeated sleepy_ogre
```

### Death / Reset Log (사망 / 회복 로그)

표시 후보:

```text
[Player] HP reached 0. Auto recovered to full HP.
```

주의:

현재 CombatSystem (전투 시스템)은 HP 0 도달 시 바로 full HP로 회복한다. 로직을 바꾸지 않고 로그만 더 명확히 할 수 있는지 확인이 필요하다.

### Next Objective (다음 목표)

표시 후보:

```text
Objective:
Defeat 6 / 10 normal monsters
Next: Leader
Next: Boss
Clear stage
```

---

## 4. Candidate Files To Change (변경 후보 파일)

구현 승인 후 변경 후보:

```text
src/ui/Hud.ts
docs/UI_SYSTEM.md
docs/MANUAL_PLAYTEST_CHECKLIST.md
docs/PROJECT_STATUS.md
README.md
```

조건부 후보:

```text
src/scenes/GameScene.ts
```

`GameScene.ts`는 HUD에 필요한 view model (표시용 데이터)을 넘기는 정도로만 제한한다. 전투/보상/성장 로직은 변경하지 않는다.

---

## 5. Files Not To Change (수정하지 말아야 할 파일)

이번 UI 구현에서도 수정 금지:

```text
src/systems/CombatSystem.ts
src/systems/RewardSystem.ts
src/systems/RewardResolver.ts
src/systems/PlayerGrowthSystem.ts
src/systems/EquipmentSystem.ts
src/systems/SkillSystem.ts
src/systems/StageProgressSystem.ts
data/*.json
```

---

## 6. UI Layout Draft (UI 배치 초안)

권장 배치:

```text
┌────────────────────────────────────────────────────────────┐
│ Top Bar                                                     │
│ Title | Region | Stage | Objective                         │
├───────────────┬───────────────────────────┬────────────────┤
│ Player Panel  │ Combat View               │ Battle Log      │
│ Lv / EXP      │ Player vs Monster         │ Recent 8 lines  │
│ HP Bar        │ Monster Type / HP Bar     │ Categorized     │
│ Base/Equip    │ Placeholder visuals       │                │
├───────────────┴───────────────────────────┴────────────────┤
│ Bottom Panel                                                │
│ Skills | Equipped Equipment | Owned Equipment | Inventory   │
└────────────────────────────────────────────────────────────┘
```

Panel priority (패널 우선순위):

1. Combat readability (전투 흐름 이해)
2. Player survival (플레이어 생존 상태)
3. Skill and equipment validation (스킬/장비 검증)
4. Inventory summary (인벤토리 요약)

---

## 7. Label Language Rule (텍스트 라벨 한글/영문 표기 원칙)

Code identifiers (코드 식별자):

```text
English only
```

User-facing labels (사용자 표시 라벨):

```text
Korean first, optional English for architecture/debug labels
```

권장 예:

```text
스테이지
지역
목표
플레이어
몬스터
일반 / 리더 / 보스
스킬
장비
전투 로그
```

Debug-friendly labels (검증용 라벨):

```text
ATK
DEF
EXP
HP
Normal
Leader
Boss
```

주의:

현재 일부 data display text (데이터 표시 문자열)는 터미널에서 깨져 보일 수 있다. 이 문제는 `Korean Display Text Fix (한글 표시 문자열 수정)` 별도 작업으로 분리한다.

---

## 8. Validation Method (검증 방법)

구현 승인 후 실행:

```powershell
npm.cmd run typecheck
npm.cmd run build
```

Manual UI validation (수동 UI 검증):

```text
1. 1280 x 720에서 텍스트 겹침 없음
2. current stage / region / objective가 보임
3. normal / leader / boss 구분이 보임
4. player HP / EXP / effective stats가 보임
5. owned equipment와 equipped equipment가 구분됨
6. skill cooldown과 skill cast log가 보임
7. death/reset log가 발생 시 눈에 띔
8. battle log 최근 6~8줄이 읽기 쉬움
9. Stage 1~9 manual validation에 필요한 정보가 한 화면에서 확인 가능
```

Search validation (검색 검증):

```powershell
git diff -- src/systems data
```

Expected:

```text
No system/data logic changes.
```

---

## 9. Expected Risks (예상 리스크)

1. Text Density (텍스트 밀도)
   - 너무 많은 정보를 한 화면에 넣으면 다시 겹치거나 작아질 수 있다.

2. GameScene Coupling (GameScene 결합도)
   - HUD 표시용 데이터를 넘기려다 `GameScene.ts`가 다시 비대해질 수 있다.
   - 필요하면 `HudViewModel (HUD 표시 모델)` 타입을 고려한다.

3. Owned vs Equipped Data Access (보유/장착 데이터 접근)
   - InventorySystem과 EquipmentSystem의 데이터를 HUD에 전달해야 한다.
   - 로직 수정 없이 표시용 조회만 해야 한다.

4. Death / Reset Visibility (사망/회복 가시성)
   - 현재 CombatSystem이 즉시 HP를 회복시키므로 UI에서 감지하려면 표시용 신호가 필요할 수 있다.
   - 시스템 로직을 바꾸지 않는 범위에서 가능한지 구현 전 확인이 필요하다.

5. Korean Text Encoding (한글 인코딩)
   - 데이터 표시 문자열 복구는 별도 작업으로 분리한다.

---

## 10. Link To Future Image / Animation / Effect Work (후속 이미지 / 애니메이션 / 이펙트 작업 연결점)

이번 UI Panel Refinement (UI 패널 개선)는 정식 아트 작업 전의 정보 구조 정리다.

후속 작업 연결:

- Placeholder Visuals (임시 시각 요소)를 Sprite (스프라이트)로 교체
- Monster type color (몬스터 타입 색상)를 monster portrait/icon (몬스터 초상/아이콘)으로 교체
- Skill cast log (스킬 발동 로그)를 skill effect animation (스킬 이펙트 애니메이션)으로 확장
- Death/reset log (사망/회복 로그)를 hit flash / recovery effect (피격/회복 이펙트)로 확장
- Equipment panel (장비 패널)을 item icon grid (아이템 아이콘 그리드)로 확장

Important:

```text
Do not start formal image/animation/effect production until UI information layout is stable.
```

---

## Recommended Next Step (다음 권장 단계)

1. User reviews this plan (사용자 플랜 검토)
2. If approved, inspect current `Hud.ts` layout coordinates
3. Implement minimal UI refinement only
4. Run typecheck/build
5. Manual UI validation at 1280 x 720
6. Commit after approval

