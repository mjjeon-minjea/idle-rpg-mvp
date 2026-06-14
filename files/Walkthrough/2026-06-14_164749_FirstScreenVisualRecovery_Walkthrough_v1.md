# First Screen Visual Recovery Walkthrough v1

Date: 2026-06-14 16:47

## Summary

브라우저 확인 결과 첫 화면이 승인된 UI mockup 방향과 크게 달랐다.

가장 큰 문제는 플레이어가 코드 기반 placeholder처럼 보이고, 스킬 이펙트가 화면을 과하게 가리며, 첫 화면이 아직 개발용 화면처럼 느껴지는 점이었다.

이번 작업은 게임 로직을 바꾸지 않고 첫 화면 시각 기반을 회복하는 데 한정했다.

## Changed Files

- `public/assets/characters/player/o_gyejang_idle.svg`
- `src/assets/AssetRegistry.ts`
- `src/scenes/GameScene.ts`
- `src/ui/Hud.ts`

## Implementation

- 임시 오계장 player asset을 추가했다.
- `AssetRegistry`에 `PLAYER_ASSETS`를 추가했다.
- `GameScene.preload()`에서 player SVG asset을 preload한다.
- `Hud`에서 전투 화면 플레이어와 좌상단 portrait를 player asset으로 표시한다.
- 이펙트 표시를 scale 값 기준에서 target pixel size 기준으로 변경했다.
- `trainee_slash`, `heavy_training_strike`, `basic_hit` 이펙트가 화면을 과하게 가리지 않도록 크기를 제한했다.
- 배경에는 추가 숲 형태를 보강해 개발용 빈 화면 느낌을 줄였다.

## Not Changed

- `src/systems/*` 수정 없음
- `data/*.json` 수정 없음
- 전투 피해량 변경 없음
- 보상/스킬 쿨타임/스테이지 진행 로직 변경 없음

## Validation

```powershell
npm.cmd run typecheck
```

Result: Passed.

```powershell
npm.cmd run build
```

Result: Passed.

```powershell
git diff -- src/systems data
```

Result: No diff.

## Remaining Risk

- `o_gyejang_idle.svg`는 최종 아트가 아니라 임시 시각 회복용 에셋이다.
- 최종 player PNG 제작과 연결은 별도 asset production 작업으로 진행해야 한다.
- Browser visual validation remains deferred.
