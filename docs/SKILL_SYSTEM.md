# Skill System (스킬 시스템)

## Purpose (목적)

`SkillSystem (스킬 시스템)`은 MVP 자동 전투에서 Auto Skill Trigger (자동 스킬 발동), Cooldown (쿨타임), Skill Damage Calculation (스킬 피해 계산)을 담당한다.

## MVP 1 Scope (1차 MVP 범위)

Implemented (구현됨):

- Auto trigger attack skills (자동 발동 공격 스킬)
- Single target damage (단일 대상 피해)
- Cooldown management (쿨타임 관리)
- Required level check (요구 레벨 확인)
- SkillState save fallback (스킬 상태 저장 fallback)
- HUD cooldown display (HUD 쿨타임 표시)

Excluded (제외):

- Skill tree (스킬 트리)
- Skill upgrade (스킬 강화)
- Skill point (스킬 포인트)
- Element system (속성 시스템)
- Area skill (광역 스킬)
- Status effect (상태이상)
- Buff/debuff (버프/디버프)
- Skill animation/effect (스킬 애니메이션/이펙트)
- Job-specific skill branch (직업별 스킬 분기)

## SkillData (스킬 정적 데이터)

File (파일): `data/skills.json`

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

MVP 1 skills (1차 MVP 스킬):

- `trainee_slash (수습 베기)`
- `heavy_training_strike (묵직한 수련 일격)`

## Skill Unlock Policy (스킬 해금 정책)

```text
unlockedSkillIds = actually learned skills (실제 배운 스킬 목록)
requiredLevel = activation level requirement (발동 가능 레벨 조건)
```

MVP 1 policy (1차 MVP 정책):

```text
Initial unlockedSkillIds = ["trainee_slash"]
If player.level >= 3, "heavy_training_strike" is automatically unlocked.
```

`equippedSkillIds (장착 스킬 목록)`에는 아직 레벨이 부족한 스킬이 들어갈 수 있다. 이 경우 HUD에는 `Lv 3 필요`처럼 표시하고, 실제 발동은 막는다.

## SkillState / SkillRuntimeState (스킬 상태)

Save type (저장 타입):

```ts
interface SkillState {
  unlockedSkillIds: string[];
  equippedSkillIds: string[];
}
```

Runtime only type (런타임 전용 타입):

```ts
interface SkillRuntimeState {
  cooldownRemainingBySkillId: Record<string, number>;
}
```

Rules (규칙):

- `SkillState (스킬 상태)`는 저장한다.
- `SkillRuntimeState (스킬 런타임 상태)`는 저장하지 않는다.
- 저장/불러오기 후 쿨타임은 0부터 시작한다.

## Skill Action Policy (스킬 행동 정책)

```text
Skill is an additional auto attack (스킬은 자동 발동되는 추가 공격이다).
Skill trigger does not reset basic attack cooldown (스킬 발동은 기본 공격 쿨타임을 초기화하지 않는다).
Skill trigger does not cause instant monster counterattack (스킬 발동 자체는 몬스터 즉시 반격을 유발하지 않는다).
If skill defeats monster, CombatSystem.update is skipped in that update tick.
```

## Skill Damage Formula (스킬 피해 공식)

MVP 1 formula (1차 MVP 공식):

```ts
skillDamage = Math.max(
  1,
  Math.floor(effectiveStats.attack * skill.damageMultiplier + skill.flatDamage - monster.data.defense)
);
```

`EffectivePlayerStats (최종 플레이어 스탯)`는 `EquipmentSystem (장비 시스템)`이 계산한다. 따라서 장비 보너스가 스킬 피해에도 반영된다.

Future note (추후 계획):

- Damage formula (피해 공식)는 추후 `DamageFormula (피해 공식)` 또는 `CombatFormula (전투 공식)` 모듈로 분리할 수 있다.

## SkillSystem Mutation Boundary (수정 가능 범위)

Allowed (허용):

- `SkillRuntimeState.cooldownRemainingBySkillId`
- `MonsterInstance.currentHp`
- `MonsterInstance.currentState` and `isDead` only if defeated

Forbidden (금지):

- `player.attack` 직접 수정
- `player.defense` 직접 수정
- `player.maxHp` 직접 수정
- `player.exp` 직접 수정
- `player.gold` 직접 수정
- inventory 직접 수정
- reward 직접 지급

Reward flow (보상 흐름)는 반드시 기존 흐름을 재사용한다.

```text
handleMonsterDefeat
-> RewardResolver
-> RewardSystem
```

## Combat Connection (전투 연결)

```text
GameScene.update
-> EquipmentSystem.calculateEffectiveStats
-> SkillSystem.update
-> if skill defeated monster, handleMonsterDefeat and skip CombatSystem.update
-> otherwise CombatSystem.update
```

`CombatSystem (전투 시스템)`은 계속 기본 공격과 몬스터 공격 타이밍을 담당한다.
