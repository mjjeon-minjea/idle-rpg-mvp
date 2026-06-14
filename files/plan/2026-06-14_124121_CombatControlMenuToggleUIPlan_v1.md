# Combat Control / Menu Toggle UI Plan v1

작성일: 2026-06-14 12:41:21

## 1. Purpose (목적)

`Combat Control / Menu Toggle UI (전투 제어 / 메뉴 접기 UI)`는 첫 화면의 복잡도를 줄이고, 주요 기능을 아이콘 중심으로 정리하기 위한 UI 작업이다.

이번 계획은 1차 구현과 2차 구현을 명확히 분리한다.

```text
Phase 1 (1차)
= UI state only (UI 상태만 구현)

Phase 2 (2차)
= Actual combat mode / speed logic (실제 전투 모드 / 속도 로직 연결)
```

1차에서는 실제 전투 계산, 자동 전투 속도, 보상, 스킬, 스테이지 진행을 변경하지 않는다.

## 2. Current UI State (현재 UI 상태)

현재 `Hud.ts`는 아래 구조를 가진다.

```text
Top Area (상단 영역)
- stageText

Left Panel (왼쪽 패널)
- playerText
- playerHpText

Center Panel (중앙 패널)
- player placeholder
- monster image / monster placeholder
- monsterText
- monsterHpText

Right Panel (오른쪽 패널)
- logText
- Battle Log 표시

Bottom Area (하단 영역)
- skillText
- equipmentText
- inventoryText
- equipped item icons
```

현재 문제:

- `Battle Log (전투 로그)`가 우측 공간을 크게 차지한다.
- `Skill / Equipment / Inventory / Quest (스킬 / 장비 / 가방 / 퀘스트)`가 아이콘 메뉴로 정리되어 있지 않다.
- `Auto / Speed (자동 / 속도)` 제어가 하나의 상태 UI로 정리되어 있지 않다.
- 첫 화면에서 정보가 많아 보이고, 모바일 방치형 RPG 첫인상과 거리가 있다.

## 3. Phase 1 Scope (1차 범위)

1차 구현은 `Hud.ts` 중심으로 진행한다.

포함:

- `RightMenuToggleState (우측 메뉴 접기 상태)` 추가
- `CombatControlToggleState (전투 제어 접기 상태)` 추가
- `CombatControlMode (전투 제어 모드)` UI 상태 추가
- 우측 메뉴 접힘/펼침 표시
- 전투 제어 접힘/펼침 표시
- 현재 선택된 전투 모드 아이콘만 표시
- 펼침 상태에서 `manual / auto / auto1_5 / auto2` 선택 UI 표시
- 선택된 모드 하이라이트 표시
- 잠금 또는 미래 해금 표시를 UI 상태로만 표현

제외:

- 실제 전투 속도 변경
- 실제 자동/수동 전투 로직 변경
- `CombatSystem` 수정
- `SkillSystem` 수정
- `RewardSystem` 수정
- `StageProgressSystem` 수정
- 저장 데이터 변경
- JSON 데이터 변경

## 4. Phase 2 Scope (2차 범위)

2차 구현은 1차 UI 상태가 확정된 뒤 별도 승인 후 진행한다.

후보:

- `CombatControlSystem (전투 제어 시스템)` 신규 생성
- 또는 `GameScene`에서 최소 상태만 연결
- `manual (수동)`일 때 자동 공격 일시 정지 여부 결정
- `auto (오토)`일 때 기존 속도 유지
- `auto1_5 (오토 x1.5)` 전투 업데이트 배율 적용
- `auto2 (오토 x2)` 전투 업데이트 배율 적용
- x1.5 / x2 해금 조건 또는 premium lock 처리

2차에서 검토할 핵심 질문:

```text
manual = 완전 수동 전투인가, 자동 진행 일시 정지인가?
auto = 현재 기본 자동 전투인가?
x1.5 / x2 = delta 배율인가, 공격 쿨타임 배율인가?
스킬 쿨타임도 속도 영향을 받는가?
저장/불러오기에서 선택 모드를 저장할 것인가?
```

## 5. CombatControlMode (전투 제어 모드)

1차 UI 상태 타입 후보:

```ts
type CombatControlMode = "manual" | "auto" | "auto1_5" | "auto2";
```

표시명:

| Mode | Korean Label | Meaning |
| --- | --- | --- |
| `manual` | `수동` | 수동 모드 |
| `auto` | `오토` | 기본 자동 전투 |
| `auto1_5` | `x1.5` | 1.5배속 후보 |
| `auto2` | `x2` | 2배속 후보 |

1차에서는 선택 상태만 바뀐다.
실제 전투 속도는 바뀌지 않는다.

## 6. RightMenuToggleState (우측 메뉴 접기 상태)

우측 메뉴 대상:

```text
Skill (스킬)
Equipment (장비)
Inventory (가방)
Quest (퀘스트)
```

접힘 상태:

```text
[Menu Icon]
또는
[Last Selected Menu Icon]
```

펼침 상태:

```text
[스킬]
[장비]
[가방]
[퀘스트]
```

1차에서는 실제 패널 열기 기능까지 구현하지 않고, 아이콘 메뉴의 접힘/펼침과 선택 표시만 구현한다.

## 7. CombatControlToggleState (전투 제어 접기 상태)

접힘 상태:

```text
[현재 선택 모드 아이콘]
예: [오토]
```

펼침 상태:

```text
[수동] [오토] [x1.5] [x2]
```

선택 시:

```text
선택 상태 변경
선택된 아이콘 하이라이트
선택 후 자동 접힘 가능
```

권장 UX:

- 클릭 1회: 펼침
- 모드 클릭: 선택 후 접힘
- 바깥 클릭 또는 동일 버튼 클릭: 접힘

## 8. UI Layout Draft (UI 배치 초안)

첫 화면 기준 배치:

```text
Top Area
- Stage / Region / Level / Gold / Diamond / HP

Center Combat Area
- O Gyejang (오계장)
- Monster
- Player HP bar
- Monster HP bar
- Minimal damage/effect space

Right Area
- Collapsible main menu icons
- Skill / Equipment / Inventory / Quest

Bottom Area
- Combat control collapsed/expanded widget
- Skill slots
- Equipped item quick slots
```

주의:

- 우측 영역에 긴 텍스트 로그를 다시 넣지 않는다.
- 하단 스킬 슬롯이 중앙 전투를 가리지 않게 한다.
- 전투 제어 UI는 하단 좌측 또는 하단 중앙에 고정한다.
- 1280x720에서 버튼이 작아지지 않게 한다.

## 9. Data / Logic Boundary (데이터 / 로직 경계)

1차 구현에서는 아래 값을 변경하지 않는다.

```text
player.hp
player.attack
player.defense
player.maxHp
player.exp
player.gold
monster.currentHp
monster.currentState
stage progress
skill cooldown
reward result
inventory
equipment
save data
```

1차 구현에서 변경 가능한 것은 HUD 내부 표시 상태뿐이다.

```text
rightMenuExpanded
combatControlExpanded
selectedCombatControlMode
selectedRightMenuKey
```

## 10. Deterministic Design Rule (확정성을 고려한 설계)

이번 UI 상태는 문자열을 흩뿌리지 않고 고정된 타입/상수로 관리한다.

권장:

```ts
const COMBAT_CONTROL_MODES = ["manual", "auto", "auto1_5", "auto2"] as const;
const RIGHT_MENU_ITEMS = ["skill", "equipment", "inventory", "quest"] as const;
```

목표:

- 같은 입력이면 같은 UI 상태가 나오게 한다.
- 업데이트 루프에서 랜덤하거나 비결정적인 표시를 만들지 않는다.
- 클릭 이벤트는 명확한 상태 전이만 수행한다.
- 모드명, 라벨, 아이콘 위치는 상수로 관리한다.
- 추후 실제 전투 로직 연결 시 기존 UI 상태를 그대로 재사용한다.

## 11. Performance Rule (성능 기준)

1차 구현 시 주의점:

- `update()`마다 버튼/이미지/텍스트를 새로 만들지 않는다.
- constructor 또는 create 단계에서 오브젝트를 한 번 만들고 `setVisible()`로 표시만 바꾼다.
- 선택 상태 변경 시에만 tint, alpha, scale, label을 갱신한다.
- 아이콘 그룹은 `Phaser.GameObjects.Container` 후보로 묶는다.
- hover/tooltip은 필요할 때만 표시한다.

## 12. Candidate Files To Change Later (추후 수정 후보 파일)

1차 구현 후보:

| File | Change |
| --- | --- |
| `src/ui/Hud.ts` | 우측 메뉴 접기/펼침, 전투 제어 접기/펼침, 선택 상태 표시 |
| `src/scenes/GameScene.ts` | 필요 시 HUD 이벤트 연결만 최소 수정 |
| `docs/UI_SYSTEM.md` | UI 상태만 구현했음을 문서화 |
| `docs/PROJECT_STATUS.md` | 1차 UI 상태 작업 완료 기록 |
| `files/Walkthrough/...CombatControlMenuToggleUI...md` | 구현 완료 보고서 |

가능하면 1차는 `Hud.ts` 중심으로 끝낸다.

## 13. Files Not To Change (수정 금지 파일)

1차 구현에서 수정 금지:

```text
src/systems/*
data/*.json
public/assets/**
README.md
docs/AGENT_HANDOFF.md
```

시스템 수정 금지:

```text
CombatSystem
SkillSystem
RewardSystem
EquipmentSystem
StageProgressSystem
PlayerGrowthSystem
SaveSystem
```

## 14. Implementation Order (구현 순서)

승인 후 권장 구현 순서:

1. `Hud.ts`에 UI 상태 타입과 상수 추가
2. 우측 메뉴 아이콘 오브젝트 생성
3. 우측 메뉴 접힘/펼침 처리
4. 전투 제어 모드 아이콘 오브젝트 생성
5. 전투 제어 접힘/펼침 처리
6. 선택된 전투 모드 하이라이트 처리
7. x1.5 / x2 잠금 또는 미래 해금 표시 추가
8. `update()`에서 매 프레임 새 오브젝트 생성이 없는지 점검
9. 문서와 Walkthrough 작성
10. typecheck/build 실행

## 15. Validation Method (검증 방법)

명령 검증:

```powershell
npm.cmd run typecheck
npm.cmd run build
```

금지 영역 확인:

```powershell
git diff -- src/systems data public/assets
```

수동 확인:

```text
우측 메뉴가 접히고 펼쳐지는지
스킬 / 장비 / 가방 / 퀘스트 아이콘이 보이는지
전투 제어가 접힘 상태에서 현재 선택 아이콘만 보이는지
전투 제어를 펼치면 수동 / 오토 / x1.5 / x2가 보이는지
선택된 모드가 하이라이트 되는지
실제 전투 속도는 변하지 않는지
전투 보상/스킬/장비/스테이지 진행이 기존과 동일한지
```

## 16. Expected Risks (예상 리스크)

- `Hud.ts`가 더 커질 수 있다.
- Phaser 텍스트와 아이콘이 겹칠 수 있다.
- 기존 하단 장비 아이콘 위치와 새 전투 제어 UI가 충돌할 수 있다.
- 실제 전투 속도 미반영 상태라 사용자가 혼동할 수 있다.
- `manual` 모드가 실제로는 아직 수동 전투가 아니므로 명확한 문서화가 필요하다.

대응:

- 1차 UI에는 `표시용` 상태라는 점을 문서화한다.
- 실제 전투 반영은 `Phase 2`로 분리한다.
- 레이아웃 충돌이 생기면 Battle Log 제거 후 우측/하단 영역을 다시 배치한다.

## 17. User Approval Checkpoint (사용자 승인 체크포인트)

구현 전 사용자가 확인해야 할 것:

```text
1차는 UI 상태만 구현한다.
실제 전투 속도는 변경하지 않는다.
전투 제어 모드는 수동 / 오토 / x1.5 / x2다.
우측 메뉴는 스킬 / 장비 / 가방 / 퀘스트다.
Battle Log는 첫 화면 우측 핵심 패널에서 제외한다.
CombatSystem / SkillSystem / RewardSystem은 수정하지 않는다.
```

## 18. Recommended Next Step (다음 추천 단계)

다음 작업:

```text
Combat Control / Menu Toggle UI Implementation v1
```

추천 구현 범위:

```text
Hud.ts 중심
UI 상태만 구현
전투 로직 연결 없음
Visual Validation deferred 가능
```
