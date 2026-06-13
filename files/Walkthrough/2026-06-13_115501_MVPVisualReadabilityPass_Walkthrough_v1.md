# MVP Visual Readability Pass Walkthrough v1

작성 시각: 2026-06-13 11:55:01

## 구현 요약

`MVP Visual Readability Pass (MVP 화면 가독성 개선)` 작업을 진행했다.

이번 작업은 정식 아트 제작이 아니라 Stage 1~9 manual playtest (수동 플레이 검증)를 쉽게 하기 위한 임시 화면 정리다.

변경한 것:

- 1280 x 720 기준 게임 캔버스 적용
- Top / Left / Center / Right / Bottom 영역으로 HUD 분리
- Player placeholder (플레이어 임시 표시) 추가
- Monster placeholder (몬스터 임시 표시) 추가
- Normal / Leader / Boss 몬스터 색상, 크기 구분
- Player HP Bar (플레이어 체력 바) 추가
- Monster HP Bar (몬스터 체력 바) 추가
- Battle Log (전투 로그)를 오른쪽 패널에 고정
- Skill / Equipment / Inventory 표시를 하단 영역으로 정리
- UI 관련 문서와 수동 검증 체크리스트 갱신

변경하지 않은 것:

- CombatSystem (전투 시스템)
- RewardSystem (보상 시스템)
- RewardResolver (보상 계산기)
- PlayerGrowthSystem (플레이어 성장 시스템)
- EquipmentSystem (장비 시스템)
- SkillSystem (스킬 시스템)
- SaveSystem (저장 시스템)
- 밸런스 수치
- 정식 이미지/애니메이션/이펙트

## 수정 파일

- `src/main.ts`
- `src/scenes/GameScene.ts`
- `src/ui/Hud.ts`
- `docs/UI_SYSTEM.md`
- `docs/MANUAL_PLAYTEST_CHECKLIST.md`
- `docs/PROJECT_STATUS.md`
- `README.md`
- `files/Walkthrough/2026-06-13_115501_MVPVisualReadabilityPass_Walkthrough_v1.md`

## 화면 레이아웃 변경

기준 해상도를 `960 x 540`에서 `1280 x 720`으로 변경했다.

화면 영역:

```text
Top Area (상단 영역)
- Game title
- Current stage name
- Stage progress

Left Panel (왼쪽 패널)
- Player level
- Player HP bar
- ATK / DEF
- EXP / Gold

Center Area (중앙 전투 영역)
- Player placeholder
- Monster placeholder
- Monster HP bar
- Current target name
- Monster role / state

Right Panel (오른쪽 패널)
- Battle log

Bottom Area (하단 영역)
- Skill cooldowns
- Equipment slots
- Inventory summary
```

## Placeholder Visuals 구성

정식 이미지는 추가하지 않고 Phaser Graphics 기반 도형만 사용했다.

```text
Player (플레이어)
- 파란색 knight placeholder

Normal Monster (일반 몬스터)
- 초록색 원

Leader Monster (리더 몬스터)
- 노란색 원
- 일반 몬스터보다 크게 표시

Boss Monster (보스 몬스터)
- 빨간색 원
- 가장 크게 표시
```

각 placeholder 근처에 이름 라벨을 표시한다.

## HP Bar 구성

플레이어와 몬스터 모두 HP bar를 표시한다.

```text
Player HP: current / max
Monster HP: current / max
```

HP bar 색상:

- 기본: green
- 30% 이하: red

## HUD 변경

주요 개선:

- 전투 로그를 오른쪽 패널에 고정
- 최근 로그 최대 8줄 표시
- 스킬 쿨타임은 하단 `Skills (스킬)` 영역에 표시
- 장비 슬롯은 하단 `Equipment (장비)` 영역에 표시
- 장비 보너스는 `HP / ATK / DEF` 요약으로 표시
- 인벤토리는 하단 요약으로 표시
- 몬스터 역할과 상태는 한국어/영문 혼합 라벨로 표시

## 문서 변경

`docs/UI_SYSTEM.md`:

- `MVP Visual Readability Pass (MVP 화면 가독성 개선)` 섹션 추가
- 현재 화면이 정식 아트가 아니라 수동 검증용 임시 화면임을 명시
- 화면 영역과 placeholder 색상 규칙 문서화

`docs/MANUAL_PLAYTEST_CHECKLIST.md`:

- HP bar 확인 항목 추가
- Player / Monster placeholder 확인 항목 추가
- Normal / Leader / Boss 색상/크기/라벨 확인 항목 추가
- 1280 x 720 기준 텍스트 겹침 확인 항목 추가

`docs/PROJECT_STATUS.md`:

- MVP Visual Readability Pass 구현 상태 추가
- 정식 UI art는 아직 없다는 부분 구현 상태 추가

`README.md`:

- 현재 HUD가 수동 검증용 임시 가독성 개선 상태임을 추가

## typecheck/build 결과

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

일반 sandbox 실행:

```text
Access is denied
Could not resolve vite.config.ts
```

승인 권한 실행:

```text
pass
```

Vite warning:

```text
Some chunks are larger than 500 kB after minification.
```

## 사용자가 확인할 항목

브라우저 주소:

```text
http://127.0.0.1:5174/
```

확인 항목:

```text
1. 텍스트 겹침이 제거되었는지
2. 플레이어와 몬스터가 화면에서 구분되는지
3. HP bar가 보이는지
4. 스킬/장비/전투 로그가 한눈에 보이는지
5. Stage 1~9 수동 검증이 가능한 화면인지
```

저장 초기화가 필요하면 브라우저 콘솔에서 실행:

```js
localStorage.removeItem("idle-rpg-mvp-save");
location.reload();
```

## 남은 TODO

- 실제 브라우저 화면에서 가독성 확인
- 작은 브라우저 창에서 텍스트 잘림 여부 확인
- Stage 1~9 수동 검증 결과에 따라 UI/Log Fix 또는 Balance Patch 1 판단
- 정식 아트/애니메이션/스킬 이펙트는 아직 보류

