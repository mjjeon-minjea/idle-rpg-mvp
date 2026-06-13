# Equipment System (장비 시스템)

## Purpose (목적)

`EquipmentSystem (장비 시스템)`은 EquipmentState (장착 상태)와 Equipment Stat Bonus (장비 보너스 스탯) 계산을 담당한다.

## Responsibility (책임)

- EquipmentState (장착 상태) 관리
- Equip Item (장착)
- Unequip Item (해제)
- Equipment Slot (장비 슬롯) 검증
- Equipment Stat Bonus (장비 보너스 스탯) 계산
- EffectivePlayerStats (최종 플레이어 스탯) 계산
- SaveData (저장 데이터) 변환

## Inventory Policy (인벤토리 정책)

MVP 1에서는 장비를 장착해도 inventory quantity (인벤토리 수량)는 차감하지 않는다.

장착 조건:

```ts
InventorySystem.hasItem(itemId, 1) === true
```

아이템을 보유하지 않은 상태에서는 장착할 수 없다.

MVP 1에서는 별도 클릭 UI가 아직 없으므로, reward item (보상 아이템)으로 장비를 획득하면 `GameScene (게임 씬)`에서 자동 장착을 시도한다.

## Equipment Slots (장비 슬롯)

```ts
type EquipmentSlot = "weapon" | "armor" | "accessory";
```

MVP 1 slots (1차 MVP 슬롯):

- `weapon (무기)`
- `armor (방어구)`
- `accessory (장신구)`

## Equipment Data (장비 데이터)

```ts
interface EquipmentData {
  slot: EquipmentSlot;
  stats: EquipmentStatBonus;
}

interface EquipmentStatBonus {
  maxHp: number;
  attack: number;
  defense: number;
}
```

MVP 1 equipment items (1차 MVP 장비):

- `rusty_training_sword (낡은 수련검)` - weapon, attack 중심
- `worn_apprentice_armor (수습기사의 낡은 갑옷)` - armor, maxHp/defense 중심
- `cracked_apprentice_ring (금 간 수습기사 반지)` - accessory, 소량 복합 스탯

Guaranteed stage rewards (스테이지 보장 보상):

```text
dawn_forest_3_clear -> rusty_training_sword
mist_gate_3_clear -> worn_apprentice_armor
old_mine_3_clear -> cracked_apprentice_ring
```

MVP 1 inventory is quantity-based (수량 기반)이라 이미 보유한 장비가 다시 지급되어도 저장 구조가 깨지지 않는다.

## Effective Stats (최종 스탯)

중요 원칙:

```text
PlayerState = 성장으로 오른 기본 스탯 원본
EquipmentState = 장착한 itemId 목록
EffectivePlayerStats = 전투에 사용하는 최종 스탯
```

장비 장착/해제 시 아래처럼 직접 누적하지 않는다.

```ts
player.attack += item.attack; // 금지
player.defense += item.defense; // 금지
player.maxHp += item.maxHp; // 금지
```

대신 매번 계산한다.

```ts
effective.attack = player.attack + equipmentBonus.attack;
effective.defense = player.defense + equipmentBonus.defense;
effective.maxHp = player.maxHp + equipmentBonus.maxHp;
```

## HP Policy (HP 처리 정책)

```text
Equip (장착): 현재 hp는 그대로 유지한다.
Unequip (해제): 현재 hp가 effectiveMaxHp보다 높으면 effectiveMaxHp로 clamp 한다.
```

장비 장착만으로 자동 풀회복되지 않는다.

## Combat Connection (전투 연결)

`CombatSystem (전투 시스템)`은 전투 계산 시 `EffectivePlayerStats (최종 플레이어 스탯)`를 사용한다.

```ts
combatSystem.update(delta, player, effectivePlayerStats, monster);
```

`PlayerState.hp`는 실제 현재 체력으로 유지하고, damage calculation (피해 계산)에는 장비 보너스가 포함된 attack/defense를 사용한다.

`SkillSystem (스킬 시스템)`도 skill damage calculation (스킬 피해 계산)에 같은 `EffectivePlayerStats (최종 플레이어 스탯)`를 사용한다. 장비 장착/해제는 스킬 발동 시에도 `player.attack`, `player.defense`, `player.maxHp`에 직접 누적되지 않는다.

## Save Fallback (저장 fallback)

기존 저장 데이터에는 `equipment`가 없을 수 있다.

```ts
equipment: saved?.equipment ?? { equipped: {} }
```

저장 시에는 `EquipmentSystem.toState()` 결과를 `SaveData.equipment`에 포함한다.

## 2026-06-13 Equipment Slot Expansion Update (장비 슬롯 확장 갱신)

Status (상태): Implemented with Option B (Option B 기준 구현).

Implemented Scope (구현 범위):

- EquipmentSlot (장비 슬롯)을 `weapon`, `helmet`, `armor`, `boots`, `necklace`, `ring`으로 확장했다.
- 기존 `accessory` 슬롯은 신규 데이터에서는 사용하지 않는다.
- 기존 저장 데이터에 `accessory`가 남아 있을 경우 `ring`으로 읽는 fallback을 유지한다.
- Weapon equipment (무기 장비)에만 `weaponType`을 추가했다.
- MVP 1 weaponType (무기 종류)는 `sword`, `spear`, `axe`만 허용한다.
- EquipmentSystem은 장착 상태와 장비 보너스 계산만 담당한다.
- 장비 장착/해제는 여전히 `player.attack`, `player.defense`, `player.maxHp`에 직접 누적하지 않는다.

New Equipment Items (신규 장비 아이템):

| itemId | Slot | weaponType | Note |
| --- | --- | --- | --- |
| `bent_training_spear` | `weapon` | `spear` | 신규 수련창 |
| `chipped_training_axe` | `weapon` | `axe` | 신규 수련도끼 |
| `dented_apprentice_helmet` | `helmet` | - | 신규 투구 |
| `worn_apprentice_boots` | `boots` | - | 신규 신발 |
| `frayed_apprentice_necklace` | `necklace` | - | 신규 목걸이 |

Preserved Scope (유지 범위):

- CombatSystem / SkillSystem / RewardSystem / RewardResolver / DropResolver / StageProgressSystem은 수정하지 않는다.
- 신규 장비 5종은 `data/items.json` 등록까지만 완료했다.
- 신규 장비의 dropTable / reward / stage clear reward 연결은 별도 승인 전까지 진행하지 않는다.
- Batch 2 Equipment / Material Icons 작업은 장비 슬롯 확정 후 v2로 다시 작성한다.

Future Candidate Only (문서 후보로만 유지):

- `weaponProfile`
- `DamageType`
- 무기별 상세 전투 공식
- 장비 강화 / 랜덤 옵션 / 세트 효과

## MVP 1 Exclusions (1차 MVP 제외)

- 랜덤 옵션 장비
- 장비 강화
- 장비 개별 인스턴스 ID
- 같은 장비 여러 개 중 특정 1개 장착
- 장비 등급별 랜덤 옵션
- 장비 세트 효과
