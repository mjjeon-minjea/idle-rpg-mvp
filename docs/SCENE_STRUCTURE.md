# Scene Structure (씬 구조)

## Purpose (목적)

`GameScene (게임 씬)`은 Phaser lifecycle (Phaser 생명주기)와 시스템 호출을 연결한다.

## Current Responsibility (현재 책임)

- DataLoader (데이터 로더) 호출
- System instance (시스템 인스턴스) 생성
- Combat update (전투 업데이트) 호출
- Monster defeat flow (몬스터 처치 흐름) 연결
- HUD update (HUD 갱신)
- Periodic save (주기 저장)

## Rule (규칙)

`GameScene (게임 씬)`에 아래 로직을 몰아넣지 않는다.

- 전투 공식
- 보상 계산 공식
- 스테이지 진행 규칙
- 저장 포맷 마이그레이션
- 장비/스킬/환생/전직 시스템

현재 `GameScene.ts`는 MVP 연결부 역할을 하지만, 다음 기능이 늘어나면 orchestration (연결) 책임이 커질 수 있다. 큰 기능은 별도 시스템으로 분리한다.
