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
- Reward Resolver (보상 계산)
- Drop Resolver (드랍 계산)
- Reward System (보상 적용)
- Player Growth System (플레이어 성장)
- Equipment System (장비 시스템)
- Inventory quantity storage (인벤토리 수량 저장)
- localStorage save/load (로컬 저장/불러오기)
- HUD display (HUD 표시)

## Partial (부분 구현)

- Boss flow (보스 흐름): 스테이지 흐름은 있으나 보스 전용 패턴은 없음
- Item drops (아이템 드랍): 기본 드랍과 고정 스탯 장비 드랍은 있으나 랜덤 옵션 장비는 없음
- Stage clear rewards (스테이지 클리어 보상): 기본 적용만 있음

## Documented / Designed (문서화/설계됨)

- MonsterData vs MonsterInstance
- SingleEntityMonster MVP scope
- SegmentedMonster future extension
- Reward responsibility boundary
- Future source folder structure
- Advanced equipment farming structure

## Not Started (미시작)

- SkillSystem (스킬 시스템)
- RebirthSystem (환생 시스템)
- JobSystem (전직 시스템)

## Current Verification Commands (현재 검증 명령어)

```powershell
npm.cmd run typecheck
npm.cmd run build
```

## Important Note (중요 메모)

`idle-rpg-mvp` 폴더는 Git repository (Git 저장소)로 초기화되어 있으며, `origin/main`은 GitHub 저장소 `mjjeon-minjea/idle-rpg-mvp`를 추적합니다.
