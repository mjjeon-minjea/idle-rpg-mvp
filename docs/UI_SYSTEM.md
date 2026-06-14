# UI System

Last updated: 2026-06-14

## Purpose

`Hud`는 현재 게임 상태를 플레이어가 빠르게 이해할 수 있게 보여주는 화면 표시 계층이다.

`Hud`는 전투 결과, 보상, 성장, 장비 계산을 직접 바꾸지 않는다. 게임 규칙은 각 시스템이 담당하고, `Hud`는 전달받은 값을 표시한다.

## Current Scope

현재 HUD는 `First Screen UI Implementation v1` 기준으로 정리되어 있다.

주요 표시 영역:

- 상단 좌측: 오계장 이름, 레벨, HP
- 상단 중앙: 현재 스테이지, 지역, 진행 목표
- 상단 우측: 골드, 다이아, 상점, 편지함
- 중앙 전투 영역: 오계장, 현재 몬스터, HP bar
- 우측 메뉴: 스킬 / 장비 / 가방 / 퀘스트 접힘/펼침 UI
- 하단 좌측: 전투 제어 UI
- 하단 중앙: 스킬 슬롯 6개
- 좌측 보조 정보: 공격/방어/EXP, 장비 보너스, 간단한 인벤토리 요약

## Right Menu

우측 메뉴는 첫 화면에서 긴 전투 로그를 대체한다.

구성:

```text
접힘 상태:
- 메뉴 버튼 1개

펼침 상태:
- 스킬
- 장비
- 가방
- 퀘스트
```

현재는 UI 상태만 구현되어 있다.

보류:

- 실제 스킬 패널 열기
- 실제 장비 패널 열기
- 실제 가방 패널 열기
- 실제 퀘스트 패널 열기
- hover tooltip

## Combat Control

전투 제어 UI는 하단 좌측에 있다.

모드:

```text
manual = 수동
auto = 오토
auto1_5 = x1.5
auto2 = x2
```

현재는 UI 상태만 구현되어 있다.

보류:

- 실제 수동 전투 전환
- 실제 자동 전투 전환
- 실제 x1.5 / x2 속도 적용
- x1.5 / x2 해금 조건

## Skill Slots

하단 중앙에 스킬 슬롯 6개를 표시한다.

현재 연결:

- `trainee_slash`
- `heavy_training_strike`

빈 슬롯은 잠금 상태로 표시한다.

## Asset Display

현재 HUD에 연결된 asset:

- Batch 1 monster assets
- Batch 2 equipped equipment icons
- Batch 3 basic skill / hit effects
- Batch 5 region backgrounds

아이콘이나 이미지가 없으면 fallback 표시를 사용한다.

## Deferred Visual Validation

브라우저 수동 확인은 아직 deferred 상태다.

확인할 항목:

- 우측 메뉴 접힘/펼침이 잘 보이는지
- 전투 제어 접힘/펼침이 잘 보이는지
- 하단 스킬 슬롯 6개가 겹치지 않는지
- 몬스터 이미지와 HP bar가 겹치지 않는지
- 1280x720 화면에서 텍스트가 겹치지 않는지
- 전체 화면이 개발자 테스트 대시보드처럼 보이지 않는지

## Region Background Visual Integration

Batch 5 지역 배경 3장이 게임 화면 배경으로 연결되었다.

연결 기준:

```text
dawn_forest_* -> bg_dawn_forest
mist_gate_* -> bg_mist_gate
old_mine_* -> bg_old_mine
```

구현 방식:

- `AssetRegistry.ts`의 `REGION_BACKGROUND_ASSETS`에서 배경 key/path를 관리한다.
- `GameScene.preload()`에서 지역 배경 이미지를 preload한다.
- `GameScene`은 현재 stage id prefix를 기준으로 배경 texture를 선택한다.
- 배경 이미지는 가장 뒤 레이어에 배치한다.
- stage/region이 바뀌면 기존 image object의 texture만 교체한다.
- 배경 누락 시 기존 단색 fallback 배경을 사용한다.

Visual Validation:

- 브라우저 수동 확인은 deferred 상태다.
- Stage 1~9 진행 중 지역별 배경 전환과 캐릭터/몬스터/이펙트 가독성은 추후 직접 확인한다.
