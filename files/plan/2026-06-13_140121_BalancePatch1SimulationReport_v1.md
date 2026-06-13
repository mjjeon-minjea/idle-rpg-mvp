# 2026-06-13 14:01:21 - Balance Patch 1 Simulation Report v1

## Scope (범위)

현재 `data/*.json` 기준으로 `Stage 1~9 Balance (스테이지 1~9 밸런스)`를 숫자로 시뮬레이션했다.

이번 보고서는 분석 전용이다.

금지 사항 준수:

- `data/*.json` 수정 없음
- `CombatSystem (전투 시스템)` 수정 없음
- `RewardSystem (보상 적용 시스템)` 수정 없음
- `PlayerGrowthSystem (플레이어 성장 시스템)` 수정 없음
- `EquipmentSystem (장비 시스템)` 수정 없음
- `SkillSystem (스킬 시스템)` 수정 없음
- `StageProgressSystem (스테이지 진행 시스템)` 수정 없음
- `Korean Display Text Fix (한글 표시 문자열 수정)`는 이번 Balance Patch에 섞지 않고 별도 후보로만 기록
- `Gold (골드)`는 현재 소비처가 없으므로 소비 밸런스가 아니라 보상 체감 수치로만 검토

---

## Simulation Assumptions (시뮬레이션 가정)

### Reward Expectation (보상 기대값)

- Normal Monster (일반 몬스터)는 `MonsterPoolSystem (몬스터 풀 시스템)`의 weight (가중치)를 기준으로 평균값을 계산했다.
- Stage EXP / Gold는 아래 합산으로 계산했다.

```text
Normal kills expected reward
+ Leader reward
+ Boss reward if exists
+ Stage clear reward
```

### Growth Formula (성장 공식)

```ts
requiredExp = Math.floor(40 * level * 1.25 ** (level - 1));
```

Level Up Stat Gain (레벨업 스탯 증가):

```text
maxHp +12
attack +3
defense +1
```

### Combat Estimate (전투 추정)

현재 구현 기준:

- Monster attackCooldown (몬스터 공격 쿨타임): `850ms`
- Basic attack damage (기본 공격 피해):

```ts
Math.max(1, effectiveStats.attack - monster.data.defense)
```

- Monster counter damage (몬스터 반격 피해):

```ts
Math.max(1, monster.data.attack - effectiveStats.defense)
```

- Skill damage (스킬 피해):

```ts
Math.max(
  1,
  Math.floor(effectiveStats.attack * skill.damageMultiplier + skill.flatDamage - monster.data.defense)
)
```

Important runtime order (중요 런타임 순서):

```text
SkillSystem update (스킬 시스템 갱신)
-> if monster defeated by skill, skip CombatSystem for that tick
-> otherwise CombatSystem update (기본 공격/반격)
```

---

## 1. Stage 1~9 Expected Clear Flow (Stage 1~9 예상 클리어 흐름)

| Stage | Stage Expected EXP | Cumulative EXP | Stage Expected Gold | Cumulative Gold | Expected Level at Clear | EXP to Next Level |
|---|---:|---:|---:|---:|---|---:|
| dawn_forest_1 | 110 | 110 | 98 | 98 | Lv2, 70 / 100 | 30 |
| dawn_forest_2 | 148 | 258 | 130 | 228 | Lv3, 118 / 187 | 69 |
| dawn_forest_3 | 299 | 557 | 276 | 504 | Lv4, 230 / 312 | 82 |
| mist_gate_1 | 265 | 822 | 234 | 738 | Lv5, 183 / 488 | 305 |
| mist_gate_2 | 319 | 1141 | 288 | 1026 | Lv6, 14 / 732 | 718 |
| mist_gate_3 | 630 | 1771 | 574 | 1600 | Lv6, 644 / 732 | 88 |
| old_mine_1 | 670 | 2441 | 582 | 2182 | Lv7, 582 / 1068 | 486 |
| old_mine_2 | 800 | 3241 | 711 | 2893 | Lv8, 314 / 1525 | 1211 |
| old_mine_3 | 1585 | 4826 | 1445 | 4338 | Lv9, 374 / 2145 | 1771 |

### Read (해석)

- Stage 1~3 progression (초반 진행)는 빠르다.
- `heavy_training_strike (묵직한 수련 일격)`은 Stage 2 clear 시점에 Lv3이 되어 사용 가능해진다.
- Stage 9 clear 후 Lv9 초반으로 끝나므로 MVP 2 확장 여지는 남는다.
- Gold는 Stage 9까지 약 4338 누적되지만 현재 gold sink (골드 소비처)가 없으므로 과다/부족 판단은 보류한다.

---

## 2. Player Stat Curve (플레이어 스탯 곡선)

### Base Stats Only (장비 미장착 기준)

| Stage Clear | Expected Level | Base Max HP | Base ATK | Base DEF |
|---|---:|---:|---:|---:|
| Stage 1 | Lv2 | 132 | 17 | 4 |
| Stage 2 | Lv3 | 144 | 20 | 5 |
| Stage 3 | Lv4 | 156 | 23 | 6 |
| Stage 4 | Lv5 | 168 | 26 | 7 |
| Stage 5 | Lv6 | 180 | 29 | 8 |
| Stage 6 | Lv6 | 180 | 29 | 8 |
| Stage 7 | Lv7 | 192 | 32 | 9 |
| Stage 8 | Lv8 | 204 | 35 | 10 |
| Stage 9 | Lv9 | 216 | 38 | 11 |

### Guaranteed Equipment Equipped (보장 장비 장착 기준)

This assumes guaranteed equipment is immediately equipped after clear reward.

| Stage Clear | Owned Equipment (보유 장비) | Equipped Equipment (장착 장비) | Effective Max HP | Effective ATK | Effective DEF |
|---|---|---|---:|---:|---:|
| Stage 1 | none | none | 132 | 17 | 4 |
| Stage 2 | none | none | 144 | 20 | 5 |
| Stage 3 | rusty_training_sword | weapon | 156 | 27 | 6 |
| Stage 4 | rusty_training_sword | weapon | 168 | 30 | 7 |
| Stage 5 | rusty_training_sword | weapon | 180 | 33 | 8 |
| Stage 6 | rusty_training_sword, worn_apprentice_armor | weapon, armor | 200 | 33 | 10 |
| Stage 7 | rusty_training_sword, worn_apprentice_armor | weapon, armor | 212 | 36 | 11 |
| Stage 8 | rusty_training_sword, worn_apprentice_armor | weapon, armor | 224 | 39 | 12 |
| Stage 9 | rusty_training_sword, worn_apprentice_armor, cracked_apprentice_ring | weapon, armor, accessory | 244 | 43 | 14 |

### Owned / Equipped Risk (보유 / 장착 리스크)

- Current InventorySystem (인벤토리 시스템)은 item ownership (아이템 보유)을 관리한다.
- Current EquipmentSystem (장비 시스템)은 equipped state (장착 상태)를 관리한다.
- Balance should not assume equipment is active unless it is actually equipped.
- Manual playtest must record:

```text
equipment owned
equipment equipped
effective stats
```

---

## 3. Monster Pressure Check (몬스터 압박 검토)

### Normal Monster Regional Average (지역별 일반 몬스터 평균)

| Region | Avg HP | Avg ATK | Avg DEF | Notes |
|---|---:|---:|---:|---|
| Dawn Forest | 50.3 | 6.1 | 1.4 | very light opening pressure |
| Mist Gate | 83.2 | 11.3 | 2.9 | moderate jump after first boss |
| Old Mine | 152.8 | 18.8 | 5.5 | clear durability check |

### Leader Monster (리더 몬스터)

| Leader | HP | ATK | DEF | Notes |
|---|---:|---:|---:|---|
| dawn_wolf | 165 | 14 | 4 | first leader check |
| mist_guardian | 280 | 21 | 6 | Mist Gate durability check |
| mine_foreman_golem | 470 | 32 | 10 | Old Mine pressure spike |

### Boss Monster (보스 몬스터)

| Boss | HP | ATK | DEF | Notes |
|---|---:|---:|---:|---|
| dawn_treant | 260 | 19 | 6 | first boss; should showcase skills |
| sleepy_ogre | 420 | 26 | 8 | second boss; armor is rewarded after clear |
| ancient_mine_guardian | 720 | 38 | 13 | MVP 1 final boss; survival risk exists |

### Read (해석)

- Region difficulty curve is clear.
- Old Mine has the largest durability jump.
- Boss attack values are not extreme until Stage 9.

---

## 4. Boss Time-To-Kill Estimate (보스 처치 시간 추정)

### Assumed Boss Entry State (보스 진입 상태 가정)

| Boss Stage | Expected Player State Before Boss | Guaranteed Equipment Active Before Boss |
|---|---|---|
| Stage 3 boss | Lv4, base HP 156 / ATK 23 / DEF 6 | none |
| Stage 6 boss | Lv6, base HP 180 / ATK 29 / DEF 8 | weapon only |
| Stage 9 boss | Lv8, base HP 204 / ATK 35 / DEF 10 | weapon + armor |

Note:

- Stage 3 weapon is rewarded after boss clear, so it is not guaranteed before Stage 3 boss.
- Stage 6 armor is rewarded after boss clear, so it is not guaranteed before Stage 6 boss.
- Stage 9 accessory is rewarded after boss clear, so it is not guaranteed before Stage 9 boss.

### Time-To-Kill Estimate (처치 시간 추정)

| Case | Estimated TTK | Basic Attacks | trainee_slash Casts | heavy_training_strike Casts | Monster Counters |
|---|---:|---:|---:|---:|---:|
| Stage 3 boss, guaranteed baseline | 5.95s | 7 | 3 | 1 | 6 |
| Stage 6 boss, before armor with weapon | 6.05s | 7 | 3 | 2 | 7 |
| Stage 9 boss, with weapon + armor | 11.05s | 13 | 5 | 2 | 12 |
| Stage 9 boss, without armor but with weapon | 11.05s | 13 | 5 | 2 | 12 |
| Stage 9 boss, no equipment | 12.05s | 14 | 5 | 3 | 14 |

### Read (해석)

- Stage 3 / Stage 6 bosses are not too slow.
- Stage 9 boss is meaningfully longer and shows multiple skill cycles.
- Stage 9 is the first fight where survival risk appears in the estimate.

---

## 5. Survival Estimate (생존 추정)

### Boss Survival Table (보스전 생존표)

| Case | Effective HP | Effective DEF | Damage Per Counter | Estimated Counters | Total Incoming Damage | Estimated Death / Reset |
|---|---:|---:|---:|---:|---:|---:|
| Stage 3 boss, no guaranteed equipment | 156 | 6 | 13 | 6 | 78 | 0 |
| Stage 6 boss, weapon only before armor | 180 | 8 | 18 | 7 | 126 | 0 |
| Stage 9 boss, weapon + armor | 224 | 12 | 26 | 12 | 312 | 1 |
| Stage 9 boss, weapon only / no armor | 204 | 10 | 28 | 12 | 336 | 1 |
| Stage 9 boss, no equipment | 204 | 10 | 28 | 14 | 392 | 1 |

### Read (해석)

- Stage 3 boss survival risk is low.
- Stage 6 boss survival risk is acceptable even before armor.
- Stage 9 boss is likely to trigger at least one current CombatSystem death/reset cycle.
- Because current CombatSystem restores HP to effectiveMaxHp when HP reaches 0, the fight may continue rather than fail. This is acceptable for MVP testing, but it can make "death" feel unclear in logs.

### Risk Note (리스크 기록)

Stage 9 is the main Balance Patch 1 watch point.

Possible interpretations:

- If reset is intended as idle RPG auto-recovery, no immediate patch required.
- If player death should feel punishing later, Stage 9 attack pressure will need redesign in a future system pass.
- For current MVP, do not change CombatSystem. If needed, adjust data only.

---

## 6. Equipment Impact Check (장비 영향 검토)

### Stage 3 Weapon Impact (Stage 3 무기 영향)

Guaranteed item:

```text
rusty_training_sword
slot: weapon
attack +4
```

Before weapon at Stage 3 clear:

```text
Lv4 base ATK 23
```

After weapon equipped:

```text
Effective ATK 27
Basic attack damage increases by +4 before monster defense.
Skill damage also increases because skills use EffectivePlayerStats.
```

Skill impact example against Dawn boss defense 6:

```text
trainee_slash with ATK 23: floor(23 * 1.5 + 2 - 6) = 30
trainee_slash with ATK 27: floor(27 * 1.5 + 2 - 6) = 36

heavy_training_strike with ATK 23: floor(23 * 2.4 + 5 - 6) = 54
heavy_training_strike with ATK 27: floor(27 * 2.4 + 5 - 6) = 63
```

Weapon impact is meaningful.

### Stage 6 Armor Impact (Stage 6 방어구 영향)

Guaranteed item:

```text
worn_apprentice_armor
slot: armor
maxHp +20
defense +2
```

Before armor around Stage 6:

```text
Lv6 base HP 180 / DEF 8
```

After armor:

```text
Effective HP 200 / DEF 10
```

Against Stage 9 boss attack 38:

```text
without armor: 38 - 10 = 28 damage per counter
with armor: 38 - 12 = 26 damage per counter
```

Armor impact is present but modest.

### Stage 9 Accessory Impact (Stage 9 장신구 영향)

Guaranteed item:

```text
cracked_apprentice_ring
slot: accessory
maxHp +8
attack +1
defense +1
```

After Stage 9 clear:

```text
Lv9 base HP 216 / ATK 38 / DEF 11
with weapon + armor + accessory = HP 244 / ATK 43 / DEF 14
```

Accessory validates the slot but is not a major power spike.

---

## 7. Skill Feel Check (스킬 체감 검토)

### trainee_slash (수습 베기)

Current values:

```text
requiredLevel: 1
cooldownMs: 2500
damageMultiplier: 1.5
flatDamage: 2
```

Read:

- It should appear frequently.
- It is strong enough to be visible.
- It may feel like part of the normal damage rhythm rather than a special event.

Risk:

- Low. Good for MVP because the user can easily confirm SkillSystem works.

### heavy_training_strike (묵직한 수련 일격)

Current values:

```text
requiredLevel: 3
cooldownMs: 6000
damageMultiplier: 2.4
flatDamage: 5
```

Read:

- Unlocks early around Stage 2 clear.
- On bosses, it contributes meaningful burst damage.
- It does not instantly delete Stage 6 or Stage 9 bosses.

Risk:

- Low to Medium. Stage 3 boss may die quickly, but this is acceptable for the first boss.

### Skill Frequency (스킬 빈도)

Estimated boss casts:

```text
Stage 3 boss: trainee 3, heavy 1
Stage 6 boss: trainee 3, heavy 2
Stage 9 boss: trainee 5, heavy 2
```

This is enough for manual verification.

---

## 8. Balance Risk Ranking (밸런스 리스크 순위)

| Risk | Rank | Reason | Immediate Patch? |
|---|---|---|---|
| Stage 9 boss survival pressure | Medium | estimate shows 1 death/reset cycle | Not yet; manual check first |
| Early level-up too fast | Low | Stage 1~3 reaches Lv4 quickly, but helps unlock skill testing | No |
| Stage 3 boss too fast | Low | ~6s TTK, but first boss should be light | No |
| Stage 6 boss too hard | Low | no death expected before armor | No |
| Stage 9 boss too slow | Low to Medium | ~11s TTK, acceptable for final MVP boss | No |
| Armor impact too weak | Medium | +20 HP / +2 DEF is useful but modest | Not yet |
| Gold reward too high/low | Low | no gold sink yet, cannot judge consumption economy | No |
| Korean display text broken in terminal/UI | Medium | should be handled separately from balance | Separate task |
| Equipment owned vs equipped confusion | Medium | balance differs if user owns but does not equip | Manual check first |

---

## 9. Patch Candidate Table (패치 후보 표)

No immediate patch is recommended before manual playtest.

Conditional candidates only:

| File | Item | Current Value | Suggested Value | Reason | Risk |
|---|---|---:|---:|---|---|
| data/monsters.json | ancient_mine_guardian.attack | 38 | 34 ~ 36 | Use only if Stage 9 death/reset feels bad | May make final boss too easy |
| data/monsters.json | ancient_mine_guardian.maxHp | 720 | 650 ~ 680 | Use only if Stage 9 feels too slow | May reduce skill visibility |
| data/items.json | worn_apprentice_armor.defense | 2 | 3 | Use only if armor feels too weak | May reduce Old Mine pressure |
| data/skills.json | trainee_slash.cooldownMs | 2500 | 3000 | Use only if skill fires too often | May make early combat feel empty |

Important:

```text
Do not apply these until manual playtest confirms the issue.
```

---

## 10. No-Change Recommendation (변경하지 않는 게 나은 항목)

Recommended no-change for now:

- Do not change `PlayerGrowthSystem (플레이어 성장 시스템)` formula.
- Do not change `CombatSystem (전투 시스템)` death/reset behavior during Balance Patch 1.
- Do not change `RewardSystem (보상 적용 시스템)` or reward flow.
- Do not change `DropResolver (드랍 계산기)` formula.
- Do not change Stage 3 / Stage 6 / Stage 9 guaranteed equipment timing.
- Do not reduce Stage 1~3 level-up speed yet.
- Do not tune gold economy until a gold sink exists.
- Do not mix Korean display text recovery into this Balance Patch.

Current best recommendation:

```text
No data patch yet.
Run manual playtest first.
If Stage 9 feels bad, patch only Stage 9 boss or armor values.
```

---

## 11. Validation Plan (검증 계획)

After any approved patch:

```powershell
npm.cmd run typecheck
npm.cmd run build
```

JSON parse check:

```powershell
node -e "const fs=require('fs'); for (const f of ['stages.json','monsters.json','monsterPools.json','dropTables.json','rewards.json','items.json','skills.json']) { JSON.parse(fs.readFileSync('data/'+f,'utf8')); console.log(f+': OK'); }"
```

Search validation:

```powershell
rg "rewardMultiplier" data src docs README.md
rg "\"exp\"" data/monsters.json
rg "\"gold\"" data/monsters.json
```

Expected:

```text
rewardMultiplier should not be used.
data/monsters.json should not contain direct exp/gold fields.
Monster reward fields should remain baseExp/baseGold.
```

Manual validation:

```text
Stage ID:
Level at clear:
EXP to next level:
Gold gained:
Equipment owned:
Equipment equipped:
Boss deaths/resets:
Skill casts visible:
Clear feeling:
Issue:
Suggested adjustment:
```

---

## Conclusion (결론)

Balance Patch 1 should not modify data yet.

The current numbers are suitable for manual validation:

- Early game unlocks skills quickly.
- Equipment guarantee timing is clear.
- Bosses show multiple skill cycles.
- Stage 9 has the only meaningful survival risk.

Recommended next step:

```text
Run manual playtest with current data.
Record Stage 9 death/reset feel.
Only then decide whether to lower ancient_mine_guardian attack/HP or increase armor defense.
```

