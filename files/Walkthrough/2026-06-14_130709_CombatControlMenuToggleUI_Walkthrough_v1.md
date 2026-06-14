# Combat Control / Menu Toggle UI Walkthrough v1

작성일: 2026-06-14 13:07:09

## 구현 요약

`Hud.ts` 중심으로 1차 UI 상태만 구현했다.

이번 작업은 실제 전투 속도, 자동/수동 전투 로직, 보상, 스킬, 스테이지 진행을 바꾸지 않는다.

구현된 UI 상태:

- `RightMenuToggleState (우측 메뉴 접기 상태)`
- `CombatControlToggleState (전투 제어 접기 상태)`
- `CombatControlMode (전투 제어 모드)`

전투 제어 모드는 기획 확정 기준을 따른다.

```text
manual = 수동
auto = 오토
auto2 = 오토 x2
auto3 = 오토 x3
```

## 수정 파일

- `src/ui/Hud.ts`

## 우측 메뉴 접힘/펼침 동작

우측 메뉴 대상:

- 스킬
- 장비
- 가방
- 퀘스트

접힘 상태:

```text
메뉴 토글 버튼 1개만 표시
```

펼침 상태:

```text
스킬 / 장비 / 가방 / 퀘스트 버튼 표시
```

버튼 선택 시:

```text
선택된 버튼에 하이라이트 표시
실제 패널 열기는 아직 구현하지 않음
```

## 전투 제어 접힘/펼침 동작

전투 제어 대상:

- 수동
- 오토
- 오토 x2
- 오토 x3

접힘 상태:

```text
현재 선택된 전투 모드 버튼만 표시
```

펼침 상태:

```text
수동 / 오토 / x2 / x3 선택 UI 표시
```

선택 시:

```text
선택 상태 변경
선택된 모드 하이라이트 표시
선택 후 자동 접힘
```

`오토 x2`, `오토 x3`는 향후 해금 후보이므로 `잠금` 표시를 붙였다.

## 현재 선택 아이콘 표시 방식

현재 선택된 전투 모드는 `selectedCombatControlMode`로 보관한다.

선택 후보는 고정 배열로 관리한다.

```ts
type CombatControlMode = "manual" | "auto" | "auto2" | "auto3";
```

접힘 상태에서는 현재 선택된 모드의 짧은 표시명만 보인다.

```text
수동
오토
x2
x3
```

## 성능 처리

- 버튼 오브젝트는 생성자에서 1회 생성한다.
- `update()`마다 새 UI 오브젝트를 만들지 않는다.
- 접힘/펼침은 `setVisible()` 중심으로 처리한다.
- 선택 상태는 fill/stroke/alpha 변경으로만 표시한다.

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
built in 3.53s
```

Vite chunk size warning은 기존 번들 크기 경고이며 이번 UI 상태 작업의 실패는 아니다.

## 금지 영역 diff 확인

```powershell
git diff -- src/systems data public/assets
```

결과:

```text
변경 없음
```

## Visual Validation

브라우저 수동 확인은 아직 진행하지 않았다.

상태:

```text
deferred
```

수동 확인 항목:

- 우측 `메뉴` 버튼 클릭 시 스킬/장비/가방/퀘스트가 펼쳐지는지
- 우측 `접기` 클릭 시 메뉴가 접히는지
- 우측 메뉴 선택 시 하이라이트가 보이는지
- 전투 제어 접힘 상태에서 현재 선택 모드만 보이는지
- 전투 제어 펼침 상태에서 수동/오토/x2/x3가 보이는지
- 전투 제어 선택 후 자동 접힘이 되는지
- 실제 전투 속도가 바뀌지 않는지

## 남은 TODO

- 실제 전투 모드와 속도 반영은 2차 작업에서 진행한다.
- 2차 후보:
  - `CombatControlSystem`
  - 또는 `GameScene` 최소 연결
- `manual`, `auto`, `auto2`, `auto3`의 실제 전투 의미를 별도 설계해야 한다.
