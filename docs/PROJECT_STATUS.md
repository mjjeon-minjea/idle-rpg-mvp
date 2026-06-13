# Project Status (프로젝트 현재 상태)

Last updated: 2026-06-13

## Current State (현재 상태)

이 프로젝트는 Phaser 3 + TypeScript + Vite 기반 idle RPG MVP (방치형 RPG MVP)입니다.

## Implemented (구현됨)

- Game boot via Phaser/Vite (Phaser/Vite 실행)
- JSON data loading (JSON 데이터 로딩)
- Data validation (데이터 검증)
- Auto Combat (자동 전투)
- Monster Pool (몬스터 풀)
- Monster Factory (몬스터 생성)
- Stage Progress (스테이지 진행)
- Stage Content 1~9 (스테이지 1~9 콘텐츠)
- Reward Resolver (보상 계산)
- Drop Resolver (드랍 계산)
- Reward System (보상 적용)
- Player Growth System (플레이어 성장)
- Equipment System (장비 시스템)
- Skill System (스킬 시스템)
- Inventory quantity storage (인벤토리 수량 저장)
- localStorage save/load (로컬 저장/불러오기)
- HUD display (HUD 표시)
- Manual playtest checklist (수동 플레이 검증 체크리스트)
- MVP Visual Readability Pass (MVP 화면 가독성 개선)

## Partial (부분 구현)

- Boss flow (보스 흐름): 3개 보스 스테이지는 있으나 보스 전용 패턴은 없음
- Item drops (아이템 드랍): 기본 드랍과 고정 스탯 장비 드랍은 있으나 랜덤 옵션 장비는 없음
- Stage clear rewards (스테이지 클리어 보상): 기본 적용만 있음
- Skill system (스킬 시스템): 자동 발동 단일 대상 공격 스킬과 쿨타임은 구현됐으나 스킬 강화/트리/이펙트는 없음
- UI art (UI 아트): 수동 검증용 임시 패널/placeholder/HP bar만 있으며 정식 아트는 없음

## Documented / Designed (문서화/설계됨)

- MonsterData vs MonsterInstance
- SingleEntityMonster MVP scope
- SegmentedMonster future extension
- Reward responsibility boundary
- Future source folder structure
- Advanced equipment farming structure

## Not Started (미시작)

- RebirthSystem (환생 시스템)
- JobSystem (전직 시스템)

## Current Verification Commands (현재 검증 명령어)

```powershell
npm.cmd run typecheck
npm.cmd run build
```

## Important Note (중요 메모)

`idle-rpg-mvp` 폴더는 Git repository (Git 저장소)로 초기화되어 있으며, `origin/main`은 GitHub 저장소 `mjjeon-minjea/idle-rpg-mvp`를 추적합니다.

Stage data expansion (스테이지 데이터 확장) 후 기존 localStorage 저장 데이터는 현재 스테이지 위치가 어긋날 수 있습니다. MVP 개발 중에는 필요 시 브라우저 콘솔에서 아래 명령으로 저장 데이터를 초기화합니다.

```js
localStorage.removeItem("idle-rpg-mvp-save");
location.reload();
```

Stage 1~9 브라우저 수동 검증은 `docs/MANUAL_PLAYTEST_CHECKLIST.md`를 기준으로 진행한다.

현재 화면 가독성 개선은 정식 아트 제작이 아니라 `MVP Visual Readability Pass (MVP 화면 가독성 개선)`이다.

## Balance Patch 1 (밸런스 패치 1)

Status: No Data Patch (데이터 패치 없음)

Reason: Current Stage 1~9 numbers are suitable for later Manual Validation (수동 검증)에 사용하기 적합하다.

Watch Point (주시 항목):

- Stage 9 boss death/reset feel (Stage 9 보스 사망/회복 체감)
- Armor impact (방어구 장착 체감)

Decision (결정):

- `data/*.json`은 아직 수정하지 않는다.
- Gold economy (골드 경제)는 gold sink (골드 소비처)가 없으므로 아직 조정하지 않는다.
- Korean Display Text Fix (한글 표시 문자열 수정)는 Balance Patch 1에 섞지 않고 별도 작업 후보로 분리한다.
- CombatSystem / RewardSystem / PlayerGrowthSystem / EquipmentSystem / SkillSystem / StageProgressSystem 구조는 유지한다.
