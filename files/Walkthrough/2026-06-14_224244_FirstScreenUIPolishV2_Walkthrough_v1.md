# First Screen UI Polish v2 Walkthrough

작성 시각: 2026-06-14 22:42

## 구현 요약

First Screen UI Polish v1 실제 화면 검증에서 스킬/타격 이펙트가 하단 스킬 슬롯을 크게 덮는 문제가 확인되었다.

이번 v2에서는 전투 결과나 시스템 로직을 바꾸지 않고, 표시 전용 영역만 수정했다.

## 수정 파일

- `src/scenes/GameScene.ts`
- `src/ui/Hud.ts`
- `docs/UI_SYSTEM.md`
- `docs/PROJECT_STATUS.md`

## 포함된 로더 수정

플레이어 에셋은 현재 PNG 파일이므로 `this.load.svg()`가 아니라 `this.load.image()`로 로드한다.

이 수정은 Phaser `SVGFile.onProcess` 오류를 막기 위해 v2 커밋에 포함한다.

## 이펙트 표시 조정

- `trainee_slash` 표시 크기를 줄였다.
- `heavy_training_strike` 표시 크기를 줄였다.
- `basic_hit` 표시 크기를 줄였다.
- 이펙트 depth를 HUD보다 낮게 유지했다.
- 이펙트 위치는 몬스터 주변 전투 지점 기준으로 유지했다.

## 실제 원인

거대하게 보이던 화면 덮개는 전투 이펙트만의 문제가 아니었다.

`Hud.ts`의 스킬 슬롯 이미지가 `setTexture()` 이후 원본 이미지 크기로 다시 표시되면서 하단 UI를 크게 덮었다.

수정 후 스킬 슬롯 아이콘은 매 업데이트마다 62x62 크기로 고정된다.

## Visual Validation

결과: pass

확인 방식:

- Edge headless browser
- 1280x720 screenshot
- Vite dev server: `http://127.0.0.1:5174/`

스크린샷:

- `files/Walkthrough/2026-06-14_222930_FirstScreenUIPolishV2_Validation_DawnForest.png`
- `files/Walkthrough/2026-06-14_222930_FirstScreenUIPolishV2_Validation_TimeCheck.png`

확인 내용:

- 오계장과 몬스터가 먼저 보인다.
- 지역 배경이 캐릭터/몬스터를 묻지 않는다.
- 우측 메뉴는 기본 펼침 상태로 유지된다.
- 전투 제어는 기본 접힘 상태로 유지된다.
- 하단 스킬 슬롯 6칸이 유지된다.
- 스킬 슬롯 아이콘이 원본 크기로 튀지 않는다.
- 스킬/타격 이펙트가 하단 스킬 슬롯을 과하게 가리지 않는다.

## 검증 명령

아래 명령을 실행한다.

```powershell
npm.cmd run typecheck
npm.cmd run build
git diff -- src/systems data public/assets
```

## 금지 영역 확인

아래 영역은 수정하지 않았다.

- `src/systems/*`
- `data/*.json`
- `public/assets/**`
- `README.md`
- `docs/AGENT_HANDOFF.md`

## 남은 TODO

- Old Mine 화면은 이번 v2에서 직접 강제 이동 검증하지 않았다.
- 이후 Stage별 수동 검증에서 지역별 배경과 이펙트 가독성을 다시 확인한다.
- 실제 전투 속도 변경, 메뉴 패널 열기, 보상 팝업, 스테이지 클리어 팝업은 아직 구현하지 않는다.
