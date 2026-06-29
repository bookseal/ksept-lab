# Hello Full-Stack

A minimal full-stack "hello world": a **Flask** API and a **React + Vite**
frontend that calls it.

```
.
├── backend/      Flask API (GET /api/hello)
└── frontend/     React app that fetches and displays the message
```

## Running locally

You need **two terminals** — one per server.

### Terminal 1 — backend

```bash
python -m venv .venv          # first time only
source .venv/bin/activate     # Windows: .venv\Scripts\activate
pip install -r backend/requirements.txt
python backend/app.py         # serves on http://localhost:5001
```

### Terminal 2 — frontend

```bash
cd frontend
npm install                   # first time only
npm run dev                   # serves on http://localhost:5173
```

Open **http://localhost:5173** — the page fetches `/api/hello` (proxied to
Flask) and displays `Hello from Flask`.

See [backend/README.md](backend/README.md) and
[frontend/README.md](frontend/README.md) for details.

## 개념 노트 & 변경 이력 (GitHub Pages)

[`docs/`](docs/) 폴더가 GitHub Pages로 서빙됩니다.

- **개념 노트** (`docs/index.html`): Flask, CORS, React, Vite, JSX, mount 등
  이 프로젝트에 등장하는 개념을 작동 방식 중심으로 정리 (한글 설명 + 영어
  Mermaid 다이어그램).
- **변경 이력** (`docs/history.html`): `main`에 push할 때마다 GitHub Actions가
  `git log`를 읽어 자동 생성합니다 ([scripts/gen_history.py](scripts/gen_history.py),
  워크플로는 [.github/workflows/pages.yml](.github/workflows/pages.yml)).

로컬에서 이력 페이지를 미리 보려면:

```bash
python3 scripts/gen_history.py   # docs/history.html 생성 (git 저장소 안에서)
```
