# Agent Handoff (새 Codex 세션 인수인계)

Last updated: 2026-06-13 10:11:52

이 문서는 새 Codex 대화에서 현재 프로젝트 상태를 이어받기 위한 기준 문서입니다.

## Project Identity (프로젝트 정체성)

- Project path (프로젝트 경로): `C:\Users\jmj\Desktop\코덱스 자료\idle-rpg-mvp`
- Game title (게임 제목): `피곤해서 잠들었는데 일어나 보니 환생해서 어쩌다 수습기사 되어 이세계를 무쌍한다`
- Genre (장르): local idle RPG (로컬 기반 방치형 RPG)
- Tech stack (기술 스택): Phaser 3 + TypeScript + Vite + JSON data

## Working Rules (작업 원칙)

- Codex and Jeon Minjae build this project directly.
- Do not assume Hermes or Claude Code ownership for this repo.
- Code identifiers, filenames, classes, functions, and code comments must be English.
- Documentation and UI display text may use Korean.
- Important architecture terms should use `EnglishName (한글 설명)`.
- Do not concentrate logic in `GameScene`.
- Keep systems separated and data-driven with JSON.
- Consider performance while writing code.
- Do not move source files during documentation cleanup unless explicitly approved.

## Current Source Structure (현재 소스 구조)

```text
src/
├─ loaders/
│  └─ DataLoader.ts
├─ scenes/
│  └─ GameScene.ts
├─ systems/
│  ├─ CombatSystem.ts
│  ├─ DropResolver.ts
│  ├─ EquipmentSystem.ts
│  ├─ InventorySystem.ts
│  ├─ MonsterFactory.ts
│  ├─ MonsterPoolSystem.ts
│  ├─ PlayerGrowthSystem.ts
│  ├─ RandomService.ts
│  ├─ RewardResolver.ts
│  ├─ RewardSystem.ts
│  ├─ SaveSystem.ts
│  ├─ SkillSystem.ts
│  └─ StageProgressSystem.ts
├─ types/
│  └─ GameTypes.ts
├─ ui/
│  └─ Hud.ts
└─ main.ts
```

현재 `src/systems/`는 flat structure (평평한 구조)입니다. 목표 폴더 구조는 문서화되어 있지만 아직 소스 이동은 하지 않았습니다.

## Runtime Flow (런타임 흐름)

```text
StageData (스테이지 데이터)
-> MonsterPoolSystem (몬스터 풀 시스템)
-> MonsterData selected (몬스터 정적 데이터 선택)
-> MonsterFactory (몬스터 생성기)
-> MonsterInstance created (몬스터 런타임 객체 생성)
-> CombatSystem (전투 시스템)
-> MonsterDefeatedResult (몬스터 처치 결과)
-> RewardResolver (보상 계산기)
-> RewardSystem (보상 적용 시스템)
-> PlayerGrowthSystem (플레이어 성장 시스템)
-> InventorySystem (인벤토리 시스템)
-> EquipmentSystem (장비 시스템)
-> SkillSystem (스킬 시스템)
```

Combat flow (전투 흐름):

```text
PlayerState (기본 성장 스탯)
-> EquipmentSystem.calculateEffectiveStats (최종 스탯 계산)
-> EffectivePlayerStats (전투용 최종 스탯)
-> SkillSystem.update (자동 스킬 추가 공격)
-> CombatSystem.update (전투 계산)
```

## Current Implementation Boundary (현재 구현 경계)

Implemented (구현됨)

- Auto Combat (자동 전투)
- Monster Pool selection (몬스터 풀 선택)
- Monster runtime creation (몬스터 런타임 생성)
- Stage progression (스테이지 진행)
- Kill reward resolution (처치 보상 계산)
- Player growth (플레이어 성장)
- Equipment slots and effective stats (장비 슬롯과 최종 스탯)
- Auto skill trigger and cooldown (자동 스킬 발동과 쿨타임)
- Stage clear rewards (스테이지 클리어 보상)
- Inventory quantity storage (인벤토리 수량 저장)
- Local save/load (로컬 저장/불러오기)

Recently implemented (최근 구현)

- EquipmentSystem (장비 시스템)
- EquipmentState (장착 상태) 저장 fallback
- EffectivePlayerStats (최종 플레이어 스탯) 전투 반영
- MVP equipment items (MVP 장비 아이템) 3종
- Equipment data validation (장비 데이터 검증)
- Hud equipment display (장비 표시)
- SkillSystem (스킬 시스템)
- SkillData (스킬 정적 데이터) 2종
- SkillState (스킬 상태) 저장 fallback
- Hud skill cooldown display (스킬 쿨타임 표시)

Current Git note (Git 메모)

- Last pushed commit before SkillSystem work: `2a4b63f Add equipment system`
- SkillSystem changes may be uncommitted unless a later walkthrough or git log says otherwise.
- Ignored generated folders/files include `dist/`, `node_modules/`, and dev-server logs.
- There is an unrelated untracked note file under `files/` named like `EquipmentSystem (...) 구현 플랜.txt`; do not modify/delete it unless the user asks.

Not started (미시작)

- RebirthSystem (환생 시스템)
- JobSystem (전직 시스템)

## Validation Commands (검증 명령어)

```powershell
npm.cmd run typecheck
npm.cmd run build
```

Last validation before this handoff (이번 인수인계 전 마지막 검증)

- `npm.cmd run typecheck`: pass
- `npm.cmd run build`: normal sandbox run failed due access restriction, elevated run passed
- Vite chunk size warning remains; it is not a build failure.

## New Conversation Start Prompt (새 대화 시작 문구)

```text
C:\Users\jmj\Desktop\코덱스 자료\idle-rpg-mvp\docs\AGENT_HANDOFF.md 를 먼저 읽고,
현재 방치형 RPG 프로젝트 상태를 이어받아줘.
이번 작업 범위가 기능 구현인지 문서 정리인지 먼저 확인한 뒤 진행해줘.
```
