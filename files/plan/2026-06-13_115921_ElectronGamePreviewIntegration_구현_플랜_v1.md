# Electron Game Preview Integration (Electron 게임 미리보기 연동) 구현 플랜 v1

작성 시각: 2026-06-13 11:59:21

## 1. Current Project Structure (현재 두 프로젝트 구조 요약)

### idle-rpg-mvp (실제 게임 프로젝트)

경로:

```text
C:\Users\jmj\Desktop\코덱스 자료\idle-rpg-mvp
```

역할:

- Phaser 3 + TypeScript + Vite 기반 실제 idle RPG 게임
- Stage 1~9, CombatSystem (전투 시스템), RewardSystem (보상 시스템), PlayerGrowthSystem (플레이어 성장 시스템), EquipmentSystem (장비 시스템), SkillSystem (스킬 시스템) 포함

실행 방식:

```powershell
cd "C:\Users\jmj\Desktop\코덱스 자료\idle-rpg-mvp"
npm.cmd run dev
```

`package.json` 기준:

```json
{
  "scripts": {
    "dev": "vite --host 127.0.0.1",
    "build": "tsc && vite build",
    "typecheck": "tsc --noEmit",
    "preview": "vite preview --host 127.0.0.1"
  }
}
```

Vite dev server URL:

```text
기본: http://127.0.0.1:5173/
현재 확인됨: http://127.0.0.1:5174/
```

주의:

- Vite는 `5173`이 사용 중이면 `5174`, `5175`처럼 다음 포트를 사용할 수 있다.
- Electron preview (Electron 미리보기)는 우선 사용자가 게임 dev server를 먼저 켜는 방식으로 설계한다.

### codex-electron-console (Electron 콘솔/미리보기 프로젝트)

경로:

```text
C:\Users\jmj\Desktop\코덱스 자료\codex-electron-console
```

현재 파일:

```text
package.json
main.js
index.html
node_modules/
```

현재 실행 방식:

```powershell
cd "C:\Users\jmj\Desktop\코덱스 자료\codex-electron-console"
npm.cmd start
```

`package.json` 기준:

```json
{
  "main": "main.js",
  "scripts": {
    "start": "electron ."
  },
  "type": "commonjs",
  "devDependencies": {
    "electron": "^42.4.0"
  }
}
```

현재 Electron 구조:

- Main Process (메인 프로세스): `main.js`
- Renderer (렌더러): `index.html`
- Preload (프리로드): 없음
- BrowserWindow (브라우저 창): `main.js`에서 생성
- 현재 로딩 방식: `win.loadFile(path.join(__dirname, "index.html"))`
- 현재 보안 설정:
  - `contextIsolation: true`
  - `nodeIntegration: false`

현재 Electron이 여는 화면:

```text
codex-electron-console/index.html
```

현재 `index.html`은 안내 문구만 표시한다. 게임 URL은 아직 열지 않는다.

## 2. Electron Preview Integration Responsibility (연동 책임 범위)

이번 작업의 책임은 Electron 창 안에서 `idle-rpg-mvp`의 Vite dev server URL을 표시하는 것이다.

포함 범위:

- Electron 앱 내부에 Game Preview (게임 미리보기) 영역 만들기
- `http://127.0.0.1:5173/` 또는 설정된 게임 URL 표시
- dev server가 꺼져 있으면 안내 화면 표시
- 사용자가 직접 URL을 새로고침하거나 다시 시도할 수 있는 최소 UI 제공
- 추후 Codex panel (Codex 패널), local console (로컬 콘솔), log bridge (로그 브릿지)를 붙일 수 있도록 구조 정리

## 3. Out of Scope (구현하지 말아야 할 범위)

이번 작업에서는 아래를 구현하지 않는다.

```text
게임 로직 변경
idle-rpg-mvp와 codex-electron-console 프로젝트 병합
CombatSystem / RewardSystem / PlayerGrowthSystem / EquipmentSystem / SkillSystem / StageSystem 수정
Electron에서 Vite dev server 자동 실행
Codex SDK 연동
codex app-server 연동
codex exec 연동
게임 상태 브릿지
전투 로그 수집
저장 데이터 편집 UI
스킬 강화 시스템
RebirthSystem
JobSystem
정식 런처/패키징
```

## 4. BrowserWindow Game URL Loading (BrowserWindow에서 Vite 게임 URL 여는 방식)

### MVP 권장 방식

`main.js`는 계속 `index.html`을 로드한다.

`index.html` 내부에서 `<webview>` 또는 `<iframe>`로 게임 URL을 표시하는 방식 중 하나를 선택한다.

권장안:

```text
MVP 1: iframe 방식
```

이유:

- 현재 목표는 단순 preview (미리보기)다.
- Node 접근이 필요 없다.
- 게임은 Vite dev server에서 독립 실행된다.
- Electron main process를 최소 수정으로 유지할 수 있다.

예상 구조:

```html
<iframe
  id="game-preview"
  src="http://127.0.0.1:5173/"
></iframe>
```

단점:

- Vite가 실제로 `5174`를 사용하면 기본 `5173` iframe은 실패한다.

보완:

- `index.html` 상단에 URL 입력/선택 필드를 둔다.
- 기본값은 `http://127.0.0.1:5173/`.
- 사용자가 현재 Vite 터미널에 표시된 URL을 입력하고 `Load (열기)` 버튼으로 변경할 수 있게 한다.

### 대안 방식

`main.js`에서 직접 `win.loadURL(gameUrl)`로 게임만 띄우는 방식도 가능하다.

장점:

- 제일 단순하다.
- Electron 창 전체가 게임 화면이 된다.

단점:

- dev server가 꺼져 있을 때 안내 UI를 보여주기 어렵다.
- 추후 Codex panel (Codex 패널), local console (로컬 콘솔)을 같은 창에 배치하기 어렵다.

따라서 이번 설계에서는 `index.html shell + iframe preview`가 더 낫다.

## 5. Dev Server Offline Handling (dev server가 꺼져 있을 때 안내/에러 처리)

MVP 1에서는 renderer JS에서 네트워크 상태를 직접 깊게 감지하지 않고, 간단한 안내 UI를 둔다.

안내 문구 예시:

```text
Game preview requires idle-rpg-mvp dev server.
게임 미리보기를 보려면 idle-rpg-mvp dev server가 먼저 실행되어야 합니다.

1. idle-rpg-mvp 폴더에서 npm.cmd run dev 실행
2. Vite Local URL 확인
3. 아래 입력칸에 URL 입력 후 Load 클릭
```

추가 가능:

- `Reload (새로고침)` 버튼
- `Open 5173` 버튼
- `Open 5174` 버튼
- 현재 로드 중인 URL 표시

자동 상태 감지까지는 필수 구현하지 않는다.

## 6. Manual Dev Server Start (Electron 실행 전 게임 dev server를 따로 켜는 방식)

이번 단계의 실행 순서:

```powershell
cd "C:\Users\jmj\Desktop\코덱스 자료\idle-rpg-mvp"
npm.cmd run dev
```

Vite가 표시한 Local URL 확인:

```text
Local: http://127.0.0.1:5173/
또는
Local: http://127.0.0.1:5174/
```

그 다음 Electron 실행:

```powershell
cd "C:\Users\jmj\Desktop\코덱스 자료\codex-electron-console"
npm.cmd start
```

Electron 화면에서 URL을 선택/입력하고 Load 한다.

## 7. Future Auto Launch Extension (추후 자동 실행 연동 가능성)

후속 작업으로 아래 기능을 추가할 수 있다.

- Electron main process에서 `child_process.spawn`으로 `idle-rpg-mvp` dev server 자동 실행
- Vite stdout을 읽어 실제 Local URL 자동 감지
- Electron 창 종료 시 dev server도 같이 종료
- dev server status indicator (서버 상태 표시)
- port fallback scan (5173~5176 자동 탐색)

이번 작업에서는 필수 구현하지 않는다.

## 8. Security Settings (보안 설정 주의사항)

현재 `main.js` 설정:

```js
webPreferences: {
  contextIsolation: true,
  nodeIntegration: false,
}
```

이번 작업에서도 유지한다.

권장 보안 원칙:

- `nodeIntegration: false` 유지
- `contextIsolation: true` 유지
- remote game page에 Node API 노출하지 않기
- preload (프리로드)는 이번 단계에서 만들지 않기
- 외부 웹사이트가 아니라 `127.0.0.1`만 preview 대상으로 사용
- iframe URL 입력값은 사용자가 직접 넣는 로컬 URL 중심으로 제한 안내

추후 bridge (브릿지)가 필요해지면 preload를 추가하되, 허용 API를 최소화한다.

## 9. Files To Create / Modify (새로 만들 파일과 수정할 파일 목록)

### codex-electron-console 수정 예정

필수:

```text
main.js
index.html
```

선택:

```text
README.md
```

현재 `codex-electron-console`에는 README가 없다. 구현 시 간단한 실행 안내 README를 추가할 수 있다.

### idle-rpg-mvp 수정 예정

문서만 수정 가능:

```text
README.md
docs/PROJECT_STATUS.md
docs/MANUAL_PLAYTEST_CHECKLIST.md
```

게임 코드 수정 없음:

```text
src/systems/*
src/scenes/GameScene.ts
src/ui/Hud.ts
data/*.json
```

위 파일들은 이번 Electron preview 구현에서 건드리지 않는다.

## 10. Implementation Order (구현 순서)

승인 후 구현 순서:

1. `codex-electron-console/main.js` 확인 및 BrowserWindow 크기 조정
   - 권장 크기: `width: 1440`, `height: 900`
   - 최소 크기: `minWidth: 1180`, `minHeight: 760`

2. `codex-electron-console/index.html`을 preview shell로 변경
   - 상단 toolbar (툴바)
   - URL input (URL 입력)
   - Load button (열기 버튼)
   - Reload button (새로고침 버튼)
   - iframe game preview (게임 미리보기)
   - dev server 안내 문구

3. 기본 URL 설정
   - 기본값: `http://127.0.0.1:5173/`
   - 빠른 버튼: `5173`, `5174`

4. `iframe.src`를 버튼 클릭으로 변경하는 renderer script 추가
   - 별도 파일 없이 `index.html` 내부 script로 충분
   - 추후 복잡해지면 `renderer.js`로 분리

5. 문서 갱신
   - `codex-electron-console/README.md` 추가 또는 갱신
   - `idle-rpg-mvp/README.md`에 Electron preview 실행 순서 링크/설명 추가
   - `docs/MANUAL_PLAYTEST_CHECKLIST.md`에 Electron preview 확인 절차 추가
   - `docs/PROJECT_STATUS.md`에 Electron preview integration 상태 반영

6. 검증
   - game dev server 실행
   - Electron 실행
   - Electron 안에서 게임 URL 표시 확인
   - dev server가 꺼졌을 때 안내 문구 확인

## 11. Verification Method (검증 방법)

### idle-rpg-mvp 검증

게임 프로젝트:

```powershell
cd "C:\Users\jmj\Desktop\코덱스 자료\idle-rpg-mvp"
npm.cmd run typecheck
npm.cmd run build
```

주의:

- 현재 환경에서는 Vite build가 sandbox 권한 문제로 실패할 수 있다.
- 승인 권한으로 실행하면 통과했던 이력이 있다.

### codex-electron-console 검증

Electron 프로젝트:

```powershell
cd "C:\Users\jmj\Desktop\코덱스 자료\codex-electron-console"
npm.cmd start
```

수동 확인:

```text
1. Electron 창이 뜨는지
2. toolbar가 보이는지
3. 기본 URL이 http://127.0.0.1:5173/인지
4. 현재 Vite URL이 5174이면 URL을 5174로 바꿔 Load 가능한지
5. iframe 안에 게임 화면이 보이는지
6. Stage 1~9 manual playtest 화면이 Electron 내부에서도 보이는지
7. dev server가 꺼져 있을 때 사용자가 무엇을 해야 하는지 안내가 보이는지
```

## 12. Expected Risks (예상 리스크)

1. Port mismatch (포트 불일치)

- Vite가 `5173`이 아니라 `5174`로 뜰 수 있다.
- 해결: URL input과 5173/5174 quick button 제공.

2. iframe rendering issue (iframe 표시 문제)

- Vite dev server가 Electron iframe 안에서 문제없이 표시되는지 확인 필요.
- 일반적으로 localhost iframe은 가능하지만, Electron/CSP 설정에 따라 확인 필요.

3. Dev server offline (게임 서버 미실행)

- Electron만 실행하면 게임 iframe이 빈 화면 또는 연결 실패가 될 수 있다.
- 해결: 안내 문구와 실행 순서 문서화.

4. 화면 크기 (창 크기)

- 게임은 1280 x 720 기준으로 정리되어 있다.
- Electron 창이 너무 작으면 가독성이 떨어질 수 있다.
- 해결: BrowserWindow 기본/최소 크기 상향.

5. Future bridge security (향후 브릿지 보안)

- Codex panel, log bridge, save editor 등을 붙일 때 preload 설계가 필요하다.
- 이번 작업에서는 bridge를 만들지 않는다.

## Final Direction (최종 방향)

이번 1차 Electron 연동은 아래 목표만 달성한다.

```text
Electron shell
-> local Vite game URL 입력/선택
-> iframe game preview 표시
-> dev server 수동 실행 안내
```

후속 확장:

```text
Auto dev server launch
Game status bridge
Battle log bridge
Codex panel
Save inspection panel
Local QA tools
```

