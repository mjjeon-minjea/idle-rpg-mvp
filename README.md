# 피곤해서 잠들었는데 일어나 보니 환생해서 어쩌다 수습기사 되어 이세계를 무쌍한다

로컬 기반 2D idle RPG (방치형 RPG) MVP 프로젝트입니다. 플레이어는 Trainee Knight (수습기사)로 시작해 Auto Combat (자동 전투), Reward (보상), Growth (성장), Stage Progress (스테이지 진행), Equipment Farming (장비 파밍), Skill Upgrade (스킬 강화), Rebirth (환생), Job Change (전직)로 점점 강해지는 이세계 무쌍형 게임을 목표로 합니다.

현재 작업 범위는 README.md, docs 문서, 실제 폴더/파일 구조의 정합성을 맞추는 것입니다. PlayerGrowthSystem (플레이어 성장 시스템) 같은 다음 기능 구현은 아직 진행하지 않습니다.

## Current Implemented Scope (현재 구현 범위)

Implemented (구현됨)

- Phaser 3 + TypeScript + Vite game shell (게임 실행 뼈대)
- Auto Combat (자동 전투)
- MonsterData (몬스터 정적 데이터)와 MonsterInstance (몬스터 런타임 객체) 분리
- MonsterPoolSystem (몬스터 풀 시스템)
- StageProgressSystem (스테이지 진행 시스템)
- RewardResolver (보상 계산기)
- RewardSystem (보상 적용 시스템)
- DropResolver (드랍 계산기)
- InventorySystem (인벤토리 시스템) 기본 수량 관리
- SaveSystem (저장 시스템) localStorage 저장/불러오기
- JSON data loading and validation (JSON 데이터 로딩과 검증)
- HUD (화면 표시 UI)

Partial (부분 구현)

- Boss Monster (보스 몬스터) 흐름 지원: 데이터와 진행 흐름은 지원하지만 보스 전용 패턴/페이즈는 없음
- Item Drop (아이템 드랍): 기본 드랍 테이블은 구현됐지만 장비 등급별 랜덤 파밍은 아직 없음
- Stage Clear Reward (스테이지 클리어 보상): 기본 보상 지급은 구현됐지만 보상 연출/상세 UI는 없음

Documented / Designed (문서화/설계됨)

- SegmentedMonster (세그먼트형 몬스터)
- Strategy Pattern (전략 패턴)
- Component Composition (컴포넌트 조합)
- Future source folder structure (미래 소스 폴더 구조)

Planned (예정)

- PlayerGrowthSystem (플레이어 성장 시스템)
- EquipmentSystem (장비 시스템)
- SkillSystem (스킬 시스템)
- RebirthSystem (환생 시스템)
- JobSystem (전직 시스템)
- Electron game preview integration (Electron 게임 미리보기 연동)

## Game Loop (게임 루프)

```text
Normal Monster N kills (일반 몬스터 N마리 처치)
-> Leader Monster appears (리더 몬스터 등장)
-> Leader Monster defeated (리더 처치)
-> Boss Monster appears if exists (보스가 있으면 등장)
-> Stage cleared (스테이지 클리어)
-> Reward applied (보상 적용)
-> Next stage (다음 스테이지)
```

## Development Commands (개발 명령어)

```powershell
cd "C:\Users\jmj\Desktop\코덱스 자료\idle-rpg-mvp"
npm.cmd run dev
```

기본 웹 미리보기:

```text
http://127.0.0.1:5173
```

검증 명령어:

```powershell
npm.cmd run typecheck
npm.cmd run build
```

Electron console (Electron 콘솔)는 별도 프로젝트입니다.

```powershell
cd "C:\Users\jmj\Desktop\코덱스 자료\codex-electron-console"
npm.cmd start
```

현재 Electron console (Electron 콘솔)은 게임 URL 자동 표시까지는 연결되지 않았습니다. 다음 Electron 작업에서 `http://127.0.0.1:5173`을 Electron 창 내부에 표시하도록 확장합니다.

## Project Structure Summary (프로젝트 구조 요약)

```text
C:\Users\jmj\Desktop\코덱스 자료\
├─ idle-rpg-mvp/              # 실제 Phaser + Vite 게임 프로젝트
└─ codex-electron-console/    # Electron 기반 전용 콘솔/미리보기
```

```text
idle-rpg-mvp/
├─ data/                      # JSON 기반 게임 데이터
├─ docs/                      # 시스템 문서와 인수인계 문서
├─ src/                       # TypeScript 게임 소스
│  ├─ loaders/                # DataLoader (데이터 로더)
│  ├─ scenes/                 # GameScene (Phaser 씬)
│  ├─ systems/                # 현재 MVP 시스템 파일
│  ├─ types/                  # 공통 타입
│  └─ ui/                     # Hud (화면 표시 UI)
├─ public/                    # 정적 에셋
├─ raw-assets/                # 원본 에셋 보관
├─ files/                     # 작업 보고서와 산출물 보관
├─ test/                      # 테스트 예정 위치
├─ e2e/                       # E2E 테스트 예정 위치
├─ index.html
├─ package.json
├─ tsconfig.json
└─ vite.config.ts
```

현재 `src/systems/`는 평평한 구조입니다. 이번 작업에서는 import 변경 리스크를 피하기 위해 소스 파일 이동을 하지 않았고, 목표 구조는 `docs/MONSTER_SYSTEM.md`와 `docs/MONSTER_REFACTOR_PLAN.md`에 문서화했습니다.

## Documentation Map (문서 지도)

| 문서 | 역할 |
| --- | --- |
| `docs/AGENT_HANDOFF.md` | Agent handoff (새 Codex 세션 인수인계) |
| `docs/PROJECT_STATUS.md` | Project status (현재 구현 상태) |
| `docs/MONSTER_REFACTOR_PLAN.md` | Monster refactor plan (몬스터 리팩토링 계획) |
| `docs/MONSTER_SYSTEM.md` | Monster architecture (몬스터 시스템 아키텍처) |
| `docs/DATA_SCHEMA.md` | Data schema (JSON 데이터 구조) |
| `docs/COMBAT_SYSTEM.md` | Combat system (전투 시스템) |
| `docs/STAGE_SYSTEM.md` | Stage system (스테이지 시스템) |
| `docs/REWARD_SYSTEM.md` | Reward system (보상 시스템) |
| `docs/INVENTORY_SYSTEM.md` | Inventory system (인벤토리 시스템) |
| `docs/SAVE_SYSTEM.md` | Save system (저장 시스템) |
| `docs/SCENE_STRUCTURE.md` | Scene structure (Phaser 씬 구조) |
| `docs/UI_SYSTEM.md` | UI system (HUD/UI 시스템) |

## Next Work (다음 작업)

다음 구현 진입점은 PlayerGrowthSystem (플레이어 성장 시스템)입니다. 단, 이 작업은 현재 README/docs/구조 정리와 분리해서 새 작업으로 진행합니다.

```text
Next recommended task:
PlayerGrowthSystem (플레이어 성장 시스템)
-> exp requirement (경험치 요구량)
-> level up (레벨업)
-> stat growth (스탯 성장)
-> RewardSystem integration (보상 적용 시스템 연동)
```
