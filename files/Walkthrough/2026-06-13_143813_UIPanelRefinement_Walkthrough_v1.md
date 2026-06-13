# 2026-06-13 14:38:13 - UI Panel Refinement Walkthrough v1

## Summary (요약)

`UI Panel Refinement (UI 패널 개선)`을 최소 범위로 구현했다.

목표는 Stage 1~9 manual validation (수동 검증) 중 현재 게임 상태와 전투 흐름을 더 쉽게 읽을 수 있게 만드는 것이다.

## Changed Files (수정 파일)

- `src/ui/Hud.ts`
- `src/scenes/GameScene.ts`
- `docs/UI_SYSTEM.md`
- `docs/MANUAL_PLAYTEST_CHECKLIST.md`
- `docs/PROJECT_STATUS.md`

## Preserved Files (보존 파일)

아래 파일/범위는 수정하지 않았다.

- `src/systems/*`
- `data/*.json`

## HUD Changes (HUD 변경)

추가/개선된 정보:

- Current Stage / Region / Objective (현재 스테이지 / 지역 / 목표)
- Monster Type (몬스터 타입): Normal / Leader / Boss
- Player Level / EXP / Next EXP (플레이어 레벨 / 경험치 / 다음 레벨까지 경험치)
- Player HP with Base + Equip split (기본 체력 + 장비 체력 구분)
- Effective ATK / DEF with Base + Equip split (최종 공격력/방어력 구분)
- Equipped Equipment (장착 장비)
- Owned Equipment summary (보유 장비 요약)
- Skill Cooldown status (스킬 쿨타임 상태)
- Inventory summary (인벤토리 요약)

## Battle Log Changes (전투 로그 변경)

전투 로그에 category tag (분류 태그)를 추가했다.

Examples:

```text
[Skill] trainee_slash dealt 43 damage
[Combat] Basic 25 / Counter 12
[Defeat] mist_guardian
[Reward] EXP 78 / Gold 67 / Items 1
[Clear] Stage reward EXP 135 / Gold 160
[Equip] worn_apprentice_armor
[Reset] Player HP reached 0 and auto-recovered
```

## Death / Reset Log (사망 / 회복 로그)

`CombatSystem (전투 시스템)`은 수정하지 않았다.

대신 `GameScene (게임 씬)`에서 combat update (전투 갱신) 전 HP와 playerDamage (플레이어 피해량)를 비교해 HP가 0 이하가 되는 tick을 감지하고 `[Reset]` 로그를 표시한다.

## Not Included (이번 작업에 포함하지 않음)

- Game Logic (게임 로직) 변경
- Balance Patch (밸런스 패치)
- `data/*.json` 변경
- System refactor (시스템 리팩토링)
- Korean Display Text Fix (한글 표시 문자열 수정)
- Formal Image / Animation / Effect (정식 이미지 / 애니메이션 / 이펙트)

## Validation (검증)

Executed:

```powershell
npm.cmd run typecheck
npm.cmd run build
git diff -- src/systems data
git status --short
```

## Manual Check Items (사용자 확인 항목)

- 1280 x 720 화면에서 텍스트가 겹치지 않는지
- Stage / Region / Objective가 한눈에 보이는지
- Normal / Leader / Boss 구분이 텍스트로 보이는지
- Equipped Equipment와 Owned Equipment가 구분되는지
- Skill cooldown 상태가 이해되는지
- Battle Log category tag가 전투 흐름 이해에 도움이 되는지
- Stage 9 boss에서 reset 발생 시 `[Reset]` 로그가 보이는지

## Remaining TODO (남은 TODO)

- Korean Display Text Fix (한글 표시 문자열 수정)는 별도 작업으로 분리한다.
- 정식 이미지 / 애니메이션 / 이펙트 작업은 UI 정보 구조가 안정된 뒤 진행한다.

