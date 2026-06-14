# Combat Control Speed Options Fix Walkthrough v1

작성일: 2026-06-14 13:22:34

## 구현 요약

전투 제어 UI의 배속 후보를 최종 기획 기준에 맞게 수정했다.

기존 구현:

```text
manual = 수동
auto = 오토
auto2 = 오토 x2
auto3 = 오토 x3
```

수정 후:

```text
manual = 수동
auto = 오토
auto1_5 = 오토 x1.5
auto2 = 오토 x2
```

`x3`는 MVP 단계에서 너무 빠를 수 있으므로 제거했다.

## 수정 파일

- `src/ui/Hud.ts`

## 전투 제어 모드 최종 목록

```ts
type CombatControlMode = "manual" | "auto" | "auto1_5" | "auto2";
```

UI 표시명:

```text
수동
오토
x1.5
x2
```

## 유지한 정책

- `x1.5`, `x2`는 향후 해금 후보로 `잠금` 표시를 유지한다.
- 실제 전투 속도 로직은 아직 연결하지 않는다.
- 이번 작업은 HUD 표시 상태만 수정한다.

## 변경하지 않은 항목

- `CombatSystem`
- `SkillSystem`
- `RewardSystem`
- `StageProgressSystem`
- `PlayerGrowthSystem`
- `EquipmentSystem`
- `SaveSystem`
- `data/*.json`
- `public/assets/**`

## 문서 확인

`CombatControlMenuToggleUIPlan_v1.md`는 이미 `auto1_5 / auto2` 기준으로 작성되어 있어 수정하지 않았다.

직전 Walkthrough는 당시 구현 기록이므로 직접 수정하지 않고, 이번 Walkthrough에 변경 이력을 새로 남겼다.

`docs/UI_SYSTEM.md`, `docs/PROJECT_STATUS.md`에는 현재 전투 제어 배속 상세 문구가 없어 수정하지 않았다.

## 검증 결과

```powershell
npm.cmd run typecheck
```

결과:

```text
PASS
```

```powershell
npm.cmd run build
```

최초 실행은 sandbox 권한 문제로 실패했다.

```text
Cannot read directory "../../..": Access is denied.
Could not resolve vite.config.ts
```

권한 상승 후 재실행 결과:

```text
PASS
33 modules transformed.
built in 3.65s
```

Vite chunk size warning은 기존 번들 크기 경고이며 이번 UI 표시 수정의 실패는 아니다.

```powershell
git diff -- src/systems data public/assets
```

결과:

```text
변경 없음
```

추가 검색:

```powershell
rg -n "auto3|오토 x3|\bx3\b" src docs/UI_SYSTEM.md docs/PROJECT_STATUS.md files/plan/2026-06-14_124121_CombatControlMenuToggleUIPlan_v1.md
```

결과:

```text
검색 결과 없음
```

## Visual Validation

브라우저 수동 확인은 아직 진행하지 않았다.

상태:

```text
deferred
```

수동 확인 항목:

- 전투 제어 펼침 상태에 `수동 / 오토 / x1.5 / x2`가 보이는지
- `x3`가 더 이상 보이지 않는지
- 선택 후 접힘 상태에서 현재 선택값만 보이는지
- 실제 전투 속도는 아직 변하지 않는지
