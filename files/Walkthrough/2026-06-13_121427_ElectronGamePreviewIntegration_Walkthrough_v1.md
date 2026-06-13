# Electron Game Preview Integration Walkthrough v1

작성 시각: 2026-06-13 12:14:27

## 구현 요약

`Electron Game Preview Integration (Electron 게임 미리보기 연동)` 조건부 승인 내용을 반영했다.

구현 목표:

- `codex-electron-console` Electron 창 안에서 `idle-rpg-mvp` Vite dev server URL을 미리보기로 표시
- iframe 우선 방식 사용
- 허용된 로컬 Vite URL만 로드
- dev server 자동 실행, preload, child_process, Codex bridge는 구현하지 않음
- `idle-rpg-mvp` 게임 로직은 수정하지 않음

## 수정 파일

Electron 프로젝트:

```text
C:\Users\jmj\Desktop\코덱스 자료\codex-electron-console\main.js
C:\Users\jmj\Desktop\코덱스 자료\codex-electron-console\index.html
C:\Users\jmj\Desktop\코덱스 자료\codex-electron-console\README.md
```

idle-rpg-mvp 문서:

```text
docs/MANUAL_PLAYTEST_CHECKLIST.md
files/Walkthrough/2026-06-13_121427_ElectronGamePreviewIntegration_Walkthrough_v1.md
```

## Electron Preview 구성

현재 구성:

```text
codex-electron-console main.js
-> loadFile(index.html)
-> index.html iframe
-> idle-rpg-mvp Vite dev server URL
```

`main.js` 변경:

- BrowserWindow 기본 크기 확대
  - `width: 1440`
  - `height: 900`
  - `minWidth: 1180`
  - `minHeight: 760`
- 기존 `win.loadFile(path.join(__dirname, "index.html"))` 유지
- 기존 보안 설정 유지
  - `contextIsolation: true`
  - `nodeIntegration: false`

추가하지 않은 것:

```text
preload
child_process
dev server 자동 실행
게임 프로젝트 경로 하드코딩
```

## URL 제한

`index.html`에서 아래 URL만 허용한다.

```text
http://127.0.0.1:5173/
http://127.0.0.1:5174/
http://127.0.0.1:5175/
http://localhost:5173/
http://localhost:5174/
http://localhost:5175/
```

그 외 URL은 iframe에 로드하지 않고 안내 문구를 표시한다.

## iframe 우선 구조

이번 구현은 iframe 방식이다.

다만 `index.html`의 preview host를 단순하게 유지하고 주석을 남겨, 추후 iframe에서 입력/스케일/포커스 문제가 생기면 아래 방식으로 전환할 수 있게 했다.

```text
webview
BrowserWindow.loadURL
```

이번 작업에서는 webview와 loadURL 전환을 구현하지 않았다.

## 문서 변경

`docs/MANUAL_PLAYTEST_CHECKLIST.md`에 Electron preview 확인 절차를 짧게 추가했다.

추가 내용:

- 게임 dev server 먼저 실행
- `codex-electron-console`에서 `npm.cmd start`
- Electron 화면에서 허용된 로컬 Vite URL만 Load
- iframe 문제가 있으면 후속 작업에서 webview/loadURL 검토

## 검증 결과

Electron 파일 문법:

```powershell
node --check main.js
```

결과:

```text
pass
```

Electron HTML inline script 문법:

```text
Checked 1 inline script block(s).
```

idle-rpg-mvp typecheck:

```powershell
npm.cmd run typecheck
```

결과:

```text
pass
```

idle-rpg-mvp build:

```powershell
npm.cmd run build
```

결과:

```text
pass with existing Vite chunk size warning
```

Electron 실행:

```powershell
cd "C:\Users\jmj\Desktop\코덱스 자료\codex-electron-console"
npm.cmd start
```

결과:

```text
Electron 창 실행 명령 완료
```

## git diff 확인

idle-rpg-mvp 변경 파일:

```text
docs/MANUAL_PLAYTEST_CHECKLIST.md
files/Walkthrough/2026-06-13_121427_ElectronGamePreviewIntegration_Walkthrough_v1.md
```

idle-rpg-mvp 금지 파일 변경 확인:

```text
git diff --name-only -- src data
```

결과:

```text
no changes
```

즉, 아래 금지 파일은 수정하지 않았다.

```text
src/systems/*
src/scenes/GameScene.ts
src/ui/Hud.ts
data/*.json
```

## Git 주의사항

`codex-electron-console` 폴더는 현재 Git 저장소가 아니다.

확인 결과:

```text
fatal: not a git repository
```

따라서 실제 Electron 구현 파일인 `main.js`, `index.html`, `README.md`는 현재 GitHub push 대상이 아니다.

이번 커밋/푸시는 Git 저장소인 `idle-rpg-mvp` 안의 문서/Walkthrough 변경만 대상으로 한다.

Electron 프로젝트 변경을 GitHub에 올리려면 후속으로 아래 중 하나가 필요하다.

```text
1. codex-electron-console을 별도 Git 저장소로 초기화하고 원격 저장소 연결
2. codex-electron-console을 기존 idle-rpg-mvp 저장소 하위 프로젝트로 이동
3. 현재처럼 로컬 별도 프로젝트로 유지하고 수동 백업
```

현재 원칙은 "두 프로젝트를 합치지 않는다"이므로 1번이 가장 자연스럽다.

## 사용자가 확인할 항목

1. `idle-rpg-mvp` dev server 실행
2. `codex-electron-console` Electron 앱 실행
3. Electron에서 `5174` 또는 현재 Vite URL 버튼 클릭
4. iframe 안에서 게임 화면이 보이는지 확인
5. 키보드/마우스 입력, 화면 스케일 문제가 있는지 확인
6. 문제가 있으면 다음 작업에서 webview 또는 BrowserWindow.loadURL 전환 검토

## 남은 TODO

- 실제 Electron iframe 내부 게임 조작감 확인
- iframe 포커스/스케일 문제가 있으면 webview/loadURL 대안 구현
- codex-electron-console Git 저장소 처리 방안 결정
- Codex panel, game state bridge, log bridge는 아직 보류

