# Batch 5 Region Background Storage Walkthrough v1

작성 시각: 2026-06-14 19:03:58

## 작업 요약

Batch 5 지역 배경 3장을 검토용 생성본에서 최종 게임용 배경 파일로 변환해 저장했다.

이번 작업은 이미지 저장까지만 진행했다.
게임 코드 연결, `src` 수정, `data` 수정은 하지 않았다.

## 저장한 배경

| Region | Source Preview | Final Path |
| --- | --- | --- |
| Dawn Forest | `C:\Users\jmj\AppData\Local\Temp\idle-rpg-mvp-preview\batch5-backgrounds\bg_dawn_forest_preview.png` | `public/assets/backgrounds/regions/bg_dawn_forest.png` |
| Mist Gate | `C:\Users\jmj\AppData\Local\Temp\idle-rpg-mvp-preview\batch5-backgrounds\bg_mist_gate_preview.png` | `public/assets/backgrounds/regions/bg_mist_gate.png` |
| Old Mine | `C:\Users\jmj\AppData\Local\Temp\idle-rpg-mvp-preview\batch5-backgrounds\bg_old_mine_preview.png` | `public/assets/backgrounds/regions/bg_old_mine.png` |

## 변환 기준

- 최종 해상도: `1280x720`
- 파일 형식: PNG
- 배경 형태: opaque background
- 원본 생성 파일은 수정하지 않음
- 최종 저장본만 `public/assets/backgrounds/regions/`에 저장
- contact sheet는 repo에 저장하지 않음

## 해상도 확인

| File | Width | Height | PixelFormat |
| --- | ---: | ---: | --- |
| `bg_dawn_forest.png` | 1280 | 720 | `Format24bppRgb` |
| `bg_mist_gate.png` | 1280 | 720 | `Format24bppRgb` |
| `bg_old_mine.png` | 1280 | 720 | `Format24bppRgb` |

## 콘텐츠 확인

3개 배경 모두 아래 조건을 기준으로 검토했다.

- 텍스트 없음
- UI 없음
- 캐릭터 없음
- 몬스터 없음
- 워터마크 없음
- 중앙 전투 영역 유지

## 생성 폴더

```text
public/assets/backgrounds/regions/
```

## 코드 및 데이터 변경

이번 작업에서는 아래 영역을 수정하지 않았다.

- `src/`
- `data/`
- 기존 보류 파일
- `docs/AGENT_HANDOFF.md`

## 다음 단계

다음 추천 작업은 `Region Background Visual Integration Plan v1` 기준으로 저장된 배경을 게임 화면에서 preload하고, 현재 임시 배경 또는 단색 배경을 지역별 배경 이미지로 교체하는 설계다.

단, 실제 코드 연결은 별도 승인 후 진행한다.
