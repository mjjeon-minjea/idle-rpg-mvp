# Manual Browser Verification Support & Korean Log Encoding Fix Walkthrough v1

작성 시각: 2026-06-13 11:32:28

## 구현 요약

이번 작업은 새 시스템 구현 없이 `Manual Browser Verification Support & Korean Log Encoding Fix` 범위만 진행했다.

목표:

- `GameScene (게임 씬)` 전투 로그 문구를 자연스러운 한국어로 정리
- `Hud (화면 표시 UI)`의 사용자 표시 라벨을 한국어 중심으로 정리
- 직접 브라우저 수동 검증을 위한 체크리스트 문서 추가
- `SaveSystem (저장 시스템)` 수동 검증 방법 문서화
- README/docs 문서에 수동 검증 흐름 연결

변경하지 않은 것:

- CombatSystem (전투 시스템)
- RewardResolver (보상 계산기)
- RewardSystem (보상 적용 시스템)
- PlayerGrowthSystem (플레이어 성장 시스템)
- EquipmentSystem (장비 시스템)
- SkillSystem (스킬 시스템)
- SaveSystem (저장 시스템) 로직
- JSON 밸런스 수치

## 생성 파일

- `docs/MANUAL_PLAYTEST_CHECKLIST.md`
- `files/Walkthrough/2026-06-13_113228_ManualBrowserVerificationSupportKoreanLogFix_Walkthrough_v1.md`

## 수정 파일

- `src/scenes/GameScene.ts`
- `src/ui/Hud.ts`
- `docs/UI_SYSTEM.md`
- `docs/SAVE_SYSTEM.md`
- `docs/PROJECT_STATUS.md`
- `README.md`

## Korean Log / UI 변경

`src/scenes/GameScene.ts`:

- `스킬 발동: ... / 피해 ...`
- `기본 공격 피해 ... / 몬스터 반격 피해 ...`
- `처치 보상 EXP ... / 골드 ... / 아이템 ...개`
- `스테이지 클리어 보상 EXP ... / 골드 ...`
- `교체 장비: ...`

`src/ui/Hud.ts`:

- `전투 단계`에서 `normal / leader / boss` 대신 한국어 라벨 표시
  - `일반 몬스터`
  - `리더 몬스터`
  - `보스 몬스터`
- 몬스터 `Role / State` 라벨을 `역할 / 상태`로 변경
- monster state (몬스터 상태)를 한국어로 표시
  - `생성 중`
  - `대기`
  - `공격 중`
  - `기절`
  - `사망`
- `Total`을 `누적`으로 변경
- `Gold`를 `골드`로 변경
- `Bonus`를 `장비 보너스`로 변경

## Manual Playtest Checklist 문서

`docs/MANUAL_PLAYTEST_CHECKLIST.md`에 아래 내용을 추가했다.

- 개발 서버 실행 방법
- Vite 포트가 바뀌는 경우 확인 방법
- localStorage save reset (저장 데이터 초기화) 명령
- 기본 화면 확인 항목
- Stage 1~9 진행 순서
- Stage 1~2 normal -> leader -> clear 확인
- Stage 3 / 6 / 9 boss 확인
- Stage 3 / 6 / 9 보장 보상 확인
- Lv 3 이후 skill unlock / skill cooldown 확인
- equipment bonus (장비 보너스) 확인
- save/load (저장/불러오기) 확인
- reward duplication (보상 중복 지급) 확인
- 스테이지별 balance record format (밸런스 기록 양식)

## SaveSystem 문서 보강

`docs/SAVE_SYSTEM.md`에 수동 저장 검증 방법을 추가했다.

브라우저 콘솔 확인 명령:

```js
JSON.parse(localStorage.getItem("idle-rpg-mvp-save"));
```

저장 데이터에 있어야 할 핵심 키:

```text
player
inventory
equipment
skills
stage
```

## README / Status 문서 보강

`README.md`:

- Documentation Map (문서 지도)에 `docs/MANUAL_PLAYTEST_CHECKLIST.md` 추가
- 다음 기능으로 넘어가기 전 Stage 1~9 실제 브라우저 수동 검증을 먼저 진행하도록 문구 추가

`docs/PROJECT_STATUS.md`:

- Manual playtest checklist (수동 플레이 검증 체크리스트)를 implemented 항목에 추가
- Stage 1~9 수동 검증 문서 위치 안내 추가

`docs/UI_SYSTEM.md`:

- 수동 검증 기준 문서 링크 추가
- HUD에서 확인할 핵심 UI 목록 추가

## 검증 결과

Typecheck:

```powershell
npm.cmd run typecheck
```

결과:

```text
pass
```

Build:

```powershell
npm.cmd run build
```

일반 sandbox 실행 결과:

```text
Access is denied
Could not resolve vite.config.ts
```

승인 권한 실행 결과:

```text
pass
```

Vite warning:

```text
Some chunks are larger than 500 kB after minification.
```

해석:

- 일반 sandbox build 실패는 이전과 같은 Vite/esbuild 접근 권한 문제다.
- 승인 권한 build는 통과했으므로 이번 변경으로 인한 TypeScript/build 오류는 확인되지 않았다.

## 남은 TODO

1. 사용자가 `docs/MANUAL_PLAYTEST_CHECKLIST.md`를 기준으로 실제 브라우저 수동 검증 진행
2. Stage 1~9에서 한글 표시가 실제 화면에서도 정상인지 확인
3. `localStorage` 저장/불러오기 유지 확인
4. 보상 중복 지급 여부를 실제 전투 로그에서 확인
5. 수동 검증 결과에 따라 밸런스 수치 조정 여부 결정

## Git 상태 참고

이번 작업으로 수정/추가된 파일 외에 기존 미추적 파일이 남아 있다.

```text
files/EquipmentSystem (장비 시스템) 구현 플랜.txt
files/Walkthrough/2026-06-13_110807_Stage1-9ManualPlaytestBalanceCheck_Walkthrough_v1.md
```

이 파일들은 이번 작업 범위에서 수정하지 않았다.

