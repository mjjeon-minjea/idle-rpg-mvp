# Project Status

Last updated: 2026-06-14

## First Screen UI Polish Implementation v1

Status: implemented, Visual Validation deferred.

이번 작업은 새 기능 추가가 아니라 첫 화면 가독성과 첫인상 개선이다.

반영 내용:

- 왼쪽 정보 패널의 높이, 투명도, 텍스트 크기를 줄였다.
- 중앙 전투 영역의 반투명 박스를 더 작고 옅게 조정했다.
- 우측 메뉴는 기본 펼침 상태를 유지하되 버튼 크기와 위치를 정리했다.
- 전투 제어는 기본 접힘 상태를 유지하고 현재 선택 모드만 보이게 했다.
- 하단 스킬 슬롯 6칸은 유지하되 크기와 간격을 줄였다.
- 장비 아이콘 슬롯 간격을 정리했다.
- 스킬 / 기본 타격 이펙트 표시 크기를 낮췄다.

수정하지 않은 영역:

- `src/systems/*`
- `data/*.json`
- `public/assets/**`
- 실제 전투 속도 로직
- 실제 메뉴 패널 열기
- 보상/스테이지 클리어/레벨업 팝업

다음 확인:

- 브라우저에서 1280x720 기준 첫 화면 가독성 확인
- 우측 메뉴 펼침 상태와 전투 제어 접힘 상태 확인
- 스킬 이펙트가 캐릭터/몬스터를 과도하게 가리지 않는지 확인

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
- Region background visual integration

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

## Region Background Visual Integration

Status: implemented, Visual Validation deferred.

연결된 배경:

```text
dawn_forest_* -> bg_dawn_forest
mist_gate_* -> bg_mist_gate
old_mine_* -> bg_old_mine
```

구현 내용:

- Batch 5 지역 배경 3장을 `AssetRegistry.ts`에 등록했다.
- `GameScene.preload()`에서 지역 배경 이미지를 preload한다.
- stage id prefix 기준으로 현재 지역 배경을 선택한다.
- 배경은 가장 뒤 레이어에 표시된다.
- 배경 누락 시 단색 fallback 배경을 유지한다.

보류:

- 실제 브라우저에서 Stage 1~9 지역별 배경 전환 확인
- Electron preview에서 배경 스케일 확인
- 캐릭터, 몬스터, 이펙트, HUD 가독성 확인
