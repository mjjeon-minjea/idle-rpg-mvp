# 2026-06-13 16:26:15 - Art / Animation / Effect Preparation Plan v2

## 0. Plan Status (플랜 상태)

`Art / Animation / Effect Preparation Plan v1`은 시나리오 반영 전 초안으로 보류한다.

이 v2 문서는 승인된 `Scenario Integration Plan v1` 기준을 반영한 재작성안이다.

이번 단계에서는 아래 작업을 하지 않는다.

```text
No image generation (이미지 생성 금지)
No asset addition (에셋 추가 금지)
No code implementation (코드 구현 금지)
No data JSON changes (data/*.json 수정 금지)
No opening cutscene assets (오프닝 컷씬 이미지 제외)
No full batch generation (전체 묶음 이미지 생성 금지)
```

## 1. Scenario-informed Art Direction (시나리오 반영 아트 방향)

### Protagonist (주인공)

- 게임 내 표시명은 `오계장`으로 확정한다.
- 캐릭터 콘셉트는 `피곤한 직장인 영혼이 들어간 수습기사`다.
- 단순한 판타지 수습기사가 아니라, 쉬고 싶은데 몸이 알아서 싸우는 인물이다.

### Player Concept (플레이어 콘셉트)

오계장 플레이어 이미지는 아래 요소를 반드시 포함해야 한다.

- Sleepy Eyes (졸린 눈)
- Wronged Expression (억울한 표정)
- Awkward Apprentice Armor (어설픈 수습기사 갑옷)
- Low Motivation Combat Pose (검을 들고 있지만 의욕 없는 전투 자세)
- Body Ready / Face Wants To Leave (몸은 전투 자세, 얼굴은 퇴근하고 싶은 느낌)

### Tone (톤)

- 개그 톤은 유지한다.
- UI와 전투 화면에서는 과한 표현을 직접 쓰지 않는다.
- 이미지는 과장된 표정과 상황 코미디를 살리되, 게임 화면에서는 읽기 쉬워야 한다.

### Current Reflection Scope (현재 반영 범위)

시나리오 반영은 아래 3개에만 우선 적용한다.

- `Stage Log (스테이지 로그)`
- `Region Description (지역 설명)`
- `Art Direction (아트 방향)`

### Opening Cutscene (오프닝 컷씬)

- MVP 1에서는 구현하지 않는다.
- 컷씬용 이미지는 이번 이미지 범위에서 제외한다.
- 오프닝 설정은 추후 `docs/SCENARIO.md` 또는 `docs/NARRATIVE_BIBLE.md`에 보존한다.

## 2. Sample-first Production Rule (샘플 우선 제작 규칙)

이미지는 한 번에 여러 장 만들지 않는다.

작업 방식:

```text
1. Sample 1 image proposal (샘플 1장 제안)
2. User visual approval (사용자 시각 승인)
3. Only then next sample (승인 후 다음 샘플)
4. Approved samples become style baseline (승인된 샘플이 스타일 기준)
```

이 방식의 목적:

- 그림체가 흔들리는 것을 방지한다.
- 오계장 캐릭터성이 먼저 확정된다.
- UI 축소 표시에서 잘 보이는지 먼저 확인한다.
- 불필요한 대량 이미지 생성을 막는다.

금지:

- 한 번에 Stage 1~9 전체 이미지 생성
- 여러 몬스터/장비/스킬 이펙트를 동시에 대량 생성
- 샘플 승인 전 assets 폴더에 파일 추가
- 샘플 승인 전 코드에 이미지 로딩 연결

## 3. Excluded Assets (제외 에셋)

이번 v2 플랜 기준에서 제외되는 에셋은 아래와 같다.

### Opening Cutscene Assets (오프닝 컷씬 에셋)

- 천계 집무실
- 신입 여신
- 고참 여신
- 현실 세계 사고 장면
- 이세계 환생 계약 장면

오프닝 컷씬은 후순위 작업이다.

### Full Stage 1~9 Batch (Stage 1~9 전체 묶음)

- Stage 1~9 전체 몬스터 이미지 일괄 제작 금지
- 전체 장비/재료 아이콘 일괄 제작 금지
- 전체 보스/리더 묶음 제작 금지

### Animation Spritesheets (애니메이션 스프라이트 시트)

- idle animation sheet
- attack animation sheet
- hit animation sheet
- defeat animation sheet

이번 단계는 정지 이미지 샘플 우선이다.

### Particle-heavy Effects (파티클 중심 이펙트)

- 복잡한 파티클 시스템
- 다중 레이어 스킬 이펙트
- 상태이상 이펙트
- 버프/디버프 이펙트

스킬 이펙트도 우선은 단일 정지 이미지 샘플만 검토한다.

## 4. First Sample Priority (첫 샘플 우선순위)

이미지 샘플은 아래 순서대로 하나씩 진행한다.

### 1. O Gyejang Player Sample (오계장 플레이어 샘플)

- File Candidate (파일 후보): `player_apprentice_knight_idle.png`
- Concept (콘셉트):
  - 피곤한 눈
  - 억울한 표정
  - 어설픈 수습기사 갑옷
  - 검을 들고 있지만 의욕 없는 자세
  - 몸은 전투 자세, 얼굴은 퇴근하고 싶은 느낌
- Purpose (목적):
  - 전체 아트 톤의 기준점 확정
  - 오계장 캐릭터성 확정

### 2. Dawn Forest Normal Monster Sample (새벽 숲 일반 몬스터 샘플)

- File Candidate (파일 후보): `monster_dawn_slime_idle.png`
- Concept (콘셉트):
  - 귀찮은 방해꾼 느낌
  - 초반 몬스터
  - 작고 잘 보이는 실루엣
  - 너무 무섭지 않고 초반 개그 전투와 어울림
- Purpose (목적):
  - 일반 몬스터 크기와 가독성 기준 확정

### 3. Dawn Forest Boss Sample (새벽 숲 보스 샘플)

- File Candidate (파일 후보): `boss_dawn_treant_idle.png`
- Concept (콘셉트):
  - 잠자리를 방해하는 숲 수호자
  - 첫 보스답게 크고 명확한 실루엣
  - 일반 몬스터와 즉시 구분되는 존재감
- Purpose (목적):
  - 보스 크기, 위압감, HUD 배치 기준 확정

### 4. Equipment Icon Sample (장비 아이콘 샘플)

- File Candidate (파일 후보): `icon_equipment_rusty_training_sword.png`
- Concept (콘셉트):
  - 낡은 수습기사 검
  - 너무 전설 장비처럼 보이지 않음
  - 초반 장비지만 착용하고 싶게 보이는 정도의 매력
- Purpose (목적):
  - 아이콘 선명도와 축소 표시 기준 확정

### 5. Skill Effect Sample (스킬 이펙트 샘플)

- File Candidate (파일 후보): `effect_skill_trainee_slash.png`
- Concept (콘셉트):
  - 자동으로 나가는 짧은 검격
  - 어설프지만 빠르게 발동되는 느낌
  - 오계장이 의도한 영웅 기술이 아니라 몸이 알아서 휘두른 느낌
- Purpose (목적):
  - 스킬 이펙트 크기와 HUD 방해 여부 기준 확정

## 5. Sample Approval Criteria (샘플 승인 기준)

각 샘플은 아래 기준을 통과해야 다음 샘플로 넘어간다.

### Silhouette Readability (실루엣 가독성)

- 작은 화면에서도 형태가 알아보여야 한다.
- 일반/리더/보스 역할 구분이 쉬워야 한다.
- 배경 없이 투명 PNG로도 읽혀야 한다.

### O Gyejang Character Identity (오계장 캐릭터성)

오계장 샘플은 특히 아래 기준을 본다.

- 피곤함이 보이는가
- 억울함이 보이는가
- 수습기사 장비가 어설프게 보이는가
- 전투 자세와 퇴근 욕구가 동시에 느껴지는가

### UI Downscale Readability (UI 축소 표시 가독성)

- 1280x720 화면 기준으로 축소해도 알아볼 수 있어야 한다.
- 아이템 아이콘은 32x32 또는 48x48에서도 식별 가능해야 한다.
- 스킬 이펙트는 작아져도 방향성과 타격감이 보여야 한다.

### Existing HUD Non-overlap (기존 HUD와 겹치지 않음)

- 플레이어/몬스터 이미지는 현재 중앙 전투 영역 안에 들어가야 한다.
- 보스 이미지는 HP Bar, Stage 정보, 전투 로그를 가리지 않아야 한다.
- 스킬 이펙트는 오른쪽 Battle Log (전투 로그)를 침범하지 않아야 한다.

### No Copyright Risk (저작권 리스크 없음)

- 상용 게임 캐릭터, 몬스터, 아이템, UI와 유사하면 안 된다.
- 고전 RPG 감성은 참고하되 디자인은 오리지널이어야 한다.
- 파일명, 콘셉트, 외형 모두 프로젝트 고유 방향을 유지한다.

## 6. Recommended Image Sizes (권장 이미지 크기)

v1의 이미지 크기 기준은 유지한다.

| Asset Type (에셋 유형) | Recommended Source Size (권장 원본 크기) | Display Target (표시 목표) |
| --- | --- | --- |
| Player Sprite (플레이어 스프라이트) | `256x256` | 높이 `96~128px` |
| Normal Monster Sprite (일반 몬스터 스프라이트) | `192x192` | 높이 `72~96px` |
| Leader Monster Sprite (리더 몬스터 스프라이트) | `256x256` | 높이 `96~128px` |
| Boss Sprite (보스 스프라이트) | `384x384` 또는 `512x512` | 높이 `150~220px` |
| Item Icon (아이템 아이콘) | `128x128` | `32x32`, `48x48`, `64x64` |
| Skill Effect (스킬 이펙트) | `256x256` | 전투 영역 기준 오버레이 |
| UI Icon (UI 아이콘) | `64x64` 또는 `128x128` | `18x18`, `24x24`, `32x32` |

권장 포맷:

- Transparent PNG (투명 PNG)
- 필요 시 WebP (웹 최적화)
- MVP 1 샘플은 투명 PNG 우선

## 7. File Naming Rules (파일명 규칙)

v1의 파일명 규칙은 유지한다.

규칙:

- 영어 소문자 사용
- `snake_case` 사용
- 한글 파일명 금지
- 공백 금지
- 특수문자 금지
- 데이터 ID와 가능한 한 맞춤
- 역할/종류를 prefix로 구분

Sample-first 파일 후보:

```text
player_apprentice_knight_idle.png
monster_dawn_slime_idle.png
boss_dawn_treant_idle.png
icon_equipment_rusty_training_sword.png
effect_skill_trainee_slash.png
```

추후 후보:

```text
monster_dawn_mushroom_idle.png
monster_dawn_hornet_idle.png
monster_dawn_wolf_leader_idle.png
icon_equipment_worn_apprentice_armor.png
icon_equipment_cracked_apprentice_ring.png
effect_skill_heavy_training_strike.png
```

## 8. Asset Folder Structure (에셋 폴더 구조)

v1의 폴더 구조는 유지한다.

단, 이번 단계에서는 폴더를 실제로 만들지 않는다.

추후 승인 시 권장 구조:

```text
public/assets/
  characters/
    player/
      player_apprentice_knight_idle.png
  monsters/
    normal/
      monster_dawn_slime_idle.png
    leader/
      monster_dawn_wolf_leader_idle.png
    boss/
      boss_dawn_treant_idle.png
  icons/
    equipment/
      icon_equipment_rusty_training_sword.png
    material/
    ui/
  effects/
    skills/
      effect_skill_trainee_slash.png
```

후속 확장 후보:

```text
public/assets/atlases/
public/assets/spritesheets/
public/assets/backgrounds/
```

## 9. Later Implementation Candidate Files (추후 구현 후보 파일)

실제 이미지 적용 승인 후에만 아래 파일 변경을 검토한다.

- `src/ui/Hud.ts`
  - Phaser Graphics placeholder를 이미지 표시로 교체
  - 이미지 로드 실패 시 기존 placeholder fallback 유지
- `src/scenes/GameScene.ts`
  - Phaser preload 단계에서 image key 등록이 필요할 때만 최소 변경
- `src/assets/AssetKeys.ts`
  - 필요 시 신규 파일로 에셋 key 상수 관리
- `src/loaders/AssetLoader.ts`
  - 필요 시 신규 파일로 에셋 로딩 책임 분리
- `docs/UI_SYSTEM.md`
  - placeholder에서 image asset 방식으로 전환된 내용 기록
- `docs/MANUAL_PLAYTEST_CHECKLIST.md`
  - 이미지 표시, 스케일, 포커스, Electron Preview 확인 항목 추가
- `docs/PROJECT_STATUS.md`
  - Art / Animation / Effect 진행 상태 기록
- `README.md`
  - 오계장 공식 시나리오 기준과 에셋 작업 방향 요약
- `docs/SCENARIO.md` 또는 `docs/NARRATIVE_BIBLE.md`
  - 공식 시나리오 반영 기준 보존
- `docs/ART_DIRECTION.md`
  - 오계장, 지역, 몬스터, 장비, 스킬 이펙트 기준 문서화

## 10. Files Not To Change (수정 금지 파일)

이번 v2 플랜 작성 단계에서는 아래 파일을 수정하지 않는다.

- `src/systems/*`
- `data/*.json`
- `src/scenes/GameScene.ts`
- `src/ui/Hud.ts`
- `public/assets/*`

시스템별 수정 금지:

- `CombatSystem`
- `RewardSystem`
- `PlayerGrowthSystem`
- `EquipmentSystem`
- `SkillSystem`
- `StageProgressSystem`

작업 금지:

- 게임 로직 수정
- 데이터 밸런스 수정
- 이미지 생성
- 에셋 추가
- 컷씬 구현
- Korean Display Text Fix 섞기

## 11. Validation Method (검증 방법)

이번 v2 플랜 단계에서는 코드 검증이 필요하지 않다. 실제 코드/에셋 변경이 없기 때문이다.

향후 이미지 샘플 적용 단계 검증:

```powershell
npm.cmd run typecheck
npm.cmd run build
```

수동 검증:

- 브라우저 1280x720에서 플레이어와 몬스터가 잘 보이는지 확인
- 오계장 캐릭터성이 축소 표시에서도 보이는지 확인
- 몬스터 실루엣이 현재 HUD 중앙 전투 영역에 맞는지 확인
- 아이템 아이콘이 장비/인벤토리 영역에서 읽히는지 확인
- 스킬 이펙트가 HP Bar, Battle Log, Stage 정보와 겹치지 않는지 확인
- Electron Preview에서 iframe 표시와 스케일이 깨지지 않는지 확인

검색 검증 후보:

```powershell
git diff -- src/systems data
rg "public/assets" README.md docs src
rg "placeholder" src/ui/Hud.ts docs/UI_SYSTEM.md
```

## 12. Expected Risks (예상 리스크)

### Character Drift (캐릭터성 흔들림)

오계장이 평범한 판타지 기사처럼 보이면 시나리오 강점이 사라진다.

대응:

- 첫 샘플은 반드시 오계장 플레이어 이미지로 시작한다.
- 피곤함, 억울함, 어설픔을 먼저 승인한다.

### Overproduction Risk (대량 제작 위험)

한 번에 많이 만들면 스타일이 틀렸을 때 수정 비용이 커진다.

대응:

- sample-first 규칙을 지킨다.
- 샘플 승인 전 다음 이미지를 만들지 않는다.

### UI Readability Risk (UI 가독성 위험)

이미지가 예뻐도 실제 HUD에서 작게 보면 안 보일 수 있다.

대응:

- 1280x720 기준 축소 검증을 승인 기준에 넣는다.
- 아이콘은 32x32 / 48x48 기준을 확인한다.

### Boss Scale Risk (보스 크기 위험)

보스 이미지가 너무 크면 HP Bar나 로그와 겹칠 수 있다.

대응:

- `boss_dawn_treant_idle.png` 샘플에서 중앙 전투 영역 기준 크기를 먼저 검증한다.

### Copyright Risk (저작권 위험)

고전 RPG 감성 참고 중 상용 게임과 유사해질 수 있다.

대응:

- 모든 명칭과 외형은 오리지널로 유지한다.
- 특정 상용 게임의 캐릭터, UI, 아이콘 구조를 복제하지 않는다.

### Scope Mix Risk (작업 범위 섞임 위험)

아트 작업 중 컷씬, 애니메이션, Korean Display Text Fix, 데이터 수정이 섞일 수 있다.

대응:

- 이번 범위는 Art Direction과 Sample-first 제작 계획으로 제한한다.
- 실제 적용은 별도 승인 후 진행한다.

## 13. User Approval Required Before Each Sample (각 샘플 전 사용자 승인 항목)

각 샘플 제작 전에 아래 항목을 사용자에게 확인받는다.

### Common Approval (공통 승인)

- 이번 샘플 대상이 맞는지
- 이미지 생성 도구 사용을 허용하는지
- 투명 PNG 기준으로 만들지
- 샘플을 repo에 저장할지, 먼저 대화창에서만 검토할지
- 승인 전 다음 샘플을 만들지 않는 것에 동의하는지

### Sample 1 Approval (오계장 플레이어 샘플 승인)

확인할 항목:

- 피곤한 눈
- 억울한 표정
- 어설픈 수습기사 갑옷
- 검을 든 의욕 없는 자세
- UI 축소 시 식별 가능성

### Sample 2 Approval (새벽 숲 일반 몬스터 샘플 승인)

확인할 항목:

- 귀찮은 방해꾼 느낌
- 초반 몬스터로 부담 없는 디자인
- 작고 읽기 쉬운 실루엣
- 오계장과 같은 화면에 놓였을 때 톤이 맞는지

### Sample 3 Approval (새벽 숲 보스 샘플 승인)

확인할 항목:

- 첫 보스다운 크기
- 숲 수호자 느낌
- 잠자리를 방해하는 존재감
- HUD와 겹치지 않을 크기

### Sample 4 Approval (장비 아이콘 샘플 승인)

확인할 항목:

- 낡은 수습기사 검 느낌
- 너무 전설 장비처럼 보이지 않음
- 32x32 / 48x48 축소 표시 가독성

### Sample 5 Approval (스킬 이펙트 샘플 승인)

확인할 항목:

- 짧은 검격 느낌
- 자동으로 나가는 공격 느낌
- 전투 로그와 HP Bar를 가리지 않음
- 이후 `heavy_training_strike`와 구분될 여지

## 14. Next Step After Approval (승인 후 다음 단계)

추천 진행 순서:

```text
1. Art / Animation / Effect Preparation Plan v2 승인
2. Sample 1: 오계장 플레이어 이미지 1장 생성 여부 승인
3. 샘플 이미지 생성
4. 사용자 시각 검토
5. 승인 또는 수정 요청
6. 승인 시 Sample 2로 진행
```

`Art Plan v2` 승인만으로 이미지 생성이 자동 진행되지는 않는다. 각 샘플마다 별도 승인을 받는다.

## Current Git Check (현재 Git 확인)

v2 작성 전 `git status --short` 기준 미추적 파일은 아래와 같다.

```text
?? files/EquipmentSystem (장비 시스템) 구현 플랜.txt
?? files/Walkthrough/2026-06-13_110807_Stage1-9ManualPlaytestBalanceCheck_Walkthrough_v1.md
?? files/plan/2026-06-13_122301_CodexElectronConsoleGitHubRepoPlan_v1.md
?? files/plan/2026-06-13_151828_ArtAnimationEffectPreparationPlan_v1.md
?? files/plan/2026-06-13_153618_ScenarioIntegrationPlan_v1.md
```

기존 보류 파일 3개는 이번 작업에서 수정하지 않는다.

```text
files/EquipmentSystem (장비 시스템) 구현 플랜.txt
files/Walkthrough/2026-06-13_110807_Stage1-9ManualPlaytestBalanceCheck_Walkthrough_v1.md
files/plan/2026-06-13_122301_CodexElectronConsoleGitHubRepoPlan_v1.md
```

이번 작업으로 새로 추가되는 파일은 이 `ArtAnimationEffectPreparationPlan_v2` 문서 하나다.
