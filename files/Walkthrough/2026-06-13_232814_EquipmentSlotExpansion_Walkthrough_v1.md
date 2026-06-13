# Equipment Slot Expansion Walkthrough v1

Date: 2026-06-13 23:28

## 구현 요약

Equipment Slot Expansion (장비 슬롯 확장)은 조건부 승인된 Option B 기준으로 구현했다.

- `weaponType`만 코드와 데이터에 반영했다.
- `weaponProfile`과 `DamageType`은 코드와 `data/items.json`에 넣지 않았다.
- CombatSystem / SkillSystem / RewardSystem / RewardResolver / DropResolver / StageProgressSystem은 수정하지 않았다.
- Batch 2 Equipment / Material Icons 작업은 계속 hold 상태다.

## 수정 파일

- `src/types/GameTypes.ts`
- `src/loaders/DataLoader.ts`
- `src/systems/EquipmentSystem.ts`
- `src/ui/Hud.ts`
- `data/items.json`
- `docs/EQUIPMENT_SYSTEM.md`
- `docs/DATA_SCHEMA.md`
- `docs/PROJECT_STATUS.md`
- `README.md`

## 장비 슬롯 구조

MVP 1 장비 슬롯:

```ts
weapon
helmet
armor
boots
necklace
ring
```

기존 `accessory` 슬롯은 신규 데이터에서 사용하지 않는다.
기존 저장 데이터에 `accessory`가 남아 있으면 `ring`으로 읽는 fallback을 유지한다.

## 무기 타입 구조

MVP 1 무기 타입:

```ts
sword
spear
axe
```

`weaponType`은 `slot === "weapon"`일 때만 허용된다.
무기가 아닌 장비에 `weaponType`이 있으면 DataLoader가 에러를 낸다.

## 신규 장비 등록

신규 장비 5종은 `data/items.json`에 등록만 했다.
획득 경로, 드랍 테이블, 스테이지 보상 연결은 하지 않았다.

| itemId | Slot | weaponType |
| --- | --- | --- |
| `bent_training_spear` | `weapon` | `spear` |
| `chipped_training_axe` | `weapon` | `axe` |
| `dented_apprentice_helmet` | `helmet` | - |
| `worn_apprentice_boots` | `boots` | - |
| `frayed_apprentice_necklace` | `necklace` | - |

## DataLoader 검증

추가 검증:

- 장비 슬롯은 `weapon`, `helmet`, `armor`, `boots`, `necklace`, `ring`만 허용
- 무기 장비는 `weaponType` 필수
- `weaponType`은 `sword`, `spear`, `axe`만 허용
- 무기가 아닌 장비는 `weaponType` 금지
- 음수 장비 스탯 금지 유지

## SaveSystem fallback 처리

저장 데이터 구조 자체는 변경하지 않았다.

`EquipmentSystem`에서 기존 저장 데이터의 `accessory` 값을 읽으면 `ring` 슬롯으로 이전해 사용한다.

```ts
ring: equipped.ring ?? equipped.accessory
```

## HUD 변경

HUD 장비 영역은 6슬롯 구조에 맞춰 장착 수와 장착된 장비 목록을 보여준다.

```text
Equipped
Slots: 2 / 6
- Weapon: ...
- Ring: ...
Bonus: HP +... / ATK +... / DEF +...
```

## 보류한 내용

- 신규 장비 드랍 연결
- 신규 장비 스테이지 보상 연결
- Batch 2 Icon Plan v2 재작성
- `weaponProfile`
- `DamageType`
- 무기별 전투 공식

## 검증 결과

아래 명령을 실행했다.

```powershell
npm.cmd run typecheck
npm.cmd run build
```

결과:

- `npm.cmd run typecheck`: 통과
- `npm.cmd run build`: 통과

참고:

- 첫 `npm.cmd run build`는 sandbox 권한 문제로 실패했다.
- 동일 명령을 권한 승인 상태로 재실행해 production build가 통과했다.
- Vite chunk size warning은 발생했지만 빌드 실패는 아니다.

추가 확인:

```powershell
rg "weaponProfile|DamageType" src data
rg "\"slot\": \"accessory\"" data src
rg "player.attack \\+=" src
rg "player.defense \\+=" src
rg "player.maxHp \\+=" src
```

결과:

- `weaponProfile` / `DamageType`: `src`, `data`에서 발견되지 않음
- `"slot": "accessory"`: `src`, `data`에서 발견되지 않음
- `player.attack +=`, `player.defense +=`, `player.maxHp +=`: 기존 `PlayerGrowthSystem` 레벨업 기본 스탯 증가만 발견됨
- 금지 파일 diff: CombatSystem / SkillSystem / RewardSystem / RewardResolver / DropResolver / StageProgressSystem / stage/monster/drop/reward/skill data / public assets 변경 없음

## 남은 TODO

- 사용자 승인 후 Batch 2 Equipment / Material Icons Plan v2 작성
- 사용자 승인 후 신규 장비 획득 경로 설계
- 수동 플레이에서 ring fallback과 장비 HUD 표시 확인
