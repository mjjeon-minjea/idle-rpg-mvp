# First Screen Visual Foundation Fix Walkthrough v1

Date: 2026-06-14 16:30

## Summary

첫 화면 HUD 구현 후 브라우저 확인에서 검은 개발용 배경, 지나치게 큰 스킬 이펙트, 조악한 플레이어 placeholder가 확인되었다.

이번 작업은 게임 로직을 바꾸지 않고 화면 첫인상과 수동 확인 가능성을 보강하는 데 한정했다.

## Changed Files

- `src/scenes/GameScene.ts`
- `src/ui/Hud.ts`

## Implementation

- `GameScene`의 단색 검은 배경을 제거하고 Phaser Graphics 기반 임시 숲 전투 배경을 추가했다.
- 스킬/타격 이펙트 scale과 tween alpha를 줄여 화면 전체를 덮지 않게 조정했다.
- 이펙트 depth를 HUD보다 낮게 두어 UI를 가리지 않도록 정리했다.
- `Hud`의 플레이어 전투 placeholder와 좌상단 portrait placeholder를 더 캐릭터처럼 보이게 보강했다.

## Not Changed

- `src/systems/*` 수정 없음
- `data/*.json` 수정 없음
- `public/assets/**` 수정 없음
- 전투 피해량, 보상, 스킬 쿨타임, 스테이지 진행 로직 변경 없음

## Validation

```powershell
npm.cmd run typecheck
```

Result: Passed.

```powershell
npm.cmd run build
```

Result: Passed after rerun outside sandbox. The first sandboxed build failed because esbuild could not read the Vite config path under sandbox restrictions.

```powershell
git diff -- src/systems data public/assets
```

Result: No diff.

## Deferred

- Browser visual validation is still user-side deferred.
- This is still temporary graphics, not final art integration.
- Player final sprite integration remains a later asset task.
