# KSEPT Summer Program — Building with LLMs

> 출처: <https://ksetp.netlify.app/> (depth-1 전체 수집본)
> A practical 5-day lab course. From API basics to production-ready applications.
>
> - 각 모듈 형식: **Lecture → Real Examples → Project Assignment**
> - Real examples는 Morphosis Solutions의 프로덕션 시스템에서 발췌
> - Instructor: **Larry Arnstein**

## 목차 (모듈 = 사이트 내비게이션)

| # | 모듈 | 경로 | 핵심 |
|---|------|------|------|
| 1 | Setup | `/setup` | VSCode, Git, Node, Python, Claude Code CLI, API key |
| 2 | Foundations | `/foundations` | API 기초, system prompt, streaming, error handling |
| 3 | Tools & Structure | `/tools` | function/tool calling, structured output, schema, MCP |
| 4 | Context Management | `/context` | embeddings, vector DB, RAG, memory, chunking |
| 5 | Architecture & Agents | `/agents` | agent loop, Claude Code 내부, subagents, memory scope, 멀티모델 |
| 6 | Production Considerations | `/production` | eval/testing, guardrails/security, observability |
| 7 | Workshop | `/workshop` | 빌드 데이 — 이전 프로젝트 확장 or 신규 |

---

## Module 1 · Setup — 수업 전 환경 구성

설치 대상:
1. **VSCode** — 코드를 들여다보기 위한 IDE (필수는 아니지만 필요해짐)
2. **Node.js (LTS)** — React 프론트엔드 툴링
3. **Python 3.11** — Flask 백엔드
4. **Claude Code CLI** — 앱 스캐폴딩용 AI 코딩 어시스턴트
5. **Anthropic API key** — 공유 `~/ksept-lab/.env`에 한 번만 저장, 코스의 모든 예제 앱이 트리를 거슬러 올라가 자동 인식

> macOS는 [Homebrew](https://brew.sh), Windows는 [winget](https://learn.microsoft.com/windows/package-manager/winget/)(Win11 기본 탑재).

### 1/7 · VSCode
```bash
# macOS
brew install --cask visual-studio-code
# Windows
winget install Microsoft.VisualStudioCode
# Verify
code --version
```
`code` 명령이 없으면 — macOS: VSCode → ⌘⇧P → "Shell Command: Install 'code' command in PATH". Windows: 설치 재실행 후 "Add to PATH" 체크.

### 2/7 · Git
각 수정을 개별 커밋으로 추적 → 발표 때 "diff를 따라 걷기". macOS는 보통 이미 있음(Xcode CLT), Windows는 명시적 설치 필요.
```bash
# macOS
brew install git    # 없을 때만
# Windows
winget install Git.Git
# Verify
git --version    # git version 2.x.x
```
> GitHub 계정/원격 불필요 — git은 완전히 로컬로 동작. repo는 프로젝트 안의 숨김 `.git/` 폴더일 뿐.

### 3/7 · Node.js (LTS)
```bash
# macOS
brew install node
# Windows
winget install OpenJS.NodeJS.LTS
# Verify
node --version    # v20.x.x or v22.x.x
npm --version
```
또는 [nodejs.org](https://nodejs.org) → LTS(v20/v22).

### 4/7 · Python 3.11
```bash
# macOS
brew install python@3.11
# Windows
winget install Python.Python.3.11
# Verify
python3.11 --version    # Python 3.11.x
py -3.11 --version      # Windows: py 런처가 -3.11로 특정 버전 선택
```

### 5/7 · 프로젝트 폴더 + venv
```bash
# macOS
mkdir ~/ksept-lab
cd ~/ksept-lab
python3.11 -m venv .venv
source .venv/bin/activate

# Windows (PowerShell)
mkdir ~/ksept-lab
cd ~/ksept-lab
py -3.11 -m venv .venv
.venv\Scripts\Activate.ps1
```
> **venv** = 이 프로젝트 전용 격리 Python 환경. 활성화 중 `pip install`한 건 시스템 Python이 아니라 여기로 들어감.
> Windows에서 PowerShell이 스크립트를 막으면 한 번만: `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned`.
```bash
# Verify
which python              # .../ksept-lab/.venv/bin/python 로 끝나야 함
Get-Command python        # Windows: ...\ksept-lab\.venv\Scripts\python.exe
```

### 6/7 · Claude Code CLI
```bash
# macOS
npm install -g @anthropic-ai/claude-code
# Windows (자체 바이너리, Node 불필요, 자동 업데이트)
irm https://claude.ai/install.ps1 | iex
# winget install Anthropic.ClaudeCode 도 가능
# Verify
claude --version
```
프로젝트 열고 시작:
```bash
cd ~/ksept-lab
code .     # VSCode로 폴더 열기
# VSCode 통합 터미널에서:
claude     # 첫 실행 시 로그인 안내
```

### 7/7 · Anthropic API key
챗 앱(및 코스의 모든 예제 앱)이 Claude 호출에 사용. **Claude Code 자체는 불필요**(자체 로그인 보유) — 이 단계는 *당신의 앱*용.

1. [console.anthropic.com/settings/keys](https://console.anthropic.com/settings/keys) → **Create Key** → 지금 복사(다시 안 보임)
2. 루트의 **공유 `.env` 한 곳**에 저장:
```bash
# macOS
cd ~/ksept-lab
echo 'ANTHROPIC_API_KEY=sk-ant-...your-key-here...' > .env
cat .env

# Windows
cd ~/ksept-lab
'ANTHROPIC_API_KEY=sk-ant-...your-key-here...' | Out-File -Encoding ascii .env
type .env
```
> `.env`는 git에서 제외. 각 앱보다 한 단계 위(`~/ksept-lab/`)에 살기 때문에 모든 프로젝트 바깥에 있음.

---

## Module 2 · Foundations — API 기초 / 첫 앱 / 스트리밍

### "Product Orchestrator"의 부상
- **Then:** 엔지니어링 팀(스펙→코드 전문가) + PM(비전·스펙, 빌드 대기)
- **Now:** Product Orchestrator — 코딩 에이전트를 지휘, 소프트웨어 아키텍처 + 제품/시장 전문성을 체화

### Hello-World 풀스택 스캐폴드
```bash
# 1. code ~/ksept-lab  로 프로젝트 열기
# 2. Terminal → New Terminal
# 3. 자동 수락 모드로 Claude 시작:
claude --permission-mode acceptEdits
# 4. (강의 제공 프롬프트 붙여넣기)
```

프로젝트 구조:
```
ksept-lab/
├── .venv/
├── README.md
├── backend/
│   ├── app.py
│   ├── requirements.txt
│   └── README.md
└── frontend/
    ├── index.html
    ├── package.json
    ├── vite.config.js
    ├── public/
    └── src/
        ├── main.jsx
        ├── App.jsx
        └── index.css
```

**Backend (Flask):** 단일 파일 `app.py` / `GET /api/hello` → `{"message": "Hello from Flask"}` / CORS 활성화 / `requirements.txt`: flask, flask-cors.
**Frontend (React+Vite, 순수 JS):** `App.jsx`가 mount 시 `/api/hello` fetch → 표시 / `vite.config.js`가 `/api/*`를 `http://localhost:5000`으로 프록시.

개발자로 실행:
```bash
# Terminal 1 — Backend (macOS)
cd ~/ksept-lab
source .venv/bin/activate
cd backend
pip install -r requirements.txt
python app.py            # → http://127.0.0.1:5000

# Terminal 2 — Frontend
cd ~/ksept-lab/frontend
npm install
npm run dev              # → http://localhost:5173
```

#### 프로덕션 배포
아키텍처: Browser → **Nginx** (단일 origin, HTTPS :443; React 정적파일 `dist/` 서빙 + `/api/*`를 Gunicorn으로 리버스 프록시) → **Gunicorn** (Flask, worker 4).

```dockerfile
# stage 1 — build React to static files
FROM node:20-slim AS web
WORKDIR /web
COPY frontend/ .
RUN npm ci && npm run build

# stage 2 — Flask + nginx in one image
FROM python:3.12-slim
RUN apt-get update && apt-get install -y nginx
WORKDIR /app
COPY backend/requirements.txt .
RUN pip install -r requirements.txt
COPY backend/ .
COPY --from=web /web/dist /usr/share/nginx/html
COPY deploy/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD gunicorn -w 4 -b 127.0.0.1:8000 app:app & \
    nginx -g 'daemon off;'
```
- **Nginx** — TLS 종료, 정적 React 서빙, `/api/*` 백엔드 전달
- **Gunicorn** — 프로덕션 WSGI 서버, 멀티 워커로 동시 요청 처리

### LLM이란
토큰(단어/부분단어)을 앞선 토큰 기반으로 생성하는 신경망. 학습: 수조 토큰, 수천억 파라미터, 한 번에 한 토큰씩 모든 이전 컨텍스트를 조건으로.

**잘하는 것:** 일관된 텍스트 생성(산문/코드/요약), 학습 데이터 기반 질의응답 ⚠️, 번역(자연어/코드), 지저분한 텍스트에서 구조화 정보 추출, 이미지 읽기(OCR/객체/장면), 경계 있는 문제의 단계적 추론.
**도움 없이는 못하는 것:** 이전 대화 기억, 최신 정보 조회, 실세계 행동(이메일/DB), 코드 실행/도구 사용, 자기 답 검증.
> ⚠️ **Hallucination:** LLM은 참/거짓과 무관하게 그럴듯한 답을 유창·자신만만하게 생성. 강한 성능엔 신뢰·검증된 입력 컨텍스트가 필요.

#### AI 챗 앱 vs LLM API
| 항목 | AI 챗 앱(claude.ai 등) | LLM API(Anthropic 등) |
|---|---|---|
| 성격 | 벤더 완성 앱 | 개발자용 원시 모델 접근 |
| 대화 기억 | 자동 | 매 요청마다 전체 히스토리 전송 |
| 도구 | 사전 내장 | 직접 구축/제공 |
| 스트리밍·UI | 벤더 처리 | 직접 선택 |
| 과금 | 구독 | 토큰당 |
| 대상 | 최종 사용자 | 제품 출시 개발자 |

### 첫 API 호출
```python
from anthropic import Anthropic
client = Anthropic()    # 환경변수 ANTHROPIC_API_KEY 읽음

resp = client.messages.create(
    model="claude-sonnet-4-6",
    max_tokens=256,
    system="You are a tax advisor, only answer questions about taxes otherwise politely decline to answer.",
    messages=[
        {"role": "user", "content": "What if I don't pay my estimated taxes on time?"},
    ],
)

print(resp.content[0].text)
```
- `max_tokens` 필수
- 응답은 단일 문자열이 아니라 **content block 배열**
- 단순 호출은 보통 첫 블록 사용

### 첫 LLM 앱: 최소 챗 (chat-app)
아키텍처: Front End(React+Vite :5173) → Back End(Flask `/api/chat` :5000) → Claude API(`claude-sonnet-4-6`).

다운로드: [chat-app.zip](https://ksetp.netlify.app/assets/foundations/chat-app.zip) → `~/ksept-lab`에 unzip → `chat-app/` 생성.
```bash
# Terminal 1 — Backend
cd ~/ksept-lab/chat-app
python3.11 -m venv .venv
source .venv/bin/activate
cd backend
pip install -r requirements.txt
python app.py            # ~/ksept-lab/.env 에서 ANTHROPIC_API_KEY 읽음

# Terminal 2 — Frontend
cd ~/ksept-lab/chat-app/frontend
npm install
npm run dev
```

**backend/app.py:**
```python
from flask import Flask, request, jsonify
from flask_cors import CORS
from anthropic import Anthropic
from dotenv import load_dotenv, find_dotenv

# cwd에서 위로 거슬러 올라가며 .env 탐색 — 코스 공유 ~/ksept-lab/.env 인식
load_dotenv(find_dotenv(usecwd=True))

app = Flask(__name__)
CORS(app)
client = Anthropic()

@app.route("/api/chat", methods=["POST"])
def chat():
    user_message = request.json["message"]

    resp = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=512,
        system="You are a helpful assistant. Keep replies brief.",
        messages=[{"role": "user", "content": user_message}],
    )

    return jsonify({"reply": resp.content[0].text})

if __name__ == "__main__":
    app.run(port=5000, debug=True)
```

**frontend/src/App.jsx:**
```javascript
import { useState } from 'react'

export default function App() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')

  async function send(e) {
    e.preventDefault()
    if (!input.trim()) return

    const userMsg = { role: 'user', text: input }
    setMessages((m) => [...m, userMsg])
    setInput('')

    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: input }),
    })
    const data = await res.json()

    setMessages((m) => [...m, { role: 'assistant', text: data.reply }])
  }

  return (
    <div className="app">
      <h1>Chat</h1>
      <div className="messages">
        {messages.map((m, i) => (
          <div key={i} className={`msg msg-${m.role}`}>
            <b>{m.role}:</b> {m.text}
          </div>
        ))}
      </div>
      <form onSubmit={send}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  )
}
```

#### 찾아야 할 결함 (테스트 시나리오)
1. "My name is Alex." → "What is my name?" — 봇이 기억하는가? (**대화 기억 없음**)
2. 몇 초 걸리는 긴 질문 — 대기 중 UI는? (**로딩 상태 없음**)
3. 백엔드 Ctrl+C 후 메시지 전송 — 무슨 일이? (**프론트 에러 처리 없음**)
4. `backend/app.py` 리뷰 — API가 5xx/rate limit/invalid key면? (**백엔드 에러 처리 없음**)
5. 긴 답변 요청 — 스트리밍되나 한 번에 뜨나? (**스트리밍 없음**)

### Project Assignment: Claude Code로 결함 3개 수정
```bash
cd ~/ksept-lab/chat-app
git init
git add .
git commit -m "starter"
```
선택지: ① 대화 기억 없음 ② UI 로딩 상태 없음 ③ 프론트 에러 처리 없음 ④ 백엔드 에러 처리 없음 ⑤ 스트리밍 없음 ⑥ 직접 발견한 이슈.

각 수정 절차:
1. **Claude Code에 프롬프트** — 구현이 아니라 *원하는 동작*을 설명
2. 수락 전 **diff 읽기**
3. 원래 실패 시나리오 재현으로 **검증**
4. **커밋:** `git commit -am "fix: <deficiency>"`

Claude Code 활용 베스트 프랙티스:
- 먼저 계획 요청: "How would you fix this? Outline steps — don't write code yet."
- 트레이드오프와 함께 옵션 요청: "What are approaches? Which do you recommend, and why?"
- 아키텍처 결정은 본인이.

발표 도구: VSCode Source Control 패널(시각적 diff) / `git log --oneline` + `git show <hash>`로 한 수정씩 진행 / Claude Code를 선생처럼 써서 각 해법을 이해.

### Streaming
기본 클라이언트:
```python
with client.messages.stream(
    model="claude-sonnet-4-6",
    max_tokens=512,
    system="You are a tax advisor, only answer questions about taxes otherwise politely decline to answer.",
    messages=[{"role": "user", "content": "What happens if I don't pay my estimated taxes on time?"}],
) as stream:
    for text in stream.text_stream:
        print(text, end="", flush=True)
```

엔드투엔드(백→프론트) — **Backend, Flask + SSE:**
```python
from flask import Flask, request, Response

@app.route("/api/chat/stream", methods=["POST"])
def chat_stream():
    user_message = request.json["message"]

    def event_stream():
        with client.messages.stream(
            model="claude-sonnet-4-6",
            max_tokens=512,
            messages=[{"role": "user", "content": user_message}],
        ) as stream:
            for text in stream.text_stream:
                # SSE wire format: "data: <chunk>\n\n"
                yield f"data: {text}\n\n"
        yield "event: done\ndata: \n\n"

    return Response(event_stream(), mimetype="text/event-stream")
```

**Frontend — React SSE 파서 (Part 1: 스트림 열기):**
```javascript
async function send(message, onChunk) {
  const res = await fetch('/api/chat/stream', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message }),
  })

  const reader = res.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''
  // …read loop, next section →
```

**Part 2: 바이트 읽고 이벤트 파싱:**
```javascript
  while (true) {
    const { value, done } = await reader.read()
    if (done) break
    buffer += decoder.decode(value, { stream: true })

    // SSE messages are separated by blank lines
    const parts = buffer.split('\n\n')
    buffer = parts.pop()
    for (const part of parts) {
      if (part.startsWith('data: ')) {
        onChunk(part.slice(6))     // append to UI
      }
    }
  }
}
```
- `reader.read()` = 원시 바이트; 이 루프가 곧 SSE 파서
- `done` = 서버가 스트림 종료 신호; 그때까지 루프
- `data:` 페이로드만 추출, `event:` 줄은 무시
- 같은 패턴이 FastAPI/Express 등 mid-response flush 가능한 모든 프레임워크에서 동작

---

## Module 3 · Tools & Structure — 출력 구조화의 4단계

실제 SQL 생성 데모로 구조/컨텍스트/프롬프트/에러처리/비용 최적화를 설명.

- **Level 1 · Parseable Output** — 포맷 규칙이 있는 단순 텍스트(코드펜스 금지, 특정 키워드). system prompt로 규칙 강제 + 방어적 후처리. 싸고 빠르지만 기계 검증 보장 없음.
- **Level 2 · True Structured Output** — JSON schema 검증으로 tool use 강제. 검증 실패 시 에러를 모델에 피드백해 자기 교정(여러 재시도). 검증된 데이터 또는 구조화된 422 보장.
- **Level 3 · Tool Use (Agent Loop)** — 모델이 반복 루프를 주도, 정보 수집/행동을 위해 도구 호출. ~20줄 루프 하나가 프레임워크 전반의 에이전트를 구동. 순서는 모델이 결정.
- **Level 4 · MCP (Model Context Protocol)** — 벤더가 도구 스키마를 한 번 publish하면 MCP 호환 클라이언트(Claude Desktop, Cursor, IDE 에이전트)가 손으로 배선 없이 사용. N×M 통합 문제를 N+M으로 전환.

**Project Assignment:** 제공 문서로 single-turn 구조화 추출기 구축 — JSON schema 정의, system prompt 규칙 작성, tool-choice로 출력 강제, **Pydantic** 검증, 실패 모드 처리, 샘플 전반 테스트.
다운로드: `extract-starter.zip` (`/assets/tools/extract-starter.zip`).

---

## Module 4 · Context Management — Indexing / RAG

라이브 데모: **Solutions Manager** — 인덱싱된 Drive 콘텐츠 + 인용 포함 챗(aeiplatform). 자연어 질의 → 여러 회사·문서에 걸친 인라인 인용 답변.

**Indexing 도전:** 포맷마다 별도 텍스트 추출(docs/sheets/slides/PDF), 청킹 결정이 검색 품질 좌우, 배치 경제성(API 요청 한도), 멱등성(재인덱싱 시 중복 방지), **동일 모델 불변식**(인덱스/쿼리 시 동일 임베더).
**RAG 도전:** 컨텍스트 예산(보통 50–80K 토큰), 커버리지(교차 질의가 모든 소스에 도달), 모든 사실 주장에 인용, 후속 질문(쿼리 재작성), 구조화 데이터로 벡터 검색 보완.

### 왜 거대 컨텍스트 윈도우로 안 하나? (4가지)
1. **Scale** — 실제 코퍼스는 수천만~수억 토큰
2. **Cost** — 큰 버퍼 재전송은 타겟 검색보다 비쌈
3. **Latency** — 입력 클수록 느림
4. **Accuracy** — 아주 긴 컨텍스트에서 성능 저하("lost in the middle")

### Indexing 파이프라인
`Source(PDF/docs/sheets/slides)` → `Extract(파일별 텍스트, MIME 인식)` → `Chunk(N자 윈도우+overlap)` → `Embed(청크별 벡터, 배치 API)` → `Store(chunk·vec·meta + ANN 인덱스)`
> **멱등성 규칙:** 한 문서 재인덱싱이 옛 청크를 중복/누출하면 안 됨. **delete-then-insert**가 가장 단순·정확한 패턴.

**Embedding 모델:** 텍스트 → 고정 길이 수치 벡터(유사 의미는 공간적으로 군집). 키워드 매칭 아님(의미 유사). 고정 길이(예 768차원). **cosine similarity**로 근접 측정.
참고: [TensorFlow Embedding Projector](https://projector.tensorflow.org) — 고차원 임베딩 3D 탐색.

**Chunking 전략:**
| 전략 | 적합 | 비용 |
|---|---|---|
| Fixed-size (N자/토큰) | 빠른 시작, 균일 문서 | 문장/아이디어 중간 절단 |
| Sentence/paragraph 경계 | 산문·기사·리포트 | 가변 크기, 검색 노이즈↑ |
| Semantic (모델 결정) | 긴 기술 문서 | $$ — 추가 LLM/임베딩 패스 |
| Document-as-chunk | 짧은 문서(<윈도우) | 단순하나 검색 페이로드↑ |
> **권고:** ~15줄. **1500/200**이 좋은 시작점. 검색 튜닝 *전에* 청킹부터 튜닝 — 나쁜 청크면 영리한 랭킹도 못 구함.

```python
def chunk_text(text, target=1500, overlap=200):
    text = (text or "").strip()
    if len(text) <= target:
        return [text] if text else []
    chunks, start, step = [], 0, target - overlap
    while start < len(text):
        end = min(start + target, len(text))
        # Prefer a paragraph break in the back half
        if end < len(text):
            min_break = start + target // 2
            for sep in ("\n\n", "\n", ". "):
                idx = text.rfind(sep, min_break, end)
                if idx != -1:
                    end = idx + len(sep)
                    break
        chunks.append(text[start:end].strip())
        if end == len(text):
            break
        start = max(end - overlap, start + step // 2)
    return [c for c in chunks if c]
```

**Embeddings 사용 예:**
```python
embedder.embed(["the cat sat on the mat",
                "a feline rested on a rug",
                "Python is a programming language"])
# → [
#     [0.012, -0.034, 0.901, ..., 0.005],   # 768 floats
#     [0.014, -0.030, 0.893, ..., 0.008],   # very close to row 1
#     [0.412,  0.107, 0.022, ..., -0.319],  # far from rows 1 and 2
#   ]
```
- 차원: 384/768/1536/3072 (높을수록 정밀·저장·검색 비용↑)
- cosine distance(정규화 벡터)로 유사도
- 제공자별 geometry — 다른 모델 임베딩은 비교 불가
- **결정적 요구:** 인덱스/쿼리 시 *같은 모델*. 항상. 가장 흔한 침묵의 RAG 버그.

**Vector Store 선택:**
| 선택 | 적합 | 한계 |
|---|---|---|
| numpy/in-memory dict | 프로토타입·테스트, <100K | 재시작 시 소실, 필터 없음 |
| Postgres + pgvector | 기존 Postgres, 메타 SQL join | ~1M 편함, >10M 튜닝 필요 |
| Managed (Pinecone/Weaviate/Qdrant/Vertex) | 스케일·멀티리전·하이브리드 | 비용·락인·러닝커브 |
| Azure AI Search | Azure, 네이티브 하이브리드 | Azure 전용 |
| SQLite + sqlite-vec | 단일 사용자·로컬·임베디드 | 단일 writer, 동시성 없음 |

```python
class InMemoryStore:
    def __init__(self):
        self.records = {}  # chunk_id -> record

    def upsert(self, records):
        for r in records:
            self.records[r["chunk_id"]] = r

    def search(self, query_vec, k=5):
        scored = [(_cosine_distance(
                       r["embedding"], query_vec), r)
                  for r in self.records.values()]
        scored.sort(key=lambda x: x[0])
        return [r for _, r in scored[:k]]
```
> 프로덕션은 O(n) 대신 HNSW 등 ANN(근사 최근접)으로 O(log n) 검색.

**배치 경제성:** 임베더는 요청당 하드 캡(예 Vertex: 250 입력 or 20K 토큰). 비라틴 문자는 더 조밀하게 토크나이즈. 적응형 폴백: 캡 에러 캐치 → 배치 절반 → 재시도.
**운영:** 문서별 상태 추적(fetching/extracting/embedding/indexed/failed), 매 배포마다 재임베딩 방지, 코퍼스 전체 backfill, delete-then-insert.

### RAG in 30 Lines
```python
# 1. RETRIEVE — embed the query, find top-K nearest chunks
query_vec = embedder.embed([question])[0]
hits = vector_store.search(query_vec, k=10)

# 2. AUGMENT — format chunks as a numbered context block
context = "\n\n".join(f"[{i+1}] {h['text']}" for i, h in enumerate(hits))

system_prompt = f"""You answer questions using only the provided context.
Cite each factual claim with the bracket number, e.g. "Sales grew 20% [3]".
If the context doesn't contain the answer, say so."""

user_prompt = f"CONTEXT:\n{context}\n\nQUESTION:\n{question}"

# 3. GENERATE — one Claude call
answer = client.messages.create(
    model="claude-sonnet-4-6",
    max_tokens=2048,
    system=system_prompt,
    messages=[{"role": "user", "content": user_prompt}],
).content[0].text
```

**검색 실패와 해법:**
- *다양성 부족* — verbose 문서 하나가 top-K 독점 → per-group 예산, MMR 다양화, 대체 랭킹 신호
- *관련은 있으나 무의미* — 코사인이 텍스트만 유사한 청크 반환 → reranker, 하이브리드(벡터+키워드), 쿼리 재작성
- *비특정 검색* — "그들 매출은?"이 광범위 임베딩 → 대화 히스토리로 self-contained 쿼리 재작성(싼 LLM 호출)
- *과도한 컨텍스트* — K=50이 100K+ 토큰 → 청크 예산, 문서별 그룹, 가차없이 트림

**Context 조립:** 단일 문서의 연속 청크 묶기, 사이에 `[…]` 마커, `[1][2][3]` 번호로 인용 강제, 인라인 메타데이터(파일명·날짜·저자·URL), 비정형 청크 + 1st-party 정형 레코드 혼합("company card").

**Citations — why:** 사용자 검증, 디버깅, hallucination 방어(강제 귀속), 소스 접근 UI. **흔한 실패:** 없는 번호 발명, 순서 뒤섞임, 필요한 곳 인용 누락, 인용-주장 불일치, 모호한 귀속.
```python
# 모델이 쓴 인용 번호 파싱; 범위 밖은 제거
import re
used = [int(n) for n in re.findall(r"\[(\d+)\]", answer)]
valid = [n for n in used if 1 <= n <= len(retrieved_chunks)]
```

**Single-turn vs Agentic RAG:**
| | Single-turn | Agentic |
|---|---|---|
| 검색 횟수 | 1 검색 + 1 LLM | 여러 턴에 걸쳐 N 검색 |
| 쿼리 | self-contained/재작성 | 모델 주도 검색 결정 |
| 지연 | ~1s + LLM | N×(검색+LLM) |
| 비용 | 예측 가능 | 유계지만 가변 |
| 적합 | 룩업·요약·범위 알려진 비교 | 개방형 리서치, multi-hop |
> **기본은 single-turn.** single-turn이 증명적으로 불가능할 때만 agentic 추가.

**Project:** 코퍼스 인덱싱 + 기존 챗 앱에 RAG 추가. 다운로드: [rag-starter.zip](https://ksetp.netlify.app/assets/context/rag-starter.zip) — `documents/`(소형 코퍼스), `indexer.py`(청크/임베드/저장 스텁), `backend/app.py`(RAG+인용 스텁), `frontend/`(인용 표시 UI), `requirements.txt`, `README.md`.
단계: ① Index ② Retrieve(top-K) ③ Augment(`[n]` 블록 + 인용 규칙) ④ Generate(단일 Claude 호출 유지) ⑤ Report(질문 5개로 답 품질·인용 정확도, 강점 2/약점 2). 발표: 청킹 선택(크기·임베더), 동작하는 질문 1·실패 질문 1·해법 제안.

---

## Module 5 · Architecture & Agents — agent loop 중심 서베이

모든 에이전트 시스템의 핵심: **~20줄 agent loop** — Claude에 messages+tools 전송 → tool call 디스패치 → 결과 append → `end_turn`까지 반복. 나머지(Claude Code, Cursor, 커스텀)는 그 위의 "두꺼운 하니스".

- **Claude Code 아키텍처** — 기본 루프 + UI 레이어 + 권한 게이트 + ~25개 내장 도구 + MCP 지원 도구 레지스트리 + 멀티스코프 메모리(project/user/conversation/컨텍스트 압축).
- **Subagents** — 제한된 도구셋·전용 system prompt로 자식 Claude 세션 spawn → 컨텍스트 격리·전문화. 부모는 요약만 수신 → 병렬성·재귀적 분해.
- **Memory Scopes (5단계)** — conversation(현 세션), session(로그인 지속), user(영속 선호), project(레포 컨벤션 `CLAUDE.md`), world(벡터 스토어·지식베이스).
- **Multi-Model Routing** — 싼 모델(Haiku)을 분류기로 써서 적절히 비싼 모델로 라우팅 → 비용 한정.
- **Prompt Caching** — 정적 system prefix를 cacheable로 표시 → 5분 윈도우 내 첫 호출 후 반복 비용 ~90%↓.
- **Long-Running Tasks** — 백그라운드 잡, 서브프로세스 모니터링, 예약 wake-up, webhook으로 비동기. 일시정지 중 상태를 어디 둘지 결정 필요.
- **Progress Streaming** — 각 단계서 사람이 읽을 이벤트 emit, 전송계층과 분리(SSE/WebSocket/로그), 종료는 `done`/`error`.
- **Computer Use** — 스크린샷 + 마우스/키보드로 API 없는 자동화. 비용·취약성과 능력의 트레이드오프.
- **Safety** — 권한 게이트(읽기 항상 허용, 파괴적 작업 확인, 실행 샌드박스, 하드 거부) + 하드 리밋(스텝 예산, 토큰 캡, 시간 데드라인, rate limit, scope 제한).

**Project:** 데이터 분석가 에이전트 스타터 — SQLite 위 read-only SQL 도구 3개로 루프 시연. 안전 패턴 2개 기구현(구조적 read-only DB, max-steps 예산). 다운로드: [agent-app.zip](https://ksetp.netlify.app/assets/agents/agent-app.zip).
**Beyond:** Anthropic **Managed Agents (beta)** — 소유 모델 역전(Anthropic이 루프 실행, 당신은 도구 정의+이벤트 스트림 반응) → 수동 메시지 리스트 관리 제거, 무료 멀티턴 세션.

---

## Module 6 · Production Considerations — eval / security / observability

배포 전 3가지 질문:
- **Does it work?** — eval & testing, 목적별 메트릭으로 사용자 전에 회귀 포착
- **Can it be trusted?** — guardrails & security (prompt injection, 데이터 누출, 위험 행동 방어)
- **Can you operate it?** — observability & latency 관리

**Eval 사다리:** 싼 결정론적 체크(schema 검증, regex) → golden dataset 테스트 → LLM-as-judge(개방형 품질) → human review(보정). 핵심: 점수를 시간에 따라 추적 — 일회성이 아니라 대시보드.

**Security 현실:** *LLM은 지시와 데이터를 신뢰성 있게 구분 못 함.* 계층 방어 — least-privilege 도구, 비가역 행동엔 human-in-the-loop, 신뢰 경계 분리, 입출력 검증. **가장 위험한 것: 검색된 문서를 통한 간접 prompt injection.**

**Operations:** 1일차부터 구조화 텔레메트리 — trace(요청 트리), 메트릭(latency p95/p99), 레닥션된 로그. *output 토큰이 latency 지배* → 스트리밍·토큰 캡·캐싱·라우팅. 인프라 타임아웃 초과 장기 작업은 잡 큐+폴링으로 HTTP에서 분리.

---

## Module 7 · Workshop — 빌드 데이

준비 자료 없음. 아이디어 피칭 → 솔로/페어 작업 → 강사 지원.
- "**첫 30분 안에 무엇을 만들지 피칭**"
- 강사가 설계·디버깅·코드리뷰 지원
- 종료 시 간단 데모(슬라이드 1장 or 화면공유)
- 목표는 polish가 아니라 **shape** — E2E LLM 앱 빌드 감각

**프로젝트 옵션 — 기존 확장:** 챗 앱에 도구 레지스트리(weather/math/web search), 추출기를 MCP 서버로 래핑(Claude Desktop 호출), RAG 후속 질문용 쿼리 재작성, 인용 재번호+UI, 스트리밍(SSE), 전체 히스토리 대화 메모리.
**Greenfield:** 일상 API용 MCP 서버(Notion/Linear/커스텀 DB), 비용 최적 멀티모델 라우터, 레포 분석 subagent 탐색기, 파일 변경 감지 에이전트, API 없는 앱 자동화 computer-use 에이전트.
> **핵심 조언:** 끝낼 수 있을 만큼 작게. 동작하는 작은 것이 반쯤 만든 야심작을 이긴다.

**Final Quiz (10문항):** 통과 암호로 잠긴 2세트. 주제 — API statefulness, hallucination, structured outputs, MCP 아키텍처, RAG 검색, 시맨틱 검색, agent loop, subagents, 실패 모드, 테스트 전략.

---

## 부록 · 스타터 자료 다운로드 모음

| 모듈 | 파일 | URL |
|---|---|---|
| 2 Foundations | chat-app.zip | <https://ksetp.netlify.app/assets/foundations/chat-app.zip> |
| 3 Tools | extract-starter.zip | `https://ksetp.netlify.app/assets/tools/extract-starter.zip` |
| 4 Context | rag-starter.zip | <https://ksetp.netlify.app/assets/context/rag-starter.zip> |
| 5 Agents | agent-app.zip | <https://ksetp.netlify.app/assets/agents/agent-app.zip> |
