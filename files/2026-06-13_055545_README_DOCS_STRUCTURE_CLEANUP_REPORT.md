# 2026-06-13 05:55:45 - README / Docs / Folder Structure Cleanup Report

## Inspection Summary (점검 요약)

Existing files checked:

- `README.md`
- `package.json`
- `src/main.ts`
- `src/scenes/GameScene.ts`
- `src/types/GameTypes.ts`
- `src/loaders/DataLoader.ts`
- `src/systems/CombatSystem.ts`
- `src/systems/DropResolver.ts`
- `src/systems/InventorySystem.ts`
- `src/systems/MonsterFactory.ts`
- `src/systems/MonsterPoolSystem.ts`
- `src/systems/RandomService.ts`
- `src/systems/RewardResolver.ts`
- `src/systems/RewardSystem.ts`
- `src/systems/SaveSystem.ts`
- `src/systems/StageProgressSystem.ts`
- `data/gameConfig.json`
- `data/monsters.json`
- `data/monsterPools.json`
- `data/dropTables.json`
- `data/stages.json`
- `data/rewards.json`
- `data/items.json`
- `docs/`

Repository status:

- `git status --short` was executed inside `idle-rpg-mvp`.
- Result: this folder is not a Git repository.
- Because of that, file change status cannot be reported through Git inside this project folder.

README mismatch found:

- README was too detailed for a project entry document.
- README mixed high-level overview and detailed system architecture.
- README had `docs/HANDOFF_SUMMARY.md` as the active handoff document, but the requested canonical name is `docs/AGENT_HANDOFF.md`.
- README described the future source folder direction, but actual source files are still flat under `src/systems/`.
- README did not include the newly required canonical docs `docs/AGENT_HANDOFF.md` and `docs/MONSTER_REFACTOR_PLAN.md`.

Missing folders/files found:

- `docs/AGENT_HANDOFF.md` was missing.
- `docs/MONSTER_REFACTOR_PLAN.md` was missing.
- `files/` did not exist before this task.

Files or folders that need moving/renaming:

- No source files were moved or renamed in this task.
- `docs/HANDOFF_SUMMARY.md` was kept as a short redirect note instead of being deleted, following Option B from the prompt.

Imports that would need updates if source files are moved later:

- `src/scenes/GameScene.ts` imports all current system files from `../systems/*`.
- If `src/systems/` is split into `combat/`, `monster/`, `reward/`, `stage/`, `random/`, `inventory/`, and `save/`, imports in `GameScene.ts` must be updated.
- Future movement may also affect imports inside `src/systems/**`, `src/types/**`, and `src/loaders/DataLoader.ts` if types or validators are split later.

## Changes Made (변경 내용)

README.md:

- Rewritten as a high-level project entry document.
- Added clear sections:
  - `Current Implemented Scope (현재 구현 범위)`
  - `Development Commands (개발 명령어)`
  - `Project Structure Summary (프로젝트 구조 요약)`
  - `Documentation Map (문서 지도)`
  - `Next Work (다음 작업)`
- Separated feature states:
  - `Implemented (구현됨)`
  - `Partial (부분 구현)`
  - `Documented / Designed (문서화/설계됨)`
  - `Planned (예정)`
- Added `files/` to the actual project structure after creating the report folder.
- Clarified that PlayerGrowthSystem is the next recommended task but was not implemented in this task.

docs:

- Created `docs/AGENT_HANDOFF.md` as the canonical handoff document.
- Created `docs/MONSTER_REFACTOR_PLAN.md`.
- Rewrote `docs/MONSTER_SYSTEM.md` in architecture-document style with diagrams and role comments.
- Rewrote `docs/DATA_SCHEMA.md` with required schemas and validation rules.
- Updated `docs/COMBAT_SYSTEM.md`, `docs/STAGE_SYSTEM.md`, `docs/REWARD_SYSTEM.md`, `docs/INVENTORY_SYSTEM.md`, `docs/SAVE_SYSTEM.md`, `docs/SCENE_STRUCTURE.md`, `docs/UI_SYSTEM.md`, and `docs/PROJECT_STATUS.md`.
- Changed `docs/HANDOFF_SUMMARY.md` into a short redirect note pointing to `docs/AGENT_HANDOFF.md`.

src:

- No source files were moved.
- No gameplay feature was implemented.
- No import path was changed.

data:

- No data files were changed.
- Existing data schema was documented and aligned with current code.

Skill and rules:

- Created a reusable Codex skill:
  - `C:\Users\jmj\.codex\skills\idle-rpg-docs-cleanup\SKILL.md`
- The skill captures the cleanup rules:
  - inspect before editing
  - compare README/docs with actual files
  - do not implement new gameplay systems during docs cleanup
  - keep reward responsibility boundaries
  - validate with `npm.cmd run typecheck` and `npm.cmd run build`
- Skill validation result:
  - `Skill is valid!`

## Files Created (생성 파일)

- `docs/AGENT_HANDOFF.md`
- `docs/MONSTER_REFACTOR_PLAN.md`
- `files/2026-06-13_055545_README_DOCS_STRUCTURE_CLEANUP_REPORT.md`
- `C:\Users\jmj\.codex\skills\idle-rpg-docs-cleanup\SKILL.md`

## Files Modified (수정 파일)

- `README.md`
- `docs/HANDOFF_SUMMARY.md`
- `docs/MONSTER_SYSTEM.md`
- `docs/DATA_SCHEMA.md`
- `docs/COMBAT_SYSTEM.md`
- `docs/STAGE_SYSTEM.md`
- `docs/REWARD_SYSTEM.md`
- `docs/INVENTORY_SYSTEM.md`
- `docs/SAVE_SYSTEM.md`
- `docs/SCENE_STRUCTURE.md`
- `docs/UI_SYSTEM.md`
- `docs/PROJECT_STATUS.md`

## Files Moved/Renamed (이동/이름 변경 파일)

- None.

## Validation Result (검증 결과)

`npm.cmd run typecheck`:

```text
PASS
tsc --noEmit completed successfully.
```

`npm.cmd run build`:

First run:

```text
FAIL due to sandbox access.
Cannot read directory "../../..": Access is denied.
Could not resolve vite.config.ts.
```

Second run with elevated execution:

```text
PASS
vite built successfully.
```

Final re-run after adding the `files/` report folder to README:

```text
npm.cmd run typecheck: PASS
npm.cmd run build: PASS with elevated execution
```

Build warning:

```text
Some chunks are larger than 500 kB after minification.
```

This is a Vite/Phaser bundle size warning, not a build failure.

## Remaining TODO (남은 작업)

- Source folder migration is still only documented, not implemented.
- `src/systems/` is still flat.
- Future migration should update imports safely.
- Electron console still does not automatically display `http://127.0.0.1:5173`.
- PlayerGrowthSystem, EquipmentSystem, SkillSystem, RebirthSystem, and JobSystem are still not implemented.

## Next Recommended Task (다음 추천 작업)

Do not continue to PlayerGrowthSystem inside this cleanup task.

Recommended next separate task:

```text
PlayerGrowthSystem (플레이어 성장 시스템)
-> exp requirement (경험치 요구량)
-> level up (레벨업)
-> stat growth (스탯 성장)
-> RewardSystem integration (보상 적용 시스템 연동)
```
