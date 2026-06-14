# Equipment / Material Icon HUD Integration Walkthrough v1

작성 시각: 2026-06-14 09:50:45
작업 범위: Equipped Equipment HUD icon only
커밋 메시지: Connect equipment HUD icons

## 구현 요약

Batch 2 Equipment / Material Icons 16개를 `ITEM_ICON_ASSETS`로 등록하고, 장착 장비 6슬롯 HUD 아이콘 표시만 연결했다.

이번 구현은 장착 장비 HUD 아이콘만 포함한다.
보유 장비 아이콘, 인벤토리 전체 아이콘 그리드, 재료 아이콘 표시, 보상 로그 아이콘화는 후속 작업으로 보류했다.

## 생성 파일

없음.

## 수정 파일

- `src/assets/AssetRegistry.ts`
  - `ITEM_ICON_ASSETS` 16개 추가
  - `ITEM_ICON_ASSET_LIST` 추가
  - `getItemIconAsset(itemId)` 추가

- `src/scenes/GameScene.ts`
  - `ITEM_ICON_ASSET_LIST` preload 추가

- `src/ui/Hud.ts`
  - 장착 장비 6슬롯 icon image object 추가
  - constructor에서 image/text object 1회 생성
  - update loop에서는 `setTexture`, `setVisible` 중심으로 갱신
  - 아이콘 누락 시 fallback `?` 표시
  - 빈 슬롯은 슬롯 박스와 짧은 label 유지

- `docs/UI_SYSTEM.md`
  - Equipment / Material Icon HUD Integration 상태 추가

- `docs/PROJECT_STATUS.md`
  - Equipped Equipment HUD icon v1 구현 상태 추가

## ITEM_ICON_ASSETS 구조

총 16개 itemId를 등록했다.

Equipment icons:

- `rusty_training_sword`
- `bent_training_spear`
- `chipped_training_axe`
- `dented_apprentice_helmet`
- `worn_apprentice_armor`
- `worn_apprentice_boots`
- `frayed_apprentice_necklace`
- `cracked_apprentice_ring`

Material icons:

- `trainee_medal`
- `soft_leaf`
- `mist_shard`
- `mist_core`
- `ogre_badge`
- `old_ore_fragment`
- `old_ore_core`
- `guardian_stone`

이번 v1에서는 material icons도 preload registry에는 포함하지만, HUD 표시에는 사용하지 않는다.

## 6슬롯 HUD 표시 방식

장착 장비 HUD slot:

```text
WPN / HELM / ARM / BOOT / NECK / RING
```

slot mapping:

```text
weapon -> WPN
helmet -> HELM
armor -> ARM
boots -> BOOT
necklace -> NECK
ring -> RING
```

아이콘 표시 규칙:

```text
equipped itemId 있음
-> getItemIconAsset(itemId)
-> texture 존재 확인
-> icon image 표시

icon asset 없음 또는 texture 없음
-> fallback ? 표시

empty slot
-> icon 숨김
-> fallback 숨김
-> slot box / label 유지
```

## 성능 처리

- 장비 icon image object는 `Hud` constructor에서 1회 생성한다.
- `update()`에서 `scene.add.image()`를 호출하지 않는다.
- texture key가 바뀔 때만 `setTexture()`를 호출한다.
- 매 프레임 6슬롯만 순회한다.

## 보류 항목

- Owned Equipment icon summary
- Inventory icon grid
- Material icon display
- Reward log icon display
- Tooltip / hover detail
- Drag and drop equipment UI

## 검증 결과

```powershell
npm.cmd run typecheck
```

결과: 통과

```powershell
npm.cmd run build
```

첫 실행은 sandbox 권한 문제로 Vite config 접근 실패.
권한 승인 후 재실행 결과: 통과

Build warning:

- Vite chunk size warning 발생
- Phaser bundle 크기 계열 경고로 보이며 이번 기능 실패는 아님

## 금지 영역 확인

```powershell
git diff -- src/systems data public/assets
```

결과: 변경 없음

## Visual Validation

Status: Deferred until browser/manual playtest

수동 확인 필요:

- 장착 장비 아이콘이 하단 패널에서 겹치지 않는지
- 빈 슬롯과 장착 슬롯이 구분되는지
- 아이콘이 32x32 표시에서도 읽히는지
- 장착 장비 변경 시 아이콘이 올바르게 갱신되는지

## 남은 TODO

1. 브라우저에서 6슬롯 HUD 아이콘 시각 확인
2. Owned Equipment icon summary 추가 여부 결정
3. Inventory / Reward icon UI는 별도 UI Panel Refinement v2로 분리 검토
