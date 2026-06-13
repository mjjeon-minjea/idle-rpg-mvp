# Inventory System (인벤토리 시스템)

## Purpose (목적)

`InventorySystem (인벤토리 시스템)`은 MVP 단계에서 아이템 ID별 수량만 저장한다.

## Current Responsibility (현재 책임)

- Add items (아이템 추가)
- Check item ownership with `hasItem(itemId, quantity)` (`hasItem`으로 보유 여부 확인)
- Merge quantities by `itemId` (`itemId` 기준 수량 합산)
- Return inventory entries for HUD and save data (HUD/저장용 인벤토리 목록 반환)

## Not Implemented Yet (아직 미구현)

- Item use (아이템 사용)
- Item sorting (아이템 정렬)
- Equipment instance identity (장비 개별 인스턴스 ID)
- Equipment random options (장비 랜덤 옵션)

EquipmentSystem (장비 시스템)은 장착 상태와 장비 보너스 계산을 담당한다. InventorySystem (인벤토리 시스템)은 아이템 보유 수량만 담당한다.
