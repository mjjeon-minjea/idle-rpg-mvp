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
