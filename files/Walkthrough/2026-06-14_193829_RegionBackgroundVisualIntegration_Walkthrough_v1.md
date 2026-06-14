# Region Background Visual Integration Walkthrough v1

작성 시각: 2026-06-14 19:38:29

## 구현 요약

Batch 5 지역 배경 3장을 실제 게임 화면 배경으로 연결했다.

이번 구현은 stage id prefix를 기준으로 배경을 선택한다.
`data/stages.json`에는 `backgroundId`를 추가하지 않았다.

## 수정 파일

```text
src/assets/AssetRegistry.ts
src/scenes/GameScene.ts
docs/UI_SYSTEM.md
docs/PROJECT_STATUS.md
files/Walkthrough/2026-06-14_193829_RegionBackgroundVisualIntegration_Walkthrough_v1.md
```

`src/ui/Hud.ts`는 수정하지 않았다.

## Stage ID -> Background 매핑

```text
dawn_forest_* -> bg_dawn_forest
mist_gate_* -> bg_mist_gate
old_mine_* -> bg_old_mine
```

## 구현 내용

### AssetRegistry

`REGION_BACKGROUND_ASSETS`와 `REGION_BACKGROUND_ASSET_LIST`를 추가했다.

또한 `getRegionBackgroundAsset(stageId)`를 추가해 stage id prefix 기준으로 배경 asset을 찾도록 했다.

### GameScene

`preload()`에서 지역 배경 3장을 preload한다.

배경은 가장 뒤 레이어에 image object 1개로 표시한다.
stage/region이 바뀌면 새 image object를 만들지 않고 기존 image object의 texture만 교체한다.

### Fallback

배경 asset이 없거나 texture가 preload되지 않은 경우에는 기존 단색 fallback 배경을 표시한다.

## 보류한 것

이번 작업에서는 아래 기능을 구현하지 않았다.

- `data/stages.json`에 `backgroundId` 추가
- 배경 전환 애니메이션
- parallax scrolling
- 날씨 효과
- 지역 입장 연출
- UI/HUD 레이아웃 변경

## 검증 결과

```powershell
npm.cmd run typecheck
```

결과: 통과

```powershell
npm.cmd run build
```

결과: 통과

참고:

- 일반 샌드박스 build는 Vite config 접근 제한으로 실패할 수 있어 승인 모드에서 재실행했다.
- Vite chunk size warning은 남아 있지만 build 실패는 아니다.

## 금지 영역 확인

아래 명령 기준 diff 없음:

```powershell
git diff -- src/systems data public/assets
```

수정하지 않은 영역:

- `src/systems/*`
- `data/*.json`
- `public/assets/**`
- `docs/AGENT_HANDOFF.md`
- 기존 보류 파일

## Visual Validation

Visual Validation: deferred

아직 브라우저 수동 확인은 진행하지 않았다.

추후 확인할 항목:

- Stage 1~3에서 Dawn Forest 배경 표시
- Stage 4~6에서 Mist Gate 배경 표시
- Stage 7~9에서 Old Mine 배경 표시
- 캐릭터, 몬스터, HP bar가 배경에 묻히지 않는지
- 스킬/전투 이펙트가 배경 위에서 잘 보이는지

## 다음 추천 작업

다음 추천 작업은 브라우저 수동 확인 또는 `Region Background Visual Polish`다.

단, 현재는 Visual Validation을 deferred로 유지하고 다음 시스템/아트 작업으로 넘어갈 수 있다.
