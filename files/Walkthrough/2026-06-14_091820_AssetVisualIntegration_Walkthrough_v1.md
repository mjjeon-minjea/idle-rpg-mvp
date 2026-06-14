# Asset Visual Integration Walkthrough v1

작성 시각: 2026-06-14 09:18:20
작업 범위: Monster Visual Integration only
커밋 메시지: Connect monster visual assets

## 구현 요약

Batch 1 Monster assets를 Phaser 게임 화면에 연결했다.
이번 구현은 몬스터 이미지 표시만 포함하며, Batch 2 Equipment / Material Icons는 아직 HUD에 연결하지 않았다.

## 생성 파일

- `src/assets/AssetRegistry.ts`
  - `MONSTER_ASSETS` 정의
  - `MONSTER_ASSET_LIST` 정의
  - `getMonsterAsset(monsterId)` lookup helper 정의

## 수정 파일

- `src/scenes/GameScene.ts`
  - `preload()` 추가
  - `MONSTER_ASSET_LIST` 기반으로 몬스터 이미지를 preload

- `src/ui/Hud.ts`
  - 현재 몬스터의 `monster.data.id`로 이미지 표시
  - 이미지가 없거나 preload되지 않았을 경우 기존 role 기반 placeholder fallback 유지
  - normal / leader / boss / ancient boss 기준 표시 크기 분리

- `docs/UI_SYSTEM.md`
  - Monster Visual Integration v1 상태 추가
  - 장비/재료 아이콘 HUD 연결은 deferred로 명시

- `docs/PROJECT_STATUS.md`
  - Asset Visual Integration 구현 상태 추가
  - 시스템/data/public assets 변경 없음 원칙 기록

## AssetRegistry 구조

현재는 `MONSTER_ASSETS`만 구현했다.
`ITEM_ICON_ASSETS`는 구현하지 않았다.

경로 규칙:

```text
public/assets/monsters/normal/dawn_slime.png
-> runtime path: assets/monsters/normal/dawn_slime.png
```

## Monster Visual 표시 방식

```text
monster.data.id
-> getMonsterAsset(monster.data.id)
-> Phaser texture key 확인
-> 있으면 monsterImage.setTexture(asset.key)
-> 없으면 기존 placeholder circle 표시
```

이미지 오브젝트는 `Hud` constructor에서 1회 생성한다.
`update()`에서는 texture와 visibility만 갱신한다.

## Fallback 처리

- Monster asset mapping 없음: 기존 role 기반 placeholder 표시
- Texture preload 실패: 기존 role 기반 placeholder 표시
- 게임 로직 / 전투 / 보상 / 저장에는 영향 없음

## 보류 항목

- Equipment icon HUD connection
- Material icon HUD connection
- Inventory icon grid
- Reward log icon display
- 공식 UI 패널 재배치

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
- 기존 Phaser bundle 크기 계열 경고로 보이며 이번 기능 실패는 아님

## 금지 영역 확인

```powershell
git diff -- src/systems data public/assets
```

결과:

- `src/systems` 변경 없음
- `data` 변경 없음
- `public/assets/icons/equipment/cracked_apprentice_ring.png` diff 존재

주의:

- 위 ring PNG diff는 이번 작업에서 만든 변경이 아니라 이전 반지 투명도 수정분이 남아있는 상태다.
- 이번 커밋에는 포함하지 않는다.

## Visual Validation

Status: Deferred until browser/manual playtest

수동 확인 필요:

- 몬스터 이미지가 전투 중앙 영역에 보이는지
- normal / leader / boss 크기 구분이 적절한지
- HP bar와 이미지가 겹치지 않는지
- 1280x720 화면에서 가독성이 충분한지

## 남은 TODO

1. 브라우저에서 몬스터 이미지 표시 수동 확인
2. `cracked_apprentice_ring.png` 로컬 수정분 별도 커밋 여부 결정
3. 다음 단계로 Equipment / Material Icon HUD Integration Plan 또는 구현 승인
