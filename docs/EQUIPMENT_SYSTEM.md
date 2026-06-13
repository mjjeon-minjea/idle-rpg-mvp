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

## Save Fallback (저장 fallback)

기존 저장 데이터에는 `equipment`가 없을 수 있다.

```ts
equipment: saved?.equipment ?? { equipped: {} }
```

저장 시에는 `EquipmentSystem.toState()` 결과를 `SaveData.equipment`에 포함한다.

## MVP 1 Exclusions (1차 MVP 제외)

- 랜덤 옵션 장비
- 장비 강화
- 장비 개별 인스턴스 ID
- 같은 장비 여러 개 중 특정 1개 장착
- 장비 등급별 랜덤 옵션
- 장비 세트 효과
