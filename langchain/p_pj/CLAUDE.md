# 당진시 안내 챗봇 (개인 미니 프로젝트)

강의 개인 미니 프로젝트. 로컬 LLM 에이전트가 당진시청 정보를 안내하는 챗봇.

## 작업 방식 (반드시 지킬 것)

- **코드는 사용자가 직접 작성한다.** Claude는 작성된 코드를 읽고 **고칠 부분과 이유를 자세히 설명**한다.
- 사용자가 "고쳐줘", "바꿔줘", "추가해줘", "만들어줘", "작성해줘"처럼 **명시적으로 요청하기 전에는 파일을 수정·생성·삭제·되돌리지 않는다.** (예: docstring 작성은 요청받아서 Claude가 함)
- "뭐가 문제지?", "이건 뭐야?" 같은 질문은 **설명 요청**이다. 대화창에서 설명과 예시 코드만 제공한다.
- 사용자는 파이썬/JS 기초를 배운 학생이다. 문법과 메서드를 **단계별로, 초보자 눈높이로** 설명한다.
- 설명에는 질문한 코드 줄을 먼저 붙여서, 사용자가 위로 스크롤하지 않아도 되게 한다.
- 정답을 바로 주기보다 **예상해 보게 하고 → 실행해서 확인 → 힌트 주고 직접 작성**하는 방식이 잘 맞았다. 사용자가 "확인 부탁해"라고 하면 파일을 읽고, 실제로 실행해서 결과 표로 보여준다 (파일은 안 건드리고 복사본이나 `-c`로 실행).
- **모델을 호출하는 테스트는 실행 전에 사용자에게 먼저 묻는다.** 크롤링이나 도구 `.invoke()`처럼 모델을 안 쓰는 실행은 바로 해도 됨.
- git commit/push는 사용자가 직접 한다. Claude는 커밋 메시지 추천과 CLAUDE.md 정리만. 밖으로 나가는 작업은 확인을 받고 한다.

## 구성

| 파일 | 역할 |
|---|---|
| `main.py` | FastAPI 서버. `GET /` → `/view/index.html`, `POST /chat` → `{"answer": ...}` |
| `chat_model.py` | 요청 형식 `ChatModel(q: str)` |
| `agent_service.py` | `ChatOllama` + `create_agent`. `ask(question) -> str`. 도구 3개 등록 |
| `tools.py` | 도우미 `fetch_notices()` + 도구 `get_today`, `get_city_info`, `search_notices` |
| `crawl_test.py` | 크롤링 7단계 연습 기록 (도구로 옮김 완료, 지우지 않고 보관) |
| `view/index.html`, `view/style.css` | HTML + JS(axios CDN) 채팅 화면, 세로형 520px 레이아웃, 당진시 로고 |

- 실행: `p_pj` 폴더에서 `uvicorn main:app --reload` → `http://127.0.0.1:8000`
- DB 없음. Next.js는 사양 때문에 쓰지 않고 HTML+JS로 결정.
- `ask()` 함수 모양을 유지하면 `main.py`와 프론트는 고칠 필요 없음.
- 프론트 ↔ 서버 약속: 요청 키 `q` ↔ `ChatModel.q`, 응답 키 `'answer'` ↔ `res.data.answer`

## 모델

- `qwen3:4b-instruct-2507-q4_K_M` (Ollama), 설정: `temperature=0`, `reasoning=False`, `num_predict=200`, `keep_alive="5m"`, `num_gpu=0`
- 2026-09-14 학원 PC 비교 테스트 결과 선택 (도구 호출 3/3 정확, 한국어 무난)
  - `Qwen3.5-2B`(unsloth GGUF): 같은 말 반복 루프 → 탈락
  - `EXAONE-4.0-1.2B`: 빠르지만 "당진시는 경기도" 등 사실 오류, 도구 호출 1/3 → 탈락
  - `exaone3.5:2.4b`: tools 미지원 → 탈락
- 작은 모델은 지역 정보를 지어냄 (시청 주소 오답 등) → **정확한 정보는 도구로 넣는다**

## PC 환경 메모

### 학원 PC
- RAM 7.4GB, GPU GTX 760(2GB). **GPU 일부 사용 중 `ggml_vulkan: device lost` → Ollama 500 오류** → `num_gpu=0`(CPU 전용)으로 해결
- 도구 목록이 붙은 첫 호출은 CPU에서 수 분 걸림(273초 측정). 두 번째부터 빠름 → 발표 전 워밍업 필요

### 두 번째 PC (2026-09-14 설정 완료)
- Ryzen 5 3600, RAM 16GB, **RTX 3070(8GB)**, SSD 512GB, Windows 10, Python 3.14.5, Ollama 0.34.0
- clone → `.venv` → `pip install -r requirements.txt` → `ollama pull` 완료. 패키지 전부 import 정상 (langchain 1.4.0)
- 평소 남은 RAM이 4GB 정도로 적음
- 이 PC에서는 `num_gpu=0`을 주석 처리해서 GPU로 테스트함 → 도구 1회 사용 질문이 **17.5초** (모델 첫 로딩 포함)
- ⚠️ **`#num_gpu=0` 상태로 커밋하면 학원 PC에서 500 오류.** 커밋 전에 되돌리거나 파일 제외 필요
- 할 일: 컴퓨터마다 `num_gpu`를 다르게 쓰는 방법 알려주기 (예: 환경변수)

### 새 PC 처음 설정
1. `git pull` (또는 clone)
2. `langchain/p_pj`에서 `python -m venv .venv` → `.\.venv\Scripts\Activate.ps1` → `pip install -r requirements.txt`
3. Ollama 설치 후 `ollama pull qwen3:4b-instruct-2507-q4_K_M`
4. PyCharm 인터프리터를 `p_pj\.venv\Scripts\python.exe`로 지정

## 진행 상황 (2026-09-15 기준)

### 완료
- 서버, 모델, 프론트(스타일, 로고, 오류 처리) 동작 확인
- 에이전트 전환: `create_agent(llm, tools=tools, system_prompt=sys_prompt)`, 결과는 `result["messages"][-1].content`
- 도구 1 `get_today`: `"2026-09-14 (월요일)"` 형식 반환 (날짜만 주면 모델이 요일을 틀렸음)
- 도구 2 `get_city_info`: 당진시청 누리집 하단에서 확인한 정적 정보. **에이전트 등록 완료**
- 크롤링 7단계 전체 완료 (`crawl_test.py`, 커밋 `71bcc12`)
- 도구 3 `search_notices`: `tools.py`로 옮기고 **에이전트 등록 완료**
  - 모델 테스트: `"당진 청년 사업 최신꺼 있나?"` → Ollama 호출 2번(도구 사용), 크롤링한 실제 최신 글 제목으로 답변

### `tools.py`의 공지사항 검색 구조
- `fetch_notices(keyword) -> list` (`@tool` 없음, 모델 눈에 안 보임): `crawl_test.py`의 `search()`에서 print만 뺀 것
  - 반환: `None` 연결 실패 / `[]` 결과 없음 / dict 목록
- `@tool search_notices(keyword) -> str`
  - `result == [] and " " in keyword`면 `keyword.split()[0]`로 재검색
  - `None` → `"당진시청에 연결 할 수 없습니다"`
  - `[]` → `f"'{keyword}' 검색 결과가 없습니다."`
  - 목록 → 최대 5개, 한 줄씩 `제목 | 부서: ... | 등록일: ... | 글번호: ...`, `"\n".join(lines)`
- docstring(Claude가 작성): 무엇 → 언제 → keyword 규칙(띄어쓰기 없는 단어 하나) → 예시 3개(여러 단어 중 고르기 / 문장에서 뽑기 / "당진" 빼기) → 결과 없으면 다른 단어로 재검색
- 도구 결과 형식은 **모델이 읽는 재료**: `|`로 제목 경계 구분, 이름표로 추측 방지, 5개로 속도 확보, `글번호`는 도구 4 `get_article` 호출용
- 모델 없이 테스트: `search_notices.invoke({"keyword": "청년"})`
- 다듬기 거리(선택): 연결 실패 안내에 "잠시 후 다시 시도해 주세요" 추가, 목록 첫 줄에 `'{keyword}' 공지사항 검색 결과 (최신순)` 넣기(재검색된 단어를 모델이 알게), `fetch_notices` 안 빈 줄 정리, `return ("...")` 괄호 제거

### 크롤링 참고 (당진시청 공지사항)
- 검색 주소: `https://www.dangjin.go.kr/cop/bbs/BBSMSTR_000000000013/selectBoardList.do?searchCnd=0&searchWrd=청년`
- robots.txt: 공지사항(`...013`) 허용. 자유게시판 `...004`, 홍보게시판 `...005`는 금지
- 정적 페이지(requests 가능), GET 동작. `searchCnd`(0 제목/1 글내용/2 부서명), `searchWrd`, `pageIndex`
- 선택자: 줄 `table.basic_table tbody tr`, 제목·링크 `.list_subject a`(첨부파일 `<a>`도 있어서 `tr a`는 안 됨), 글번호 `href`의 `nttId=` 뒤, 부서 `td.problem_name`, 등록일 `td.date`
- 한 페이지 10건, 최신순. 결과 없으면 `tr` 하나에 "검색 결과가 없습니다."만 있고 `<a>` 없음
- **함정: 띄어쓰기 있는 검색어는 0건** (입력한 글자 전체가 붙어 있는 제목만 찾음)

### 남은 정리 (사용자에게 알려줄 것)
- `agent_service.py` `ask()`: 확인용 `print` 2줄과 `for ... return` 루프 남아 있음 → 마지막 `return`만 남기면 됨
- `agent_service.py` 18줄 주석이 `num_gpu=0` 옆에 있지만 실제로는 `keep_alive` 설명
- **시스템 프롬프트 문제**: 답변 끝에 "더 자세한 정보는 누리집에서 확인하세요. 정확한 정보는 당진시청(...)에서 확인해 주세요."처럼 **안내 문구가 두 번** 붙음. 24줄 "모르는 내용은 ... '정확한 정보는 ...'라고 안내"를 작은 모델이 조건 없이 매번 붙이고, "3문장 이내"를 채우려 반복함 → 도구 결과를 바탕으로 답하라는 내용 추가, 안내 문구는 도구로 못 찾았을 때만
- `requirements.txt`에 `requests` 명시 필요 (현재 langchain 의존성으로 우연히 설치됨)
- `index.html`: 답변 대기 중 `.example` 버튼이 안 막혀서 요청이 겹칠 수 있음, axios `<script>`가 `</head>`와 `<body>` 사이에 있음

### 다음 할 일
1. `ask()`의 `for`를 `m.pretty_print()`로 바꿔서 **모델이 넣은 keyword 확인** (지난 테스트는 청년 결과였으나 `'청년'`인지 `'청년 사업'`+재검색인지 모름)
2. 도구 선택 테스트 (사용자에게 실행 여부 묻기)
   - `당진시청 전화번호 알려줘` → `get_city_info`
   - `오늘 무슨 요일이야?` → `get_today`
   - `요즘 일자리 모집하는 거 있어?` → `search_notices` (keyword=`일자리`?)
   - `안녕` → 도구 없음 (Ollama HTTP 요청 1번)
3. 시스템 프롬프트 다듬기 (위 "안내 문구 두 번" 문제)
4. 도구 4 `get_article(ntt_id)`: 상세 페이지 `selectBoardArticle.do?nttId=...` — 사용자가 같은 7단계로 직접 분석해 보는 연습 문제. 본문은 800자 정도로 자르기. `fetch_notices`/`search_notices`처럼 도우미 + 도구로 나누기
5. `num_gpu` PC별 설정
6. 발표 준비: 서버 시작 시 도구를 쓰는 질문으로 워밍업, "모델만 쓸 때 틀린 답 vs 도구 붙인 뒤 정확한 답" 비교

## 이미 설명한 내용 (다시 물으면 짧게 짚고 넘어가기)

- 프론트 → 서버 → 응답 전체 흐름 (`GET /` 리다이렉트, StaticFiles, `axios.post` → `ChatModel` → `ask()` → dict → JSON → `res.data.answer`)
- `agent.invoke({"messages": [{"role": "user", "content": question}]})` 구조, 메시지가 쌓이는 과정, `[-1].content`에서 딕셔너리/리스트/객체 꺼내기
- 질문 문자열이 입력창부터 `ask()`까지 그릇만 바뀌며 전달되는 과정
- axios 응답 객체(`res.data`, `res.status`), `await`/Promise (요청 → 기다림 → 받기)
- 키 이름(`'answer'`, `q`)은 프론트·서버 연결, 변수 이름은 각자 안에서만
- Traceback 아래에서 위로 읽기, `site-packages` 줄 건너뛰기, `SyntaxError`(실행 전) vs 실행 중 오류
- `try`/`except requests.RequestException`, `if`/`elif`/`else`로 `None`/`[]`/목록 나누기, `"\n".join()`, 슬라이스 `[:5]`
- docstring = 모델에게 주는 도구 사용 설명서 (모델은 이름·설명·매개변수만 보고 코드는 못 봄)
- `@tool` 함수는 `.invoke({"매개변수": 값})`으로 호출
- import만으로는 안 되고 `tools` 리스트에 넣어야 모델이 도구를 앎
- Ollama HTTP 요청 2번 = 도구 사용 (1번째 도구 결정, 2번째 최종 답)
- **도구 `return`은 모델이 읽는 재료, `ask()` `return`은 사용자에게 가는 답**. 답이 이상하면 재료 문제(tools.py)인지 말투 문제(시스템 프롬프트)인지 나눠 보기

## 사용자가 자주 겪은 실수 (설명할 때 참고)

- PyCharm 자동 import가 엉뚱한 모듈을 가져옴: `from datetime import time`, `from json import tool`, `from langchain_core.tracers import langchain`, `from idlelib.debugger_r import ...`
- 자기 자신 import (`import agent_service as llm`)
- `=`/`==`, `import time` vs `from time import time` 짝 맞추기
- `select` vs `select_one`, 딕셔너리 `{'a': b}` vs 세트 `{'a', b}`
- 주석 처리로 `for` 블록이 비어 `IndentationError`
- 가상환경이 안 켜진 채 실행해 `ModuleNotFoundError`
- JS 문법을 파이썬에 씀: `null`(→ `None`), `&`(→ `and`)
- 콜론 빠뜨림 (`if ... continue`, `except ...`), 들여쓰기 칸 수 섞임 (8칸/4칸, 공백 1칸)
- **`for` 안에 `return`을 넣어 첫 바퀴에서 끝남** (`ask()`, `search_notices` 모두) → 들여쓰기 한 칸이 실행 시점을 바꾼다고 설명함
- `return (a, b)`처럼 쉼표를 넣어 **튜플**을 돌려줌 (`print(a, b)`와 헷갈림) → f-string으로 문자열 하나
- 따옴표 붙은 `"keyword"`(문자열)와 변수 `keyword` 혼동, 매개변수를 함수 밖에서 사용
- `return` 값을 변수로 안 받음 (`search(keyword)`만 호출)
- `""`(빈 문자열)과 `" "`(공백) 혼동 → `"" in 문자열`은 항상 True
- `if None:`처럼 무엇이 None인지 빠뜨림 (→ `if result is None:`)
- `for` 뒤에 조건을 넣음 (`for r in result and not None`) → 조건은 `if`로
- 코드 붙여넣기 중 `url = "url = "...""`처럼 중복, 이전 형식의 쉼표·괄호가 남음
- 계획한 함수 이름을 서로 바꿔 붙임 (도우미/도구)
