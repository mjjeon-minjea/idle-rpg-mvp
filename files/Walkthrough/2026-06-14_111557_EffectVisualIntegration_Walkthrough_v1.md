# Effect Visual Integration Walkthrough v1

작성 시각: 2026-06-14 11:15:57

## 구현 요약

Batch 3 Skill / Combat Effects 중 1차 범위인 `trainee_slash`, `heavy_training_strike`, `basic_hit` 3종을 전투 화면 표시용으로 연결했다.

이번 작업은 표시 전용 작업이다. 피해량, 보상, 스킬 쿨타임, 저장 데이터, 스테이지 진행 로직은 변경하지 않았다.

## 수정 파일

- `src/assets/AssetRegistry.ts`
- `src/scenes/GameScene.ts`
- `docs/UI_SYSTEM.md`
- `docs/PROJECT_STATUS.md`
- `files/Walkthrough/2026-06-14_111557_EffectVisualIntegration_Walkthrough_v1.md`

## 연결한 이펙트 3종

| Effect ID | 연결 시점 | 방식 |
| --- | --- | --- |
| `trainee_slash` | `SkillSystem` 결과의 `skillId`가 `trainee_slash`일 때 | 단일 PNG + Phaser tween |
| `heavy_training_strike` | `SkillSystem` 결과의 `skillId`가 `heavy_training_strike`일 때 | 단일 PNG + Phaser tween |
| `basic_hit` | `CombatSystem.update()` 결과에서 일반 공격 피해가 발생했을 때 | 단일 PNG + Phaser tween |

## 보류한 이펙트 5종

아래 이펙트는 `AssetRegistry.ts`에 등록하고 `GameScene.preload()`에서 preload만 한다. 실제 화면 표시 연결은 후속 작업으로 보류했다.

- `critical_hit`
- `monster_defeat`
- `level_up`
- `item_drop`
- `gold_gain`

## 구현 방식

- `EFFECT_ASSETS` 8종을 `AssetRegistry.ts`에 추가했다.
- `GameScene.preload()`에서 effect assets를 preload한다.
- 이벤트 발생 시에만 effect image object를 생성한다.
- tween 흐름은 scale / rotation / fade out 중심으로 구성했다.
- tween 완료 후 effect image는 `destroy()` 처리한다.
- 매 프레임 새 오브젝트를 만들지 않는다.

## 유지한 제한

- `src/systems/*` 수정 없음
- `data/*.json` 수정 없음
- `public/assets/**` 수정 없음
- `README.md` 수정 없음
- `docs/AGENT_HANDOFF.md` 수정 없음
- sprite sheet 미사용
- particle effect 미사용

## 검증 결과

```powershell
npm.cmd run typecheck
```

결과: 통과

```powershell
npm.cmd run build
```

1차 실행 결과: 샌드박스 파일 접근 제한으로 실패

```text
Cannot read directory "../../..": Access is denied.
Could not resolve ".../vite.config.ts"
```

권한 승격 후 재실행 결과: 통과

```text
vite v7.3.5 building client environment for production...
33 modules transformed.
built in 3.80s
```

참고: Vite bundle size warning은 발생했지만 build 실패는 아니다.

## 금지 영역 diff 확인

```powershell
git diff -- src/systems data public/assets
```

결과: diff 없음

## Visual Validation

Deferred.

브라우저에서 아래 항목은 사용자가 나중에 직접 확인해야 한다.

- 스킬 이펙트가 몬스터 위치에 자연스럽게 표시되는지
- HP bar 또는 텍스트를 과하게 가리지 않는지
- `trainee_slash`와 `heavy_training_strike`가 서로 구분되는지
- `basic_hit`이 일반 공격 피드백으로 충분히 읽히는지

## 다음 추천 단계

브라우저 수동 확인을 나중에 진행한 뒤, 문제가 없으면 나머지 5종 이펙트 표시 연결 계획으로 넘어간다.
