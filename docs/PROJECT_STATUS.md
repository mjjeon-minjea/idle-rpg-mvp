# Project Status

Last updated: 2026-06-14

## Current State

`idle-rpg-mvp`는 Phaser 3 + TypeScript + Vite 기반 로컬 방치형 RPG MVP다.

게임 제목:

```text
피곤해서 잠들었는데 일어나 보니 환생해서 어쩌다 수습기사 되어 이세계를 무쌍한다
```

주인공:

```text
오계장
```

## Implemented

- Phaser / Vite boot
- JSON data loading and validation
- Auto combat
- Monster runtime instance
- Monster pool selection
- Monster factory
- Stage progress
- Stage 1~9 content
- Reward resolver
- Drop resolver
- Reward system
- Player growth system
- Equipment system
- Equipment slot expansion
- Inventory quantity storage
- Skill system
- localStorage save/load
- Batch 1 monster assets
- Batch 2 equipment/material icon assets
- Batch 3 skill/combat effect assets
- Monster visual integration
- Equipped equipment HUD icon integration
- Basic skill/hit effect visual integration
- First screen HUD layout pass

## Current UI Direction

`First Screen UI Implementation v1` 기준으로 HUD 구조를 정리했다.

현재 방향:

- 우측 Battle Log 패널은 첫 화면에서 제외
- 우측 메뉴는 스킬 / 장비 / 가방 / 퀘스트 접힘/펼침 구조
- 하단 전투 제어는 수동 / 오토 / x1.5 / x2 구조
- 하단 스킬 슬롯은 6개 유지
- 상점 / 편지함은 상단 우측에 유지
- 전투 장면과 캐릭터/몬스터를 첫 화면 중심으로 유지

현재 전투 제어 UI는 표시 상태만 구현되어 있으며, 실제 전투 속도 변경은 아직 연결하지 않았다.

## Deferred

- Manual browser visual validation
- Actual combat speed integration
- Skill panel
- Equipment panel
- Inventory panel
- Quest panel
- Reward popup
- Stage clear popup
- Rebirth system
- Job system
- Skill upgrade system
- Region background asset integration

## Verification Commands

```powershell
npm.cmd run typecheck
npm.cmd run build
```

## Local Save Reset

MVP 개발 중 데이터 구조나 스테이지 순서가 바뀐 경우 기존 localStorage 저장 데이터가 현재 데이터와 맞지 않을 수 있다.

필요 시 브라우저 콘솔에서 아래 명령으로 초기화한다.

```js
localStorage.removeItem("idle-rpg-mvp-save");
location.reload();
```

## Notes

- `src/systems/*`는 이번 UI 작업에서 수정하지 않았다.
- `data/*.json`은 이번 UI 작업에서 수정하지 않았다.
- `public/assets/**`는 이번 UI 작업에서 수정하지 않았다.
- Visual Validation은 사용자가 브라우저에서 직접 확인하기 전까지 deferred로 유지한다.

