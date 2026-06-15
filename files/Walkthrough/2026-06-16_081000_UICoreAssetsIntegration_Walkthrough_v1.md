# UI Core Assets Integration Walkthrough v1

작성 시각: 2026-06-16 08:10

## 작업 요약

`public/assets/ui/core/`에 저장된 승인 UI core asset 11개를 첫 화면 UI에 연결했다.

이번 작업은 UI 표시 개선만 포함한다.
읽기 전용 패널 4종, 실제 스킬/장비/가방/퀘스트 기능, 실제 전투 속도 변경은 구현하지 않았다.

## 기준 브랜치

```text
ui-first-screen-core-rework-v1
```

## 연결한 UI Asset

```text
public/assets/ui/core/collapse_chevron_button.png
public/assets/ui/core/right_menu_panel.png
public/assets/ui/core/skill_menu_icon.png
public/assets/ui/core/equipment_menu_icon.png
public/assets/ui/core/inventory_menu_icon.png
public/assets/ui/core/quest_menu_icon.png
public/assets/ui/core/expand_menu_icon.png
public/assets/ui/core/skill_slot_bar_6.png
public/assets/ui/core/skill_slot_active.png
public/assets/ui/core/skill_slot_locked.png
public/assets/ui/core/combat_control_collapsed.png
```

## 구현 내용

1. `AssetRegistry.ts`
- `UI_CORE_ASSETS` registry를 추가했다.
- UI core asset key/path 목록을 한 곳에서 관리하도록 했다.

2. `GameScene.ts`
- UI core asset preload를 추가했다.
- 1280x720 캡처에서 브라우저 스크롤바가 보이지 않도록 페이지 margin/overflow 표시를 정리했다.

3. `Hud.ts`
- 우측 메뉴에 `right_menu_panel`과 4개 메뉴 아이콘을 적용했다.
- 우측 메뉴 접힘/펼침 버튼에 `collapse_chevron_button`, `expand_menu_icon`을 적용했다.
- 하단 스킬 슬롯 6칸에 `skill_slot_bar_6`, `skill_slot_active`, `skill_slot_locked`를 적용했다.
- 전투 제어 접힘 상태에 `combat_control_collapsed`를 적용했다.
- 실제 스킬 슬롯은 기존처럼 2개만 활성 표시하고, 나머지 4칸은 locked slot으로 유지했다.

## 구현하지 않은 내용

```text
읽기 전용 패널 4종
실제 스킬 강화
실제 장비 교체
실제 가방 기능
실제 퀘스트 보상
실제 전투 속도 변경
수동 전투 구현
보상 팝업
스테이지 클리어 팝업
레벨업 연출
```

## Visual Validation

결과: pass

확인 방식:
- Vite dev server를 127.0.0.1 기준으로 실행
- Chrome headless 캡처로 1280x720 화면 확인
- 기본 화면, 우측 메뉴 펼침, 우측 메뉴 접힘, 하단 스킬 슬롯, 전투 제어 접힘 상태를 확인

스크린샷:

```text
files/Walkthrough/2026-06-16_075000_UICoreAssetsIntegration_base.png
files/Walkthrough/2026-06-16_075000_UICoreAssetsIntegration_right_menu_expanded.png
files/Walkthrough/2026-06-16_073500_UICoreAssetsIntegration_right_menu_collapsed.png
files/Walkthrough/2026-06-16_075000_UICoreAssetsIntegration_skill_slots_6.png
files/Walkthrough/2026-06-16_075000_UICoreAssetsIntegration_combat_control_collapsed.png
```

확인 결과:

```text
목표 시안 방향과 더 가까워짐: pass
우측 메뉴가 통짜 패널처럼 보임: pass
메뉴 아이콘 4개가 잘 보임: pass
하단 스킬 슬롯 6칸 유지: pass
활성 슬롯 / 잠금 슬롯 구분: pass
오계장과 몬스터가 UI에 묻히지 않음: pass
상단 정보와 겹치지 않음: pass
브라우저 스크롤바 제거: pass
```

비고:
- Chrome CDP 자동 클릭 캡처 중 일부 시도에서 Chrome extension target을 잡는 문제가 있었다.
- 최종 보고에는 실제 게임 화면이 정상 캡처된 파일만 사용한다.

## 검증 결과

```powershell
npm.cmd run typecheck
```

결과: pass

```powershell
npm.cmd run build
```

결과: pass

Vite chunk size warning은 기존 경고이며 build 실패가 아니다.

## 금지 영역 확인

아래 영역에는 이번 작업 변경이 없다.

```text
src/systems
data
public/assets/monsters
public/assets/icons
public/assets/effects
public/assets/backgrounds
README.md
```

`docs/AGENT_HANDOFF.md`는 기존 보류 수정 상태가 남아 있으나, 이번 작업에서 수정하지 않았고 커밋 대상에서 제외한다.

## 커밋 대상

```text
src/assets/AssetRegistry.ts
src/scenes/GameScene.ts
src/ui/Hud.ts
docs/UI_SYSTEM.md
docs/PROJECT_STATUS.md
public/assets/ui/core/*.png
files/Walkthrough/2026-06-16_081000_UICoreAssetsIntegration_Walkthrough_v1.md
```

스크린샷 PNG는 검증 근거로 남기되 커밋 대상에는 포함하지 않는다.

## 다음 추천 단계

1. 실제 브라우저에서 사용자가 한 번 더 육안 확인
2. 통과 시 UI Core Assets Integration v1을 기준으로 다음 UI 작업 계획 수립
3. 읽기 전용 패널 4종은 별도 Plan 승인 후 진행
