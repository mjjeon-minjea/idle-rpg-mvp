# UI System (UI 시스템)

## Purpose (목적)

`Hud (화면 표시 UI)`는 MVP 상태를 화면에 표시한다.

## Current Responsibility (현재 책임)

- Game title (게임 제목)
- Current stage (현재 스테이지)
- Encounter type (전투 대상 종류)
- Player stats (플레이어 스탯)
- Current exp / required exp / total exp (현재 경험치 / 필요 경험치 / 누적 경험치)
- Effective stats and equipment bonus (최종 스탯과 장비 보너스)
- Equipped items by slot (슬롯별 장착 장비)
- Skill cooldowns and level requirements (스킬 쿨타임과 레벨 조건)
- Monster stats (몬스터 스탯)
- Inventory entries (인벤토리 목록)
- Combat log (전투 로그)
- HP Bar (체력 바)
- Placeholder visuals (임시 전투 표시)

## MVP Visual Readability Pass (MVP 화면 가독성 개선)

현재 UI는 정식 아트 작업이 아니라 Stage 1~9 manual playtest (수동 플레이 검증)를 위한 임시 가독성 개선 상태다.

화면은 아래 영역으로 나뉜다.

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

임시 전투 표시:

```text
Player (플레이어): blue rectangle placeholder
Normal Monster (일반 몬스터): green circle
Leader Monster (리더 몬스터): yellow circle, larger than normal
Boss Monster (보스 몬스터): red circle, largest
```

현재 목표 해상도는 `1280 x 720`이다. 정식 캐릭터 이미지, 몬스터 이미지, 애니메이션, 스킬 이펙트는 아직 구현하지 않는다.

## Current Risk (현재 위험)

- Final art direction (최종 아트 방향)은 아직 없다.
- Responsive layout (반응형 레이아웃)은 아직 최소 수준이며, 현재 기준 해상도는 1280 x 720이다.
- Electron console integration (Electron 콘솔 연동)은 아직 없다.

UI 문구는 한국어를 사용할 수 있다. 코드 식별자와 주석은 영어를 유지한다.

## Skill Display (스킬 표시)

MVP 1 uses simple text display (1차 MVP는 간단한 텍스트 표시를 사용한다).

```text
스킬
수습 베기: 준비됨
묵직한 수련 일격: 3.2s
```

If level requirement is not met (레벨 조건을 만족하지 못하면):

```text
묵직한 수련 일격: Lv 3 필요
```

## Manual Verification (수동 검증)

브라우저에서 실제 HUD 표시를 확인할 때는 `docs/MANUAL_PLAYTEST_CHECKLIST.md`를 기준으로 진행한다.

확인할 핵심 UI:

- Stage progress (스테이지 진행도)
- Encounter type (전투 단계)
- Effective stats (최종 스탯)
- Equipment bonus (장비 보너스)
- Skill cooldown (스킬 쿨타임)
- Combat log (전투 로그)
- Player / Monster HP bars (플레이어 / 몬스터 체력 바)
- Player / Monster placeholders (플레이어 / 몬스터 임시 표시)

사용자에게 보이는 UI 문구와 전투 로그는 자연스러운 한국어를 사용한다. 코드 식별자, 파일명, 타입명은 영어를 유지한다.

## UI Panel Refinement (UI 패널 개선)

이번 개선은 정식 이미지 / 애니메이션 / 이펙트 작업이 아니라 Manual Validation (수동 검증)을 위한 HUD 정보 구조 개선이다.

추가/개선된 표시 정보:

- Current Stage / Region / Objective (현재 스테이지 / 지역 / 목표)
- Monster Type (몬스터 타입): Normal / Leader / Boss
- Player Level / EXP / Next EXP (플레이어 레벨 / 경험치 / 다음 레벨까지 경험치)
- Player HP with base/equipment split (기본 체력과 장비 체력 구분)
- Effective ATK / DEF with base/equipment split (최종 공격력/방어력과 기본/장비 구분)
- Equipped Equipment (장착 장비)
- Owned Equipment summary (보유 장비 요약)
- Skill Cooldown status (스킬 쿨타임 상태)
- Battle Log category tags (전투 로그 분류 태그)

Death / Reset log (사망 / 회복 로그)는 CombatSystem 구조를 바꾸지 않고, 전투 전 HP와 받은 피해량을 비교하는 방식으로 GameScene에서 표시한다.

## Asset Visual Integration (에셋 시각 연결)

Status: Monster Visual Integration v1 implemented.

이번 단계는 `Batch 1 Monster assets`만 게임 화면에 연결한다.
`Batch 2 Equipment / Material Icons`는 아직 HUD에 연결하지 않는다.

적용 범위:

- `src/assets/AssetRegistry.ts`에서 `MONSTER_ASSETS`를 관리한다.
- `GameScene.preload()`에서 몬스터 이미지를 Phaser texture로 preload한다.
- `Hud`는 현재 몬스터의 `monster.data.id`를 기준으로 이미지 texture를 표시한다.
- 몬스터 이미지가 없거나 preload되지 않은 경우 기존 role 기반 placeholder를 fallback으로 사용한다.

보류:

- 장비 아이콘 HUD 표시
- 재료 아이콘 HUD 표시
- 보상 로그 아이콘화
- 인벤토리 아이콘 그리드

Manual visual validation:

브라우저에서 몬스터 이미지 크기, HP bar 겹침, normal / leader / boss 구분 가독성을 별도 확인해야 한다.

## Equipment / Material Icon HUD Integration (장비 / 재료 아이콘 HUD 연결)

Status: Equipped Equipment HUD icon v1 implemented.

이번 단계는 `Batch 2 Equipment / Material Icons` 중 장착 장비 6슬롯 아이콘 표시만 게임 HUD에 연결한다.
재료 아이콘, 인벤토리 전체 아이콘 그리드, 보상 로그 아이콘 표시는 아직 연결하지 않는다.

적용 범위:

- `src/assets/AssetRegistry.ts`에서 `ITEM_ICON_ASSETS` 16개를 관리한다.
- `GameScene.preload()`에서 item icon assets를 Phaser texture로 preload한다.
- `Hud`는 장착 장비 6슬롯에 해당하는 아이콘만 표시한다.
- 장비 아이콘이 없거나 preload되지 않은 경우 슬롯 박스와 fallback `?` 표시를 사용한다.
- 빈 슬롯은 슬롯 박스와 짧은 슬롯 라벨만 유지한다.

6슬롯 표시:

```text
WPN / HELM / ARM / BOOT / NECK / RING
```

보류:

- 보유 장비 아이콘 목록
- 인벤토리 전체 아이콘 그리드
- 재료 아이콘 HUD 표시
- 보상 로그 아이콘화
- tooltip / hover detail

Manual visual validation:

브라우저에서 6슬롯 아이콘이 하단 패널에서 겹치지 않는지, 빈 슬롯과 장착 슬롯이 구분되는지 별도 확인해야 한다.

## Effect Visual Integration (이펙트 시각 연결)

Status: Basic skill and hit effects connected.

이번 단계는 `Batch 3 Skill / Combat Effects` 중 3종만 전투 화면에 표시한다.

연결된 이펙트:

- `trainee_slash`: `SkillSystem` 결과의 `skillId`가 `trainee_slash`일 때 표시한다.
- `heavy_training_strike`: `SkillSystem` 결과의 `skillId`가 `heavy_training_strike`일 때 표시한다.
- `basic_hit`: `CombatSystem.update()` 결과에서 일반 공격 피해가 발생했을 때 표시한다.

보류된 이펙트:

- `critical_hit`
- `monster_defeat`
- `level_up`
- `item_drop`
- `gold_gain`

구현 방식:

- 단일 PNG + Phaser tween 방식을 사용한다.
- sprite sheet와 particle effect는 아직 사용하지 않는다.
- 이펙트는 표시 전용이며 피해량, 보상, 쿨타임, 전투 결과를 바꾸지 않는다.
- 이벤트가 발생한 순간에만 image object를 생성하고 tween 완료 후 destroy한다.
- 매 프레임 새 이펙트 오브젝트를 만들지 않는다.

Manual visual validation:

브라우저에서 이펙트 위치, 크기, HP bar 겹침, 몬스터 이미지 가림 정도를 별도로 확인해야 한다.
