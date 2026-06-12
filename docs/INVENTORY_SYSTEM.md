# Inventory System (인벤토리 시스템)

## Purpose (목적)

`InventorySystem (인벤토리 시스템)`은 MVP 단계에서 아이템 ID별 수량만 저장한다.

## Current Responsibility (현재 책임)

- Add items (아이템 추가)
- Merge quantities by `itemId` (`itemId` 기준 수량 합산)
- Return inventory entries for HUD and save data (HUD/저장용 인벤토리 목록 반환)

## Not Implemented Yet (아직 미구현)

- Item use (아이템 사용)
- Item sorting (아이템 정렬)
- Equipment conversion (장비 변환)
- Equip/unequip (장착/해제)
- Equipment stats (장비 스탯)

EquipmentSystem (장비 시스템)은 다음 단계에서 별도 시스템으로 설계한다.
