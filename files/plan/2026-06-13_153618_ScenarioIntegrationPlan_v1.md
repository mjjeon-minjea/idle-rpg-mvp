# 2026-06-13 15:36:18 - Scenario Integration Plan v1

## 1. Scenario Summary (시나리오 요약)

공식 시나리오 기준 게임의 주인공은 `오계장`이다.

오계장은 원래 대한민국의 만성피로 직장인 `오명석 계장`이었지만, 신입 여신의 영혼 오배송 사고와 고참 여신의 상소문 실수 때문에 이세계에 강제 환생한다.

그가 원한 것은 영웅 서사나 치트 능력이 아니라 조용히 쉬는 삶이었다. 하지만 실수로 `마왕 토벌` 천명을 받으면서, 몸은 자동으로 싸우고 정신은 쉬고 싶어 하는 `피곤한 직장인 영혼이 들어간 수습기사`가 된다.

MVP 1에서는 이 시나리오 전체를 컷씬으로 구현하지 않는다. 현재 반영 범위는 아래 3개로 제한한다.

```text
Stage Log (스테이지 로그)
Region Description (지역 설명)
Art Direction (아트 방향)
```

## 2. Confirmed Narrative Rules (확정 내러티브 규칙)

### Protagonist (주인공)

- 표시명은 `오계장`으로 확정한다.
- 단순한 `수습기사`가 아니다.
- 정체성은 `피곤한 직장인 영혼이 들어간 수습기사`다.
- 아트 방향:
  - 졸린 눈
  - 억울한 표정
  - 어설픈 수습기사 장비
  - 몸은 전투 자세
  - 얼굴은 퇴근하고 싶은 느낌

### Tone (문체)

- 개그 톤은 유지한다.
- 단, 게임 UI 문구는 짧고 순화한다.
- 내부 시나리오 문서의 강한 표현, 긴 대사, 과격한 농담은 UI에 직접 넣지 않는다.
- UI는 플레이 중 빠르게 읽히는 짧은 로그를 우선한다.

### Opening Cutscene (오프닝 컷씬)

- MVP 1에서는 구현하지 않는다.
- 후순위 작업으로 분리한다.
- 현재는 README / narrative docs / art direction 문서에 설정만 보존한다.

### Current Reflection Scope (현재 반영 범위)

이번 단계에서 반영 가능한 범위:

- `Stage Log (스테이지 로그)`
- `Region Description (지역 설명)`
- `Art Direction (아트 방향)`

이번 단계에서 반영하지 않는 범위:

- 컷씬
- 긴 대사
- 퀘스트 대화
- 시스템 로직
- 데이터 밸런스 변경
- 이미지 생성
- 에셋 추가

## 3. Current Game Structure Mapping (현재 게임 구조 매핑)

현재 Stage 1~9 구조는 공식 시나리오의 3개 지역과 잘 맞는다.

| Region (지역) | Current Stage IDs (현재 스테이지 ID) | Scenario Role (시나리오 역할) |
| --- | --- | --- |
| Dawn Forest (새벽 숲) | `dawn_forest_1`, `dawn_forest_2`, `dawn_forest_3` | 쉬려고 눕자마자 강제 전투가 시작되는 첫 지역 |
| Mist Gate (안개 관문) | `mist_gate_1`, `mist_gate_2`, `mist_gate_3` | 조용한 숙소를 찾으려다 마왕군 전초지에 휘말리는 지역 |
| Old Mine (오래된 광산) | `old_mine_1`, `old_mine_2`, `old_mine_3` | 어두운 곳에서 쉬려다 강제 파밍과 전투가 벌어지는 지역 |

현재 구조상 Stage 3 / Stage 6 / Stage 9가 각 지역의 보스 검증 지점이다.

## 4. Stage Narrative Mapping Table (스테이지 내러티브 매핑 표)

아래 문구는 바로 구현하지 않는다. 추후 Stage Log (스테이지 로그) 또는 Region Description (지역 설명)에 넣을 후보 문구다.

| Stage ID | Region (지역) | Scenario Beat (시나리오 비트) | Normal / Leader / Boss Role (역할) | Possible Short UI Log Text (짧은 UI 로그 후보) |
| --- | --- | --- | --- | --- |
| `dawn_forest_1` | Dawn Forest (새벽 숲) | 오계장이 풀밭에서 자려다 몬스터와 마주친다. | normal + leader | `오계장이 눕기 전에 몬스터가 먼저 왔다.` |
| `dawn_forest_2` | Dawn Forest (새벽 숲) | 몸은 전투 자세, 정신은 퇴근 모드로 강제 사냥이 이어진다. | normal + leader | `몸이 알아서 검을 휘두른다.` |
| `dawn_forest_3` | Dawn Forest (새벽 숲) | 첫 보스가 등장하고 강제 무쌍의 서막이 열린다. | normal + leader + boss | `첫 보스가 잠자리를 방해한다.` |
| `mist_gate_1` | Mist Gate (안개 관문) | 조용한 빈집을 찾으려다 안개 속 적들과 만난다. | normal + leader | `안개 속에서도 쉴 곳은 없다.` |
| `mist_gate_2` | Mist Gate (안개 관문) | 안개가 짙어지고 전투가 더 바빠진다. | normal + leader | `오계장은 눈을 감았지만 몸은 깨어 있다.` |
| `mist_gate_3` | Mist Gate (안개 관문) | 안개 관문의 강한 적이 길을 막는다. | normal + leader + boss | `관문 보스가 퇴근길을 막았다.` |
| `old_mine_1` | Old Mine (오래된 광산) | 어두운 광산을 쉬기 좋은 곳으로 착각한다. | normal + leader | `광산은 조용했지만 안전하지 않았다.` |
| `old_mine_2` | Old Mine (오래된 광산) | 몬스터와 장비 파밍이 본격화된다. | normal + leader | `쉬려던 손이 장비를 줍고 있다.` |
| `old_mine_3` | Old Mine (오래된 광산) | MVP 1 최종 보스급 수호자와 충돌한다. | normal + leader + boss | `광산 깊은 곳에서 큰일이 깨어났다.` |

UI 문구는 시나리오 개그를 살리되, 너무 긴 문장과 강한 표현은 사용하지 않는다.

## 5. Monster Concept Mapping (몬스터 콘셉트 매핑)

현재 `monsters.json`의 몬스터 구성은 지역별 분위기와 대체로 맞는다. 다만 공식 시나리오와 완전히 일치시키려면 일부 이름/분위기 조정 후보가 있다.

이번 단계에서는 바로 수정하지 않는다. 후보만 기록한다.

| Current Monster ID (현재 ID) | Current Name (현재 이름) | Current Role (현재 역할) | Scenario Fit (시나리오 적합도) | Candidate Direction (후보 방향) |
| --- | --- | --- | --- | --- |
| `dawn_slime` | 새벽 슬라임 | normal | 높음 | 새벽 숲 초반 몬스터로 유지 가능 |
| `dawn_mushroom` | 새벽 버섯병 | normal | 높음 | 숲 풀밭에서 튀어나오는 개그 톤과 잘 맞음 |
| `dawn_hornet` | 새벽 말벌 | normal | 중간 | 잠을 방해하는 성가신 몬스터 이미지로 강화 가능 |
| `dawn_wolf` | 새벽 늑대 | leader | 중간 | 리더로는 좋지만 공식 시나리오의 하급 몬스터 톤보다 약간 진지함 |
| `dawn_treant` | 새벽 나무정령 | boss | 높음 | 첫 지역 보스로 적합 |
| `mist_goblin` | 안개 고블린 | normal | 높음 | 안개 관문 마왕군 전초병 느낌과 맞음 |
| `mist_bat` | 안개 박쥐 | normal | 중간 | 안개 속 방해 요소로 적합 |
| `mist_sentinel` | 안개 파수병 | normal | 높음 | 관문 점령군 콘셉트와 잘 맞음 |
| `mist_guardian` | 안개 수문장 | leader | 높음 | 관문 리더로 적합 |
| `sleepy_ogre` | 졸린 오우거 | boss | 높음 | 오계장의 졸림 개그와 잘 맞는 보스 |
| `mine_rat` | 광산 쥐 | normal | 중간 | 광산 초반 몬스터로 유지 가능 |
| `ore_sprite` | 광석 정령 | normal | 높음 | 광산 유물/광석 분위기와 적합 |
| `rust_crawler` | 녹슨 굴착벌레 | normal | 높음 | 광산 강제 노동 개그와 잘 맞음 |
| `mine_foreman_golem` | 광산 감독 골렘 | leader | 높음 | 야간 강제 노동 톤과 매우 적합 |
| `ancient_mine_guardian` | 고대 광산 수호자 | boss | 높음 | MVP 1 최종 보스급 수호자로 적합 |

추후 데이터 수정 후보:

- `dawn_wolf`는 더 개그적인 리더 콘셉트가 필요할 수 있다.
- Stage Log에서 `오계장`의 피곤함을 보완하면 몬스터 이름은 당장 바꾸지 않아도 된다.

## 6. Art Direction Impact (아트 방향 영향)

### O Gyejang Player Character (오계장 플레이어 캐릭터)

기존 Art Plan의 `player_apprentice_knight_idle.png` 방향은 유지하되, 아래 요소를 반드시 추가한다.

- 이름/콘셉트: `오계장`
- 외형:
  - 피곤한 눈
  - 억울한 입모양
  - 살짝 굽은 어깨
  - 어설픈 수습기사 갑옷
  - 검을 들고 있지만 의욕은 없어 보이는 자세
- 핵심 느낌:
  - 몸은 전투 준비 완료
  - 얼굴은 “퇴근하고 싶다”

### Dawn Forest Monsters (새벽 숲 몬스터)

- 너무 무섭기보다 초반 개그 전투에 맞는 귀찮은 방해꾼 느낌
- 풀밭, 새벽, 잠자리 방해, 강제 전투의 시작을 강조
- 작은 실루엣과 선명한 색상 우선

### Mist Gate Monsters (안개 관문 몬스터)

- 안개, 성문, 전초병, 마왕군 선봉대 느낌
- 너무 공포스럽기보다 “쉬려는데 계속 막는 적들” 느낌
- 수문장/보스는 오계장의 이동을 막는 역할이 명확해야 한다.

### Old Mine Monsters (오래된 광산 몬스터)

- 어두운 광산, 녹슨 장비, 광석, 굴착, 강제 노동 개그 반영
- `mine_foreman_golem`은 이름 그대로 감독관/작업반장 느낌을 살리면 좋다.
- `ancient_mine_guardian`은 MVP 1 최종 보스처럼 무겁고 큰 실루엣 필요

### Bosses (보스)

- `dawn_treant`: 잠자리를 방해하는 숲 수호자
- `sleepy_ogre`: 오계장과 졸림 코드가 겹치는 개그형 보스
- `ancient_mine_guardian`: 강제 파밍/강제 노동 구간의 최종 장벽

### Item Icons (아이템 아이콘)

- 장비는 `수습기사 장비` 느낌을 유지한다.
- 너무 영웅적인 전설 장비처럼 보이면 MVP 1 톤과 어긋난다.
- 낡고 어설프지만 게임적으로는 성장 체감이 있어야 한다.

### Skill Effects (스킬 이펙트)

- `trainee_slash`: 어설프지만 자동으로 나가는 짧은 검격
- `heavy_training_strike`: 몸이 멋대로 크게 휘두르는 묵직한 일격
- 오계장이 의도한 공격이 아니라 저주가 강제로 발동한 느낌을 살린다.

## 7. Text Tone Rule (문체 규칙)

### Internal Document Tone (내부 문서용 톤)

내부 문서에서는 공식 시나리오의 개그와 과장된 표현을 비교적 자유롭게 기록할 수 있다.

허용:

- 피곤한 직장인 개그
- 강제 전투 개그
- 억울한 무쌍 톤
- 긴 설명과 배경 설정

### Game UI Shortened Tone (게임 UI용 짧은 순화 톤)

게임 UI에서는 짧고 순화된 문구만 사용한다.

원칙:

- 한 줄 로그 우선
- 강한 표현 직접 사용 금지
- 긴 대사 직접 사용 금지
- 욕설/과격한 표현 순화
- 플레이 흐름을 방해하지 않는 짧은 농담만 사용

예시:

| Internal Scenario Tone (내부 시나리오 톤) | UI Tone (UI 순화 톤) |
| --- | --- |
| 몸이 알아서 몬스터를 학살한다 | 몸이 알아서 전투를 시작했다 |
| 제발 그만 돌려라 | 너무 빨리 돌고 있다 |
| 야간 강제 노동 | 광산 전투가 이어진다 |
| 잠자기 최고겠지 | 쉬기 좋아 보였는데 아니다 |

## 8. Revised Art Plan Impact (기존 Art Plan 영향)

### Keep (유지할 항목)

기존 `Art / Animation / Effect Preparation Plan v1`에서 아래 항목은 유지 가능하다.

- 권장 이미지 크기
- 파일명 규칙
- `public/assets/` 폴더 구조
- 정지 이미지 우선 원칙
- 첫 배치에서 Dawn Forest를 우선하는 방향
- 애니메이션/이펙트는 후순위로 미루는 원칙

### Modify (수정해야 할 항목)

아래 항목은 Scenario Integration 기준으로 수정해야 한다.

- `player_apprentice_knight_idle.png`
  - 단순 수습기사가 아니라 `오계장` 캐릭터로 재정의
- Player Character (플레이어 캐릭터) 설명
  - 피곤함, 억울함, 강제 전투 느낌 추가
- Skill Effects (스킬 이펙트) 설명
  - 의도적 영웅 기술이 아니라 자동 전투 저주에 의해 발동하는 느낌 추가
- Monster Concept (몬스터 콘셉트)
  - 각 지역의 시나리오 비트와 연결

### Rewrite (재작성해야 할 항목)

아래 항목은 Art Plan v2에서 다시 써야 한다.

- First Art Batch Proposal (1차 이미지 제작 묶음 제안)
- Style Guide (스타일 가이드)
- Player Character Art Direction (플레이어 아트 방향)
- Stage Log / Region Description 연결 방식

## 9. Files To Add Later (추후 추가할 파일)

이번 단계에서는 만들지 않고, 승인 후 후보로 둔다.

- `docs/SCENARIO.md`
  - 공식 시나리오 요약과 MVP 반영 범위
- `docs/NARRATIVE_BIBLE.md`
  - 장기 내러티브 기준 문서
- `docs/ART_DIRECTION.md`
  - 오계장, 몬스터, 지역, 아이템, 스킬 이펙트 아트 방향
- `files/plan/*ScenarioIntegrationPlan*.md`
  - 시나리오 반영 계획 기록
- `README.md`
  - 주인공 `오계장`과 공식 시나리오 기준 짧은 반영

README 반영은 필요하지만, 이번 플랜 단계에서는 직접 수정하지 않는다.

## 10. Files Not To Change (수정 금지 파일)

이번 Scenario Integration Plan 단계에서는 아래 파일을 수정하지 않는다.

- `src/systems/*`
- `data/*.json`
- `src/systems/CombatSystem.ts`
- `src/systems/RewardSystem.ts`
- `src/systems/PlayerGrowthSystem.ts`
- `src/systems/EquipmentSystem.ts`
- `src/systems/SkillSystem.ts`
- `src/systems/StageProgressSystem.ts`

추가 금지:

- 코드 수정 금지
- 이미지 생성 금지
- assets 추가 금지
- 컷씬 구현 금지
- 데이터 밸런스 수정 금지

## 11. Recommended Next Step (다음 추천 작업)

추천 순서:

```text
1. Scenario Integration Plan v1 승인
2. Art / Animation / Effect Preparation Plan v2 작성
3. README.md에 공식 시나리오 기준 짧게 반영
4. docs/SCENARIO.md 또는 docs/NARRATIVE_BIBLE.md 작성
5. docs/ART_DIRECTION.md 작성
6. 이후 승인 시 First Art Batch 생성 계획 수립
```

다음에 작성할 `Art / Animation / Effect Preparation Plan v2`는 아래 기준을 반드시 반영해야 한다.

- protagonist: `오계장`
- player art: `피곤한 직장인 영혼이 들어간 수습기사`
- scope: `Stage Log / Region Description / Art Direction`
- UI text: 짧고 순화
- opening cutscene: 후순위
- no code / no data / no assets until implementation approval

## Current Git Check (현재 Git 확인)

플랜 작성 전 `git status --short` 기준 미추적 파일은 아래 4개였다.

```text
?? files/EquipmentSystem (장비 시스템) 구현 플랜.txt
?? files/Walkthrough/2026-06-13_110807_Stage1-9ManualPlaytestBalanceCheck_Walkthrough_v1.md
?? files/plan/2026-06-13_122301_CodexElectronConsoleGitHubRepoPlan_v1.md
?? files/plan/2026-06-13_151828_ArtAnimationEffectPreparationPlan_v1.md
```

기존 보류 파일 3개는 이번 작업에서 수정하지 않는다.

```text
files/EquipmentSystem (장비 시스템) 구현 플랜.txt
files/Walkthrough/2026-06-13_110807_Stage1-9ManualPlaytestBalanceCheck_Walkthrough_v1.md
files/plan/2026-06-13_122301_CodexElectronConsoleGitHubRepoPlan_v1.md
```

이번 작업으로 새로 추가되는 파일은 이 `ScenarioIntegrationPlan_v1` 문서 하나다.
