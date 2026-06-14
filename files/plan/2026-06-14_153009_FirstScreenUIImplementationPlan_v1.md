# First Screen UI Implementation Plan v1

작성일: 2026-06-14 15:30:09

## 1. Goal (목표)

확정된 `First Screen Combat UI Mockup v3` 기준을 실제 게임 HUD에 반영한다.

이번 작업은 게임 로직 구현이 아니라 첫 화면 UI 구조 개선이다.

핵심 목표:

- 첫 화면이 개발자 테스트 대시보드처럼 보이지 않게 한다.
- 중앙 전투 영역을 가장 먼저 보이게 한다.
- 우측 메뉴는 접힘/펼침 구조를 유지한다.
- 하단은 스킬 슬롯 6개와 전투 제어 UI를 안정적으로 배치한다.
- 상점 / 편지함은 상단 우측에 유지한다.
- 전투 제어는 `수동 / 오토 / x1.5 / x2` 기준으로 표시한다.
- `CombatSystem`, `RewardSystem`, `SkillSystem`, `EquipmentSystem`, `StageProgressSystem` 로직은 변경하지 않는다.

## 2. Confirmed Mockup Rule (확정 mockup 기준)

확정 preview:

```text
C:\Users\jmj\Desktop\코덱스 자료\_preview\batch4_ui_mockup_v3_final\first_screen_combat_ui_mockup_v3_right_menu_keep_icons_clean.png
```

확정된 방향:

- 우측 Battle Log 패널은 첫 화면에서 제외한다.
- 우측 메뉴는 기존 스킬 / 장비 / 가방 / 퀘스트 아이콘을 유지한다.
- 우측 메뉴 내부 실선과 이상한 삼각형 표시는 사용하지 않는다.
- 우측 메뉴 접힘 버튼은 세련된 chevron 형태로 둔다.
- 전투 제어는 하단 좌측에 두고, 접힘 상태에서는 현재 선택 모드만 표시한다.
- 펼침 상태에서는 `수동 / 오토 / x1.5 / x2`를 보여준다.
- 스킬 슬롯은 6개를 유지한다.
- 중앙 전투 영역은 오계장과 몬스터, HP bar를 우선한다.

## 3. Current Code State (현재 코드 상태)

확인한 파일:

- `src/ui/Hud.ts`
- `src/scenes/GameScene.ts`
- `src/assets/AssetRegistry.ts`

현재 상태:

- `Hud.ts`에 우측 메뉴 접힘/펼침 상태가 이미 있다.
- `Hud.ts`에 전투 제어 접힘/펼침 상태가 이미 있다.
- `GameScene.ts`는 몬스터/아이템/이펙트 preload와 표시 이벤트를 담당한다.
- `AssetRegistry.ts`에는 몬스터, 아이템 아이콘, 이펙트 asset registry가 있다.
- 일부 UI 표시 문자열이 깨진 상태다.
- 현재 HUD는 아직 테스트 정보가 많아 첫 화면으로 보기엔 정보 밀도가 높다.

## 4. Scope (구현 범위)

이번 구현 범위:

- `Hud.ts` 레이아웃 정리
- 첫 화면 표시 정보 축소
- 우측 메뉴 UI 정돈
- 전투 제어 UI 정돈
- 스킬 슬롯 6개 영역 정돈
- 플레이어 / 몬스터 HP bar 위치와 텍스트 정돈
- 상점 / 편지함 위치 표시
- 표시용 한글 라벨 복구
- 문서 갱신
- Walkthrough 작성

이번 구현에서 하지 않는 것:

- 실제 스킬 패널 열기
- 실제 장비 패널 열기
- 실제 가방 패널 열기
- 실제 퀘스트 패널 열기
- 전투 속도 실제 적용
- 수동 전투 실제 입력 전환
- 보상 팝업 구현
- 스테이지 클리어 팝업 구현
- 신규 이미지 생성
- 신규 public asset 추가

## 5. UI Layout Draft (UI 배치 초안)

### 5.1 Top Area (상단 영역)

표시:

- 좌측: 오계장 초상 / 이름 / 레벨 / HP
- 중앙: 스테이지 번호 / 지역 / 진행 목표
- 우측: 골드 / 다이아 / 상점 / 편지함

주의:

- 영어 라벨은 최소화한다.
- 스테이지 정보는 한 줄 또는 두 줄로 제한한다.
- 상단 정보가 전투 영역을 과하게 덮지 않게 한다.

### 5.2 Center Combat Area (중앙 전투 영역)

표시:

- 오계장
- 현재 몬스터
- 플레이어 HP bar
- 몬스터 HP bar
- 몬스터 이름
- 간단한 현재 목표

주의:

- 중앙에 긴 텍스트 패널을 두지 않는다.
- 전투 로그는 첫 화면 주요 패널로 복귀시키지 않는다.

### 5.3 Right Menu (우측 메뉴)

접힘 상태:

```text
[chevron menu button]
```

펼침 상태:

```text
스킬
장비
가방
퀘스트
```

구현 기준:

- 기존 아이콘 톤 유지
- 아이콘 중심 + 짧은 한글 라벨
- 메뉴 내부 실선 없음
- 이상한 삼각형 포인터 없음
- 접힘/펼침 버튼 가로 폭은 메뉴 패널 폭과 맞춘다.
- 선택된 메뉴는 하이라이트만 표시하고 실제 패널은 열지 않는다.

### 5.4 Bottom Area (하단 영역)

표시:

- 좌측: 전투 제어 접힘/펼침 UI
- 중앙: 스킬 슬롯 6개
- 잠금 슬롯은 lock 표시 유지

전투 제어 모드:

```text
manual = 수동
auto = 오토
auto1_5 = x1.5
auto2 = x2
```

주의:

- `x1.5`, `x2`는 UI 잠금 후보로 표시 가능하다.
- 실제 전투 속도는 이번 구현에서 바꾸지 않는다.

## 6. Display Text Rule (표시 문구 원칙)

코드 식별자:

- 영어 유지

사용자 표시 문구:

- 짧은 한국어 사용
- 깨진 한글 문자열 복구
- 긴 설명 문장 사용 금지

예:

```text
Player -> 오계장
Stage -> 스테이지
Gold -> 골드
Inventory -> 가방
Equipment -> 장비
Quest -> 퀘스트
Skill -> 스킬
Manual -> 수동
Auto -> 오토
```

## 7. Candidate Files To Change (수정 후보 파일)

수정 후보:

- `src/ui/Hud.ts`
- `src/scenes/GameScene.ts`
- `docs/UI_SYSTEM.md`
- `docs/PROJECT_STATUS.md`
- `files/Walkthrough/YYYY-MM-DD_HHMMSS_FirstScreenUIImplementation_Walkthrough_v1.md`

`GameScene.ts` 수정이 필요한 경우:

- HUD에 넘기는 표시용 데이터가 부족할 때만 최소 수정한다.
- 전투 결과, 보상, HP, 경험치, 스테이지 진행 값은 직접 변경하지 않는다.

## 8. Files Not To Change (수정 금지 파일)

수정 금지:

- `src/systems/*`
- `data/*.json`
- `public/assets/**`
- `docs/AGENT_HANDOFF.md`
- 기존 보류 plan / Walkthrough 파일

금지 시스템:

- `CombatSystem`
- `RewardSystem`
- `PlayerGrowthSystem`
- `EquipmentSystem`
- `SkillSystem`
- `StageProgressSystem`
- `SaveSystem`

## 9. Implementation Order (구현 순서)

승인 후 구현 순서:

1. `Hud.ts`의 깨진 표시 문자열을 UI 표시 목적 범위에서 복구한다.
2. 현재 HUD panel drawing 좌표를 mockup 기준으로 재배치한다.
3. 우측 메뉴 toggle/button 위치와 크기를 mockup 기준으로 정리한다.
4. 우측 메뉴 내부 실선/포인터 없이 아이콘 중심 UI로 정리한다.
5. 전투 제어 UI를 하단 좌측에 정리한다.
6. 스킬 슬롯 6개 표시 영역을 하단 중앙에 정리한다.
7. 상점 / 편지함 표시를 상단 우측 mockup 기준으로 추가 또는 정리한다.
8. 전투 로그는 첫 화면 핵심 패널로 표시하지 않는다.
9. 문서와 Walkthrough를 작성한다.
10. typecheck / build를 실행한다.
11. 금지 영역 diff를 확인한다.
12. 승인된 파일만 커밋/푸시한다.

## 10. Validation Method (검증 방법)

명령 검증:

```powershell
npm.cmd run typecheck
npm.cmd run build
git diff -- src/systems data public/assets
git status --short
```

수동 검증:

- 첫 화면에서 중앙 전투 영역이 먼저 보이는지
- 우측 Battle Log 패널이 없는지
- 우측 메뉴 접힘/펼침이 되는지
- 스킬 / 장비 / 가방 / 퀘스트 아이콘이 보이는지
- 전투 제어가 `수동 / 오토 / x1.5 / x2`로 보이는지
- 스킬 슬롯 6개가 유지되는지
- 상점 / 편지함이 유지되는지
- 텍스트 겹침이 없는지
- 1280x720 기준에서 화면이 무너지지 않는지

Visual Validation은 사용자가 직접 브라우저로 확인하기 전까지 deferred로 기록한다.

## 11. Expected Risks (예상 리스크)

- `Hud.ts`가 이미 많은 표시 책임을 갖고 있어 더 비대해질 수 있다.
- 표시 문자열 복구와 UI 레이아웃 변경이 한 작업에 섞이면 diff가 커질 수 있다.
- Phaser Text 크기와 실제 브라우저 렌더링이 mockup과 다를 수 있다.
- 기존 placeholder와 실제 asset scale이 달라 배치가 어긋날 수 있다.
- 전투 제어 UI가 표시만 바뀌고 실제 전투 속도와 연결되지 않아 사용자가 혼동할 수 있다.

대응:

- 이번 작업은 표시 전용 UI임을 문서에 명확히 남긴다.
- 실제 전투 속도 적용은 `Combat Control Logic Integration` 후속 작업으로 분리한다.
- 큰 UI 리팩터링이 필요하면 후속으로 `HudLayout` 또는 `UiPanel` 분리를 검토한다.

## 12. User Approval Checkpoint (구현 전 승인 필요)

구현 전 확인할 것:

- 이번 작업에서 `Hud.ts` 중심으로 실제 UI를 수정해도 되는가?
- 표시용 한글 깨짐 복구를 이번 작업에 포함해도 되는가?
- `GameScene.ts`는 HUD 표시용 데이터 전달이 필요할 때만 최소 수정해도 되는가?
- 전투 로직과 시스템 파일은 건드리지 않는 기준으로 진행해도 되는가?

추천 다음 지시:

```text
First Screen UI Implementation Plan v1 승인.
Hud.ts 중심으로 구현 진행.
CombatSystem / RewardSystem / SkillSystem / EquipmentSystem / StageProgressSystem / data / public assets는 수정하지 마라.
구현 후 typecheck/build, 금지 영역 diff 확인, Walkthrough 작성, 커밋/푸시까지 진행해라.
```

