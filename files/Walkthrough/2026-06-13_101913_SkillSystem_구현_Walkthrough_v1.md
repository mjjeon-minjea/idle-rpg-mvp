# SkillSystem 구현 Walkthrough v1

작성 시각: 2026-06-13 10:19:13

대상 프로젝트: `C:\Users\jmj\Desktop\코덱스 자료\idle-rpg-mvp`

## 구현 요약

`SkillSystem (스킬 시스템)` MVP 1 구현을 완료했다.

이번 구현 범위:

```text
자동 발동 단일 대상 공격 스킬 2종
쿨타임 관리
레벨 조건 표시
Lv 3 자동 스킬 해금
EffectivePlayerStats 기반 스킬 피해 계산
스킬 처치 시 보상 중복 방지
SaveSystem fallback
HUD 표시
문서 갱신
```

이번 단계에서 제외한 것:

```text
스킬 트리
스킬 강화
스킬 포인트
속성 시스템
광역 스킬
상태이상
버프/디버프
스킬 애니메이션
스킬 이펙트
직업별 스킬 분기
```

## 생성 파일

```text
data/skills.json
src/systems/SkillSystem.ts
docs/SKILL_SYSTEM.md
files/Walkthrough/2026-06-13_101913_SkillSystem_구현_Walkthrough_v1.md
```

## 수정 파일

```text
README.md
docs/AGENT_HANDOFF.md
docs/COMBAT_SYSTEM.md
docs/DATA_SCHEMA.md
docs/EQUIPMENT_SYSTEM.md
docs/PLAYER_GROWTH_SYSTEM.md
docs/PROJECT_STATUS.md
docs/REWARD_SYSTEM.md
docs/SAVE_SYSTEM.md
docs/UI_SYSTEM.md
src/loaders/DataLoader.ts
src/scenes/GameScene.ts
src/types/GameTypes.ts
src/ui/Hud.ts
```

## SkillData 구조

`data/skills.json`에 `defaultState`와 `skills`를 함께 둔다.

```ts
interface SkillData {
  id: string;
  name: string;
  description: string;
  trigger: "auto";
  target: "currentMonster";
  cooldownMs: number;
  damageMultiplier: number;
  flatDamage: number;
  requiredLevel: number;
}
```

추가된 MVP 1 스킬:

```text
trainee_slash (수습 베기)
heavy_training_strike (묵직한 수련 일격)
```

## SkillState / SkillRuntimeState 구조

저장 상태:

```ts
interface SkillState {
  unlockedSkillIds: string[];
  equippedSkillIds: string[];
}
```

런타임 상태:

```ts
interface SkillRuntimeState {
  cooldownRemainingBySkillId: Record<string, number>;
}
```

정책:

```text
unlockedSkillIds = 실제 배운 스킬 목록
requiredLevel = 발동 가능 레벨 조건
SkillRuntimeState는 저장하지 않음
저장/불러오기 후 쿨타임은 0부터 시작
```

기본 상태:

```ts
{
  unlockedSkillIds: ["trainee_slash"],
  equippedSkillIds: ["trainee_slash", "heavy_training_strike"]
}
```

`heavy_training_strike`는 플레이어가 Lv 3 이상이 되면 자동 해금된다.

## SkillSystem 자동 발동 흐름

```text
GameScene.update
-> EquipmentSystem.calculateEffectiveStats(player)
-> SkillSystem.update(delta, player, effectiveStats, monster)
-> 스킬 발동 가능 여부 확인
-> 쿨타임 0이면 스킬 피해 적용
-> 몬스터 처치 시 MonsterInstance.dead 처리
```

스킬 피해 공식:

```ts
skillDamage = Math.max(
  1,
  Math.floor(effectiveStats.attack * skill.damageMultiplier + skill.flatDamage - monster.data.defense)
);
```

## CombatSystem 연결 방식

정책:

```text
스킬은 기본 공격을 대체하지 않고 추가 공격으로 동작
스킬 발동은 기본 공격 쿨타임을 초기화하지 않음
스킬 발동 자체는 몬스터 즉시 반격을 유발하지 않음
스킬이 몬스터를 처치하면 해당 update tick에서는 CombatSystem.update를 호출하지 않음
스킬이 몬스터를 처치하지 못하면 CombatSystem.update는 평소처럼 실행
```

이 방식으로 SkillSystem과 CombatSystem이 같은 tick에서 보상을 중복 지급하는 위험을 막았다.

## SaveSystem fallback 처리

`SaveData`에 `skills?: SkillState`를 추가했다.

fallback:

```ts
saved?.skills ?? dataSet.defaultSkillState
```

저장 시:

```ts
skills: skillSystem.toState()
```

쿨타임은 저장하지 않는다.

## HUD 변경

HUD에 스킬 상태 표시를 추가했다.

예시:

```text
스킬
수습 베기: 준비됨
묵직한 수련 일격: Lv 3 필요
```

쿨타임 중:

```text
수습 베기: 1.8s
```

전투 로그:

```text
스킬 발동: 수습 베기 24 피해
```

## DataLoader validation

`data/skills.json` 검증을 추가했다.

검증 규칙:

```text
skill id 중복 금지
cooldownMs > 0
damageMultiplier >= 0
flatDamage >= 0
requiredLevel >= 1
trigger는 "auto"만 허용
target은 "currentMonster"만 허용
default equippedSkillIds는 skills.json에 존재하는 id만 허용
default equippedSkillIds 중복 금지
default equippedSkillIds 최대 2개
```

잘못된 데이터는 명확한 Error를 낸다.

## 검증 결과

명령 검증:

```text
npm.cmd run typecheck: PASS
npm.cmd run build: PASS with elevated permission
```

참고:

```text
일반 sandbox build는 기존과 같은 Access is denied 문제로 실패했다.
권한 상승 후 build는 성공했다.
Vite chunk size warning은 남아 있으나 build failure는 아니다.
```

검색 검증:

```text
rg "player.attack \\+=" src
-> src/systems/PlayerGrowthSystem.ts only

rg "player.defense \\+=" src
-> src/systems/PlayerGrowthSystem.ts only

rg "player.maxHp \\+=" src
-> src/systems/PlayerGrowthSystem.ts only

rg "RewardResolver" src
-> GameScene and RewardResolver only

rg "SkillSystem" src data docs README.md
-> expected references found
```

추가 책임 경계 확인:

```text
SkillSystem does not modify player.attack.
SkillSystem does not modify player.defense.
SkillSystem does not modify player.maxHp.
SkillSystem does not modify player.exp.
SkillSystem does not modify player.gold.
SkillSystem does not modify inventory.
SkillSystem does not grant rewards.
```

## 테스트 방법

수동 플레이 검증:

```text
1. npm.cmd run dev
2. http://127.0.0.1:5173 접속
3. HUD 스킬 영역 확인
4. Lv 1에서 수습 베기가 자동 발동되는지 확인
5. 묵직한 수련 일격이 Lv 3 필요로 표시되는지 확인
6. Lv 3 달성 후 묵직한 수련 일격이 자동 해금/발동되는지 확인
7. 장비 장착 후 스킬 피해가 증가하는지 확인
8. 스킬로 몬스터 처치 시 보상이 한 번만 지급되는지 확인
9. 저장/불러오기 후 장착 스킬 상태가 유지되는지 확인
10. 재접속 후 쿨타임이 0부터 시작하는지 확인
```

## 남은 TODO

```text
Skill upgrade (스킬 강화)
Skill animation/effect (스킬 애니메이션/이펙트)
Dedicated skill panel UI (전용 스킬 패널 UI)
DamageFormula / CombatFormula 분리
Save versioning (저장 버전 관리)
```

## 다음 추천 작업

우선순위 후보:

```text
1. Electron game preview integration (Electron 게임 미리보기 연동)
2. Stage Content Expansion (스테이지 콘텐츠 확장)
3. Skill Upgrade plan (스킬 강화 설계)
```

현재는 SkillSystem MVP가 들어갔으므로, 다음은 Electron 미리보기 연동 또는 스테이지 콘텐츠 확장이 자연스럽다.
